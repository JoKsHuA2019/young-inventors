import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import catalog from "../../content/catalog.json";
import { STORAGE_KEY, freshProgress } from "../../lib/state";
const url = (id: string) =>
  `/projects/${catalog.find((l) => l.id === id)!.slug}/`;
const stage = async (page: Page, name: string) =>
  page.locator(".step-nav").getByRole("button", { name, exact: true }).click();
const state = (page: Page) =>
  page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) || "{}"),
    STORAGE_KEY,
  );
async function openDrawing(page: Page) {
  await stage(page, "Your notebook");
  await expect(page.locator(".drawing-surface")).toHaveAttribute(
    "aria-disabled",
    "false",
  );
}
async function circle(page: Page) {
  const details = page.locator(".drawing-pad details");
  if (!(await details.getAttribute("open")))
    await details.locator("summary").click();
  await page.getByRole("button", { name: "Add a circle", exact: true }).click();
  await expect(page.locator(".drawing-pad .creative-status")).toContainText(
    "Drawing saved",
  );
}

test("pilot investigations preserve controlled variables and separate screen clues from physical evidence", async ({
  page,
}) => {
  for (const id of ["c01", "m01", "i01"]) {
    await page.goto(url(id));
    await stage(page, "Try the model");
    await page.locator(".investigation>summary").click();
    const scene = page.locator(".investigation");
    await scene.getByRole("radio").first().check();
    if (id === "c01") {
      await scene
        .getByRole("button", { name: "Inspect the resistor", exact: true })
        .click();
      await expect(scene.locator(".scene-clue")).toContainText(
        "220 Ω resistor stays",
      );
      await scene
        .getByRole("button", { name: "Open the return", exact: true })
        .click();
      await expect(scene.locator(".woodland-scene > svg")).toHaveAttribute(
        "aria-label",
        /return open; light off.*Resistor remains/,
      );
      await scene
        .getByRole("button", { name: "Keep this screen clue" })
        .click();
      await scene
        .getByRole("button", { name: "Restore the return", exact: true })
        .click();
      await scene
        .getByRole("button", { name: "Keep this screen clue" })
        .click();
    } else if (id === "m01") {
      await scene.getByRole("button", { name: "Choose the far spot" }).click();
      await scene.getByRole("button", { name: "Push to the target" }).click();
      await expect(scene.locator(".woodland-scene > svg")).toHaveAttribute(
        "aria-label",
        /Fixed pivot with far push 14/,
      );
      await expect(scene.locator(".scene-result")).toContainText(
        "hand travels farther",
      );
      await scene
        .getByRole("button", { name: "Keep this screen clue" })
        .click();
    } else {
      const reveal = scene.getByRole("button", {
        name: "Peek inside the screen model",
      });
      await expect(reveal).toBeDisabled();
      for (let n = 0; n < 2; n++) {
        await scene
          .getByRole("button", { name: "Push the tab gently" })
          .click();
        await scene.getByRole("button", { name: "Let go and watch" }).click();
        if (n === 0) await expect(reveal).toBeDisabled();
      }
      await reveal.click();
      await expect(scene.locator(".friend-note")).toContainText(
        "different mechanism",
      );
    }
    expect((await state(page)).progress[id].observation).toBe("");
    await page.reload();
    await stage(page, "Try the model");
    await page.locator(".investigation>summary").click();
    await expect(page.locator(".clue-pocket li")).not.toHaveCount(0);
  }
});

