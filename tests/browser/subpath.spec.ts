import { test, expect } from "@playwright/test";
import catalog from "../../content/catalog.json";

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
test.skip(!prefix, "Run against an export built with NEXT_PUBLIC_BASE_PATH.");

test("GitHub Pages preserves artwork, routes, downloads, models and notes", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()}: ${response.url()}`);
  });
  await page.goto(`${prefix}/`);
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page
      .locator(".hero-visual img")
      .evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () =>
        document.fonts.check("16px DM") && document.fonts.check("16px Lora"),
    ),
  ).toBe(true);
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await nav.getByRole("link", { name: "Things to make", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/explore/$`));
  await expect(page.locator(".project-card")).toHaveCount(30);
  for (const lesson of catalog) {
    expect((await request.get(`${prefix}/projects/${lesson.slug}/`)).ok()).toBe(
      true,
    );
  }
  await nav.getByRole("button", { name: "More", exact: true }).click();
  await nav.getByRole("link", { name: "Grown-up guide", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/grownups/$`));
  const downloads = await page
    .locator(`a[href^="${prefix}/originals/"],a[href^="${prefix}/resources/"]`)
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  expect(downloads.length).toBeGreaterThan(10);
  for (const href of downloads)
    expect((await request.head(href)).ok(), href).toBe(true);
  const lesson = catalog.find((lesson) => lesson.id === "p01")!;
  await page.goto(`${prefix}/projects/${lesson.slug}/`);
  await page
    .locator(".step-nav")
    .getByRole("button", { name: "Try the model", exact: true })
    .click();
  await expect(page.locator(".preview-box")).toBeVisible();
  await page.getByRole("slider").focus();
  await page.keyboard.press("ArrowRight");
  await page
    .locator(".step-nav")
    .getByRole("button", { name: "Your notebook", exact: true })
    .click();
  await page
    .getByLabel("What are you wondering about next?")
    .fill("Try a different light rhythm.");
  await page.reload();
  await expect(
    page.getByLabel("What are you wondering about next?"),
  ).toHaveValue("Try a different light rhythm.");
  await page
    .getByRole("button", { name: "For grown-ups", exact: true })
    .click();
  const sketch = page.locator(`a[href^="${prefix}/code_samples/"]`).first();
  await expect(sketch).toBeVisible();
  expect((await request.get((await sketch.getAttribute("href"))!)).ok()).toBe(
    true,
  );
  await nav.getByRole("link", { name: "My materials", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/my-parts/$`));
  await page.getByRole("button", { name: "Add paper", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("spinbutton", { name: "Paper in my box", exact: true }),
  ).toHaveValue("1");
  await page.locator(".material-project img").first().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".material-project img")
        .first()
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await nav.getByRole("link", { name: "My notebook", exact: true }).click();
  await expect(page.getByLabel("Next time…")).toHaveValue(
    "Try a different light rhythm.",
  );
  const pilot = catalog.find((l) => l.id === "c01")!;
  await page.goto(`${prefix}/projects/${pilot.slug}/`);
  await page
    .locator(".step-nav")
    .getByRole("button", { name: "Make it", exact: true })
    .click();
  await page.locator(".build-companion>summary").click();
  const picture = page.locator(".build-companion .build-picture");
  await expect(picture).toHaveAttribute(
    "src",
    new RegExp(`^${prefix}/assets/`),
  );
  await expect
    .poll(() => picture.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
  await page
    .locator(".step-nav")
    .getByRole("button", { name: "Your notebook", exact: true })
    .click();
  await expect(page.locator(".drawing-surface")).toHaveAttribute(
    "aria-disabled",
    "false",
  );
  await page.locator(".drawing-pad details>summary").click();
  await page.getByRole("button", { name: "Add a circle", exact: true }).click();
  await expect(page.locator(".drawing-pad .creative-status")).toContainText(
    "Drawing saved",
  );
  await page.getByRole("button", { name: "Save this try to my shelf" }).click();
  await page
    .getByRole("link", { name: "Visit my invention shelf", exact: true })
    .click();
  await expect(page).toHaveURL(
    new RegExp(`${prefix}/notebook/#invention-shelf$`),
  );
  await expect(page.locator(".shelf-card .drawing-paper")).toBeVisible();
  expect(errors).toEqual([]);
});
