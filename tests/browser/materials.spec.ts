import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { STORAGE_KEY } from "../../lib/state";

const saved = (inventory: Record<string, number>) => ({
  format: "young-inventors-making-box",
  version: 1,
  inventory,
});
const openCopy = async (page: Page, value: unknown) => {
  await page.getByLabel("Open a making-box copy").setInputFiles({
    name: "my-making-box.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(value)),
  });
};
const inventory = (page: Page) =>
  page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) || "{}").inventory,
    STORAGE_KEY,
  );

test("supplies are discoverable, countable with the keyboard, and saved after a refresh", async ({
  page,
}) => {
  await page.goto("/my-parts/");
  await expect(
    page.getByRole("heading", { name: "My making box", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: "Paper in my box", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: "AA alkaline batteries in my box" }),
  ).toHaveCount(0);
  const add = page.getByRole("button", { name: "Add paper", exact: true });
  await add.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("spinbutton", { name: "Paper in my box", exact: true }),
  ).toHaveValue("2");
  await page.getByRole("button", { name: "Remove paper", exact: true }).click();
  await page.getByLabel("Find a material", { exact: true }).fill("AA");
  await page
    .getByRole("button", { name: "Add aa alkaline batteries", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: /^In my box/ }).click();
  await expect(page.locator(".material-row")).toHaveCount(2);
  await expect(
    page.getByRole("spinbutton", { name: "Paper in my box", exact: true }),
  ).toHaveValue("1");
  await expect(
    page.getByRole("spinbutton", { name: "AA alkaline batteries in my box" }),
  ).toHaveValue("1");
  await expect(page.locator(".save-state")).toContainText(
    "Saved automatically",
  );
  await expect(page.locator(".material-project")).toHaveCount(3);
  await page.getByRole("button", { name: "See a few more ideas" }).click();
  await expect(page.locator(".material-project")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Boards & sensors", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Let’s look on another shelf." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Show all supplies", exact: true })
    .click();
  await expect(
    page.getByRole("spinbutton", { name: "Arduino Uno R3 in my box" }),
  ).toBeVisible();
});

test("kit checklists only add selected pieces and never double count a kit", async ({
  page,
}) => {
  await page.goto("/my-parts/");
  await page.getByLabel("Find a material", { exact: true }).fill("AA");
  await page
    .getByRole("spinbutton", { name: "AA alkaline batteries in my box" })
    .fill("8");
  const addKit = async () => {
    await page.getByText("Have a kit already?", { exact: true }).click();
    await page
      .getByLabel("Choose a kit", { exact: true })
      .selectOption("circuit");
    await page.getByRole("checkbox", { name: "Red LED" }).uncheck();
    await page.getByRole("button", { name: "Add these to my box" }).click();
  };
  await addKit();
  await expect(page.locator(".material-row")).toHaveCount(5);
  expect(await inventory(page)).toMatchObject({ aa_cells: 8, jumpers: 4 });
  expect((await inventory(page)).red_led).toBeUndefined();
  await addKit();
  expect(await inventory(page)).toMatchObject({ aa_cells: 8, jumpers: 4 });
});

test("backup download and restore preview preserve materials and notebook entries", async ({
  page,
  browser,
}) => {
  await page.goto("/my-parts/");
  await page
    .getByRole("spinbutton", { name: "Paper in my box", exact: true })
    .fill("3");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save a copy", exact: true }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("my-making-box.json");
  const raw = await readFile((await download.path())!, "utf8");
  expect(JSON.parse(raw).inventory).toEqual({ paper: 3 });
  const otherContext = await browser.newContext();
  const other = await otherContext.newPage();
  await other.goto("http://127.0.0.1:4173/my-parts/");
  await openCopy(other, JSON.parse(raw));
  await expect(
    other.getByRole("heading", { name: "Your saved making box", exact: true }),
  ).toBeFocused();
  expect(await inventory(other)).toBeUndefined();
  await other
    .getByRole("button", { name: "Use this saved list", exact: true })
    .click();
  await other.reload();
  expect(await inventory(other)).toEqual({ paper: 3 });
  await otherContext.close();

  await page.goto("/projects/c01-the-light-that-wouldn-t-turn-on/");
  await page
    .locator(".step-nav")
    .getByRole("button", { name: "Your notebook", exact: true })
    .click();
  await page
    .getByLabel("What are you wondering about next?")
    .fill("Could paper make a lampshade?");
  await page.goto("/my-parts/");
  await openCopy(page, saved({ paper: 1, tape: 2 }));
  expect(await inventory(page)).toEqual({ paper: 3 });
  await page.getByRole("button", { name: "Keep my current box" }).click();
  expect(await inventory(page)).toEqual({ paper: 3 });
  await openCopy(page, saved({ paper: 1, tape: 2 }));
  await page.getByRole("button", { name: "Combine with my box" }).click();
  expect(await inventory(page)).toEqual({ paper: 3, tape: 2 });
  await openCopy(page, saved({ red_led: 4 }));
  await page.getByRole("button", { name: "Use this saved list" }).click();
  expect(await inventory(page)).toEqual({ red_led: 4 });
  await page.goto("/notebook/");
  await expect(page.getByLabel("Next time…")).toHaveValue(
    "Could paper make a lampshade?",
  );
});