test("drawings, first and next attempts, questions and complete copies survive reload and transfer", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  await page.locator(".companion-picker>summary").click();
  await page.getByRole("button", { name: "Rabbit", exact: true }).click();
  await page.goto("/my-parts/");
  await page.getByRole("button", { name: "Add paper", exact: true }).click();
  await page.goto(url("c01"));
  await openDrawing(page);
  await circle(page);
  await page.getByLabel("Name this idea").fill("My first lantern");
  await page.getByRole("button", { name: "Save this try to my shelf" }).click();
  await expect(
    page.getByText("Your idea is on the invention shelf.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add a line", exact: true }).click();
  await expect(page.locator(".drawing-pad .creative-status")).toContainText(
    "Drawing saved",
  );
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.locator(".drawing-surface polyline")).toHaveCount(1);
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(page.locator(".drawing-surface polyline")).toHaveCount(2);
  await page
    .getByLabel("What are you wondering about next?")
    .fill("Could the tent be a cave?");
  await page.getByLabel("Name this idea").fill("A cave for Mouse");
  await page.getByRole("button", { name: "Save this try to my shelf" }).click();
  await page
    .getByLabel("A question for another day")
    .fill("Where does the path go next?");
  await page.getByRole("button", { name: "Keep this question" }).click();
  await page.reload();
  await expect(page.locator(".drawing-surface polyline")).toHaveCount(2);
  await page.goto("/notebook/");
  await expect(page.locator(".shelf-card")).toHaveCount(2);
  await expect(page.locator(".companion-picker")).toContainText("Rabbit");
  await page
    .getByRole("combobox", { name: "Look at one adventure" })
    .selectOption("c01");
  await page
    .getByRole("button", { name: "Compare my first and latest tries" })
    .click();
  await expect(
    page.locator(".shelf-card").first().locator(".drawing-paper polyline"),
  ).toHaveCount(1);
  await expect(
    page.locator(".shelf-card").last().locator(".drawing-paper polyline"),
  ).toHaveCount(2);
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save complete workshop" }).click();
  const copy = await readFile((await (await downloadEvent).path())!, "utf8");
  const data = JSON.parse(copy);
  expect(Object.keys(data.drawings)).toHaveLength(3);
  expect(data.inventory.paper).toBe(1);
  expect(data.creative.questions).toHaveLength(1);
  const context = await browser.newContext();
  const other = await context.newPage();
  await other.goto("http://127.0.0.1:4173/notebook/");
  await other.getByLabel("Open workshop copy").setInputFiles({
    name: "workshop.json",
    mimeType: "application/json",
    buffer: Buffer.from(copy),
  });
  await expect(
    other.getByRole("heading", { name: "A workshop waiting to open" }),
  ).toBeVisible();
  await expect(other.locator(".shelf-card")).toHaveCount(0);
  await other
    .getByRole("button", { name: "Open this workshop instead" })
    .click();
  await expect(other.locator(".shelf-card")).toHaveCount(2);
  await other.reload();
  await expect(other.locator(".shelf-card .drawing-paper")).toHaveCount(2);
  await expect(other.locator("#wonder-pocket")).toContainText(
    "Where does the path go next?",
  );
  expect((await state(other)).inventory.paper).toBe(1);
  await context.close();
});

test("pointer drawing persists and old notes remain intact", async ({
  page,
}) => {
  await page.addInitScript(
    ({ key, p }) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          inventory: { paper: 7 },
          progress: { m01: p },
        }),
      ),
    {
      key: STORAGE_KEY,
      p: {
        ...freshProgress(),
        step: 8,
        observation: "The far push felt the same.",
      },
    },
  );
  await page.goto(url("m01"));
  await expect(page.locator(".drawing-surface")).toHaveAttribute(
    "aria-disabled",
    "false",
  );
  await page.locator(".drawing-surface").scrollIntoViewIfNeeded();
  const box = await page.locator(".drawing-surface").boundingBox();
  await page.mouse.move(box!.x + 30, box!.y + 30);
  await page.mouse.down();
  await page.mouse.move(box!.x + 110, box!.y + 80, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator(".drawing-pad .creative-status")).toContainText(
    "Drawing saved",
  );
  expect((await state(page)).progress.m01.observation).toBe(
    "The far push felt the same.",
  );
  expect((await state(page)).inventory.paper).toBe(7);
});

test("gathering, build cards, observation helpers and pausing preserve the real experiment boundary", async ({
  page,
}) => {
  await page.goto(url("c01"));
  await stage(page, "Make it");
  await page.locator(".build-companion>summary").click();
  await page.locator(".build-companion .gathering-list input").first().check();
  expect((await state(page)).inventory).toEqual({});
  await expect(
    page.locator(".build-companion .build-companion-card"),
  ).toContainText("Helper’s turn");
  await page.getByRole("button", { name: "Next little step" }).click();
  await expect(
    page.locator(".build-companion .build-companion-card"),
  ).toContainText("Give the light a place");
  await page.getByLabel("My helper has prepared and checked").check();
  await stage(page, "Test & notice");
  await page.locator(".observation-picker>summary").click();
  await page
    .getByRole("button", { name: "The light stayed dark.", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Which real try are we describing?" })
    .selectOption("Restored return");
  await page
    .getByRole("button", { name: "The light shone.", exact: true })
    .click();
  await expect(
    page.getByLabel("What happened in your real experiment?"),
  ).toHaveValue(
    "Closed path: The light stayed dark.\nRestored return: The light shone.",
  );
  await page.locator(".pause-card>summary").click();
  await page.getByRole("button", { name: "We’ve put our work away" }).click();
  expect((await state(page)).progress.c01.checked).toBe(false);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".print-only .build-companion-card")).toHaveCount(
    7,
  );
  await expect(page.locator(".print-only")).toContainText("Not recorded");
});

