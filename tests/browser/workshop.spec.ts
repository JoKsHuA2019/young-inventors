import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import data from "../../content/catalog.json";
const url = (id: string) =>
  "/projects/" + data.find((l) => l.id === id)!.slug + "/";
for (const lesson of data) {
  test(`${lesson.id}: story, interactive model, helpers, notes and printing`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url(lesson.id));
    await expect(
      page.getByRole("heading", { name: lesson.title, exact: true }).first(),
    ).toBeVisible();
    const nav = page.locator(".step-nav");
    await nav
      .getByRole("button", { name: "Try the model", exact: true })
      .click();
    await expect(page.locator(".preview-box")).toBeVisible();
    const controls = page.locator(".preview-controls");
    const button = controls.getByRole("button").first();
    if (await button.count()) await button.click();
    const range = controls.locator("input[type=range]").first();
    if (await range.count()) {
      await range.focus();
      await page.keyboard.press("ArrowRight");
    }
    await nav.getByRole("button", { name: "Make it", exact: true }).click();
    await page
      .getByRole("button", { name: "Open the matching build guide" })
      .click();
    await expect(
      page
        .locator(".helper-guide")
        .first()
        .getByRole("heading", { name: "Complete connection table" }),
    ).toBeVisible();
    await expect(
      page.locator(".helper-guide").first().locator(".build-actions>li"),
    ).toHaveCount(7);
    await page
      .getByRole("button", { name: "Our project", exact: true })
      .click();
    await nav.getByRole("button", { name: "Find a clue", exact: true }).click();
    await page.getByRole("button", { name: "Show another clue" }).click();
    await expect(page.locator(".hint-list>li")).toHaveCount(2);
    await nav
      .getByRole("button", { name: "Your notebook", exact: true })
      .click();
    await page
      .getByLabel("What are you wondering about next?")
      .fill("Try one change and compare.");
    await page.getByRole("button", { name: "I’m done for now" }).click();
    await page.reload();
    await expect(
      page.getByLabel("What are you wondering about next?"),
    ).toHaveValue("Try one change and compare.");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".print-only")).toBeVisible();
    await expect(
      page.locator(".print-only .diagram-disclosure"),
    ).toHaveAttribute("open", "");
    await expect(
      page.locator(".print-only .diagram-disclosure img"),
    ).toBeVisible();
    await expect(
      page.locator(".print-only").getByText("Not recorded", { exact: true }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}
test("complete C01 investigation preserves evidence, exports and deletes", async ({
  page,
}) => {
  await page.goto(url("c01"));
  const nav = page.locator(".step-nav");
  await nav.getByRole("button", { name: "Your guess", exact: true }).click();
  await page.getByLabel("I think it will go dark").check();
  await page.getByLabel("What makes you think that?").fill("There is a gap.");
  await nav.getByRole("button", { name: "Test & notice", exact: true }).click();
  await expect(page.getByText("Let’s get the real setup ready.")).toBeVisible();
  await nav.getByRole("button", { name: "Make it", exact: true }).click();
  await page.getByLabel("My helper has prepared and checked").check();
  await nav.getByRole("button", { name: "Test & notice", exact: true }).click();
  await page
    .getByLabel("What happened in your real experiment?")
    .fill("Our light was dark with the return open.");
  await page.getByLabel("We noticed a result").check();
  await page.goto("/notebook/");
  await expect(page.getByLabel("I saw…")).toHaveValue(
    "Our light was dark with the return open.",
  );
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export text", exact: true }).click();
  expect((await dl).suggestedFilename()).toBe("my-invention-notebook.txt");
  await page
    .getByRole("button", { name: "Clear notebook", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep them" }).click();
  await expect(page.locator(".notebook-entry")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Clear notebook", exact: true })
    .click();
  await page.getByRole("button", { name: "Erase these notes" }).click();
  await expect(page.locator(".notebook-entry")).toHaveCount(0);
});
test("filters combine and inventory quantities affect matches", async ({
  page,
}) => {
  await page.goto("/explore/");
  await expect(page.locator(".project-card")).toHaveCount(30);
  await page
    .getByRole("button", { name: "Paper & cardboard", exact: true })
    .click();
  expect(await page.locator(".project-card").count()).toBe(
    data.filter((l) => l.board === "none").length,
  );
  await page.getByRole("button", { name: "35 minutes or less" }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear choices" }).click();
  await page.getByLabel("Search projects").fill("nonexistent penguin");
  await expect(
    page.getByRole("heading", { name: "Let’s try a different combination." }),
  ).toBeVisible();
  await page.goto("/my-parts/");
  await page.getByText("Have a kit already?", { exact: true }).click();
  await page
    .getByLabel("Choose a kit", { exact: true })
    .selectOption("circuit");
  await page.getByRole("button", { name: "Add these to my box" }).click();
  await page.reload();
  await page.getByRole("button", { name: /^In my box/ }).click();
  await expect(
    page.getByRole("spinbutton", { name: "AA alkaline batteries in my box" }),
  ).toHaveValue("2");
  await page.goto("/explore/");
  await page.getByRole("button", { name: "Use my materials" }).click();
  expect(await page.locator(".project-card").count()).toBeGreaterThan(0);
});
test("storage failure keeps current notes and offers export", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Full", "QuotaExceededError");
    };
  });
  await page.goto(url("m01"));
  await page
    .locator(".step-nav")
    .getByRole("button", { name: "Your guess", exact: true })
    .click();
  await page.getByLabel("Farther from the pivot").check();
  await expect(page.getByRole("status")).toContainText("staying in this tab");
  await page
    .getByRole("link", { name: "My notebook", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "My invention notebook" }),
  ).toBeVisible();
  await expect(page.getByLabel("I think…")).toHaveValue(
    "Farther from the pivot",
  );
});
test("reaction game rejects early press and reset cancels timers", async ({
  page,
}) => {
  await page.goto(url("p06"));
  await page
    .locator(".step-nav")
    .getByRole("button", { name: "Try the model", exact: true })
    .click();
  await page.getByRole("button", { name: "Start a turn" }).click();
  await page
    .getByRole("button", { name: "Press the button", exact: true })
    .click();
  await expect(
    page.getByText("An early press is a clue, too. Try waiting for the light."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start a turn" }).click();
  await page.getByRole("button", { name: "Reset game" }).click();
  await expect(
    page.getByText("Ready to investigate a fair start?"),
  ).toBeVisible();
});
for (const width of [360, 768, 1440])
  test(`responsive home and lesson at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".hero-visual img")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    if (width < 801) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(
        page.getByRole("navigation", { name: "Main navigation" }),
      ).toBeVisible();
    }
    await page.goto(url("s01"));
    await page
      .locator(".step-nav")
      .getByRole("button", { name: "Try the model", exact: true })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".preview-box")).toBeVisible();
    await page.screenshot({
      path: `test-results/lesson-${width}.png`,
      fullPage: true,
    });
  });
for (const route of ["/", "/explore/", "/my-parts/", "/notebook/", url("c01")])
  test(`automated accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
test("reduced motion and keyboard model controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url("p01"));
  await page
    .locator(".step-nav")
    .getByRole("button", { name: "Try the model", exact: true })
    .click();
  const range = page.getByRole("slider");
  await range.focus();
  await page.keyboard.press("ArrowRight");
  await expect(range).toHaveValue("750");
  expect(
    await page
      .locator(".pulsing")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
test("missing illustration leaves descriptive fallback", async ({ page }) => {
  await page.route("**/assets/c-story-sheet.jpg", (route) => route.abort());
  await page.goto(url("c01"));
  await expect(page.locator(".image-fallback").first()).toContainText(
    "picture couldn’t open",
  );
});
test("a revised lesson keeps notes and explains its new starting place", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "young-inventors.workshop.v1",
      JSON.stringify({
        version: 1,
        inventory: {},
        progress: {
          c01: {
            version: "older-edition",
            step: 4,
            checked: true,
            finished: true,
            observation: "We found a gap in the loop.",
          },
        },
      }),
    );
  });
  await page.goto(url("c01"));
  await expect(page.getByRole("status")).toContainText(
    "Your ideas are still in your notebook",
  );
  await expect(
    page.getByRole("heading", { name: "A little help for Mouse" }),
  ).toBeVisible();
  const saved = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("young-inventors.workshop.v1")!).progress
        .c01,
  );
  expect(saved.observation).toBe("We found a gap in the loop.");
  expect(saved.checked).toBe(false);
  expect(saved.finished).toBe(false);
  expect(saved.version).toBe("woodland-1");
});
test("all original bookshelf links resolve", async ({ page, request }) => {
  await page.goto("/grownups/");
  const links = await page
    .locator('a[href^="/originals/"]')
    .evaluateAll((as) =>
      as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!),
    );
  for (const link of links) {
    const response = await request.head(link);
    expect(response.ok(), link).toBe(true);
  }
});
