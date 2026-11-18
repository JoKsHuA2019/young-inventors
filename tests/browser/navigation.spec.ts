import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("More navigation supports keyboard, dismissal, and all destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const toggle = nav.getByRole("button", { name: "More", exact: true });
  const panel = nav.locator("#more-navigation");
  await expect(toggle).toBeEnabled();
  await expect(panel).toBeHidden();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    panel.getByRole("link", { name: "Invention stories" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await page.getByRole("heading", { level: 1 }).click();
  await expect(panel).toBeHidden();
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Shift+Tab");
  await expect(nav.getByRole("link", { name: "My notebook" })).toBeFocused();
  await expect(panel).toBeHidden();

  for (const [label, path] of [
    ["Invention stories", "/gallery/"],
    ["About the workshop", "/about/"],
    ["Grown-up guide", "/grownups/"],
  ]) {
    await toggle.click();
    await panel.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator("#main h1")).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
  }
});

test("More navigation remains usable inside the phone menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const toggle = nav.getByRole("button", { name: "More", exact: true });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await toggle.click();
  await expect(nav).toBeVisible();
  await expect(nav.locator("#more-navigation")).toBeVisible();
  await nav.getByRole("link", { name: "Grown-up guide", exact: true }).click();
  await expect(page).toHaveURL(/\/grownups\/$/);
  await expect(nav).toBeHidden();

  await page.getByRole("button", { name: "Open navigation" }).click();
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(nav).toBeVisible();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  // The open phone menu covers the heading; tap the exposed page below it.
  await page.mouse.click(12, 600);
  await expect(nav).toBeHidden();
});

test("More navigation fits phone, tablet, and desktop layouts", async ({
  page,
}) => {
  for (const width of [360, 768, 801, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    if (width <= 800)
      await page.getByRole("button", { name: "Open navigation" }).click();
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await nav.getByRole("button", { name: "More", exact: true }).click();
    const panel = nav.locator("#more-navigation");
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(8);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width - 8);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `test-results/navigation-${width}.png` });
    if (width === 360 || width === 1440) {
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    }
  }
});