test("blocked drawing storage keeps work available for a complete download", async ({
  page,
}) => {
  await page.addInitScript(() => {
    IDBFactory.prototype.open = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page.goto(url("i01"));
  await stage(page, "Your notebook");
  await page
    .getByRole("button", { name: "Draw on a fresh page in this tab" })
    .click();
  await page.locator(".drawing-pad details>summary").click();
  await page.getByRole("button", { name: "Add a circle", exact: true }).click();
  await expect(page.locator(".drawing-pad .creative-status")).toContainText(
    "staying in this tab",
  );
  await page
    .locator(".lesson-tools")
    .getByRole("link", { name: "Visit my notebook" })
    .click();
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save complete workshop" }).click();
  const data = JSON.parse(
    await readFile((await (await event).path())!, "utf8"),
  );
  expect(Object.keys(data.drawings)).toHaveLength(1);
});

test("invalid or cancelled complete imports leave the current workshop intact", async ({
  page,
}) => {
  await page.goto("/my-parts/");
  await page.getByRole("button", { name: "Add paper", exact: true }).click();
  await page.goto("/notebook/");
  const input = page.getByLabel("Open workshop copy");
  await input.setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{bad"),
  });
  await expect(page.locator(".workshop-copy")).not.toContainText(
    "A workshop waiting to open",
  );
  expect((await state(page)).inventory.paper).toBe(1);
  await input.setInputFiles({
    name: "old.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({ version: 1, inventory: { paper: 9 }, progress: {} }),
    ),
  });
  await page.getByRole("button", { name: "Keep my current workshop" }).click();
  expect((await state(page)).inventory.paper).toBe(1);
});

test("creative additions fit phones and desktop screens and pass automated accessibility checks", async ({
  page,
}) => {
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(url("i01"));
    await stage(page, "Try the model");
    await page.locator(".investigation>summary").click();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await expect(page.locator(".preview-box")).toBeVisible();
    await page.screenshot({
      path: `test-results/investigation-${width}.png`,
      fullPage: true,
    });
    if (width !== 768)
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
    await openDrawing(page);
    await circle(page);
    await page.getByLabel("Name this idea").fill("My little mystery");
    await page
      .getByRole("button", { name: "Save this try to my shelf" })
      .click();
    await page.screenshot({
      path: `test-results/drawing-${width}.png`,
      fullPage: true,
    });
    await page.goto("/notebook/");
    await expect(
      page.locator(".shelf-card").first().locator(".drawing-paper"),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page.screenshot({
      path: `test-results/shelf-${width}.png`,
      fullPage: true,
    });
    if (width !== 768)
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
  }
});

test("adventure printing contains the illustrated cards while the full reference guide stays available", async ({
  page,
}) => {
  for (const id of ["c01", "m01", "i01"]) {
    await page.goto(url(id));
    await page.evaluate(() => {
      window.print = () => {};
    });
    await page
      .getByRole("button", { name: "Print our adventure pack", exact: true })
      .click();
    await page.emulateMedia({ media: "print" });
    const pack = page.locator(".print-adventure-cards");
    await expect(pack).toBeVisible();
    await expect(pack.locator(".build-companion-card")).toHaveCount(7);
    await expect(pack.locator(".parent-quick-start")).toContainText(
      "Physical trials and release review are still pending",
    );
    await expect(page.locator(".print-only > .helper-guide")).toBeHidden();
    await expect
      .poll(() =>
        pack
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (img) =>
                (img as HTMLImageElement).complete &&
                (img as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await expect(page.locator(".print-only > .helper-guide")).toBeVisible();
    await expect(pack).toBeHidden();
    await page.emulateMedia({ media: "screen" });
  }
});

test("a failed drawing import leaves existing materials and notes untouched", async ({
  page,
}) => {
  await page.addInitScript(() => {
    IDBFactory.prototype.open = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page.goto("/my-parts/");
  await page.getByRole("button", { name: "Add paper", exact: true }).click();
  await page.goto("/notebook/");
  const backup = {
    version: 1,
    format: "young-inventors-workshop",
    progress: {},
    inventory: { paper: 9 },
    creative: { drafts: { c01: "draft-c01" } },
    drawings: { "draft-c01": { version: 1, strokes: [] } },
  };
  await page
    .getByLabel("Open workshop copy")
    .setInputFiles({
      name: "copy.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(backup)),
    });
  await page
    .getByRole("button", { name: "Open this workshop instead" })
    .click();
  await expect(page.locator(".workshop-copy .creative-status")).toContainText(
    "Your current workshop is still here",
  );
  expect((await state(page)).inventory.paper).toBe(1);
});