test("an invalid copy leaves the current box intact", async ({ page }) => {
  await page.goto("/my-parts/");
  await page.getByRole("button", { name: "Add paper", exact: true }).click();
  await openCopy(page, saved({ paper: -4 }));
  await expect(page.locator(".box-file-error")).toContainText(
    "Your current box is still here",
  );
  await expect(page.locator(".box-restore")).toHaveCount(0);
  expect(await inventory(page)).toEqual({ paper: 1 });
});

test("when browser saving is blocked, the list stays usable and can be downloaded", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Full", "QuotaExceededError");
    };
  });
  await page.goto("/my-parts/");
  await page.getByRole("button", { name: "Add paper", exact: true }).click();
  await expect(page.locator(".save-state")).toHaveText(
    "Keeping this list in this tab for now",
  );
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Save workshop copy", exact: true })
    .click();
  expect(
    JSON.parse(await readFile((await (await downloadEvent).path())!, "utf8"))
      .inventory,
  ).toEqual({ paper: 1 });
  await expect(
    page.getByRole("spinbutton", { name: "Paper in my box", exact: true }),
  ).toHaveValue("1");
});

test("open tabs share saved materials without losing notebook work", async ({
  page,
  context,
}) => {
  await page.goto("/my-parts/");
  const other = await context.newPage();
  await other.goto("/my-parts/");
  await page.getByRole("button", { name: "Add paper", exact: true }).click();
  await expect(
    other.getByRole("spinbutton", { name: "Paper in my box", exact: true }),
  ).toHaveValue("1");
  await other.goto("/projects/c01-the-light-that-wouldn-t-turn-on/");
  await other
    .locator(".step-nav")
    .getByRole("button", { name: "Your notebook", exact: true })
    .click();
  await other
    .getByLabel("What are you wondering about next?")
    .fill("What else could glow?");
  await expect
    .poll(() =>
      page.evaluate(
        (key) =>
          JSON.parse(localStorage.getItem(key)!).progress.c01?.reflection,
        STORAGE_KEY,
      ),
    )
    .toBe("What else could glow?");
  await page.getByRole("button", { name: "Add tape", exact: true }).click();
  await other.goto("/my-parts/");
  await expect(
    other.getByRole("spinbutton", { name: "Tape in my box", exact: true }),
  ).toHaveValue("1");
  await other.goto("/notebook/");
  await expect(other.getByLabel("Next time…")).toHaveValue(
    "What else could glow?",
  );
});

test("making box fits small and large screens with accessible controls", async ({
  page,
}) => {
  for (const width of [360, 768, 900, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/my-parts/");
    await page
      .getByRole("button", { name: "Add cardboard pieces", exact: true })
      .click();
    await page.getByRole("button", { name: "Add paper", exact: true }).click();
    await page.getByRole("button", { name: "Add tape", exact: true }).click();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page.screenshot({
      path: `test-results/making-box-${width}.png`,
      fullPage: true,
    });
    if (width === 360 || width === 1440) {
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
  }
  await page.getByText("Have a kit already?", { exact: true }).click();
  await page
    .getByLabel("Choose a kit", { exact: true })
    .selectOption("circuit");
  await openCopy(page, saved({ paper: 3 }));
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
