import { expect, test, type Page } from "@playwright/test";

const GUNDAM_ROUTE =
  "/gundam/simulator?deck=topdecks-02&opponent=coverage-st03-002-to-st07-015&strategy=pass-only&start=1";
const ONE_PIECE_ROUTE = "/one-piece/simulator/play/practice";
const CYBERPUNK_ROUTE = "/cyberpunk/simulator/tests/gameStart?mobile=1";
const GAME_ROUTES = [
  ["Gundam", GUNDAM_ROUTE],
  ["One Piece", ONE_PIECE_ROUTE],
  ["Cyberpunk", CYBERPUNK_ROUTE],
] as const;

async function expectNoDocumentOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
  }));
  expect(overflow.scrollWidth).toBe(overflow.clientWidth);
  expect(overflow.scrollHeight).toBe(overflow.clientHeight);
}

async function expectMobileRailsFit(page: Page) {
  const shell = page.locator('[data-active-shell][data-layout="mobile"]');
  await expect(shell).toBeVisible({ timeout: 15_000 });
  await expectNoDocumentOverflow(page);

  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  for (const rail of [shell.locator(":scope > header"), shell.locator(":scope > footer")]) {
    const box = await rail.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
  }

  const railButtons = shell.locator(
    ":scope > header button:visible, :scope > footer button:visible",
  );
  const buttonCount = await railButtons.count();
  expect(buttonCount).toBeGreaterThan(0);
  for (let index = 0; index < buttonCount; index += 1) {
    const box = await railButtons.nth(index).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  }
}

test.describe("shared simulator sidebar geometry", () => {
  for (const width of [320, 390]) {
    test(`Gundam mobile rails and secondary bot controls fit at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 843 });
      await page.goto(GUNDAM_ROUTE);
      await expectMobileRailsFit(page);

      await page.getByRole("button", { name: "Open match activity" }).click();
      const drawer = page.getByRole("dialog", { name: "Gundam activity and utilities" });
      await expect(drawer).toBeVisible();
      await drawer.getByRole("tab", { name: "More" }).click();
      await expect(drawer.getByTestId("ai-control-panel")).toBeVisible();
    });

    test(`One Piece mobile rails reserve the action dock at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 843 });
      await page.goto(ONE_PIECE_ROUTE);
      await expectMobileRailsFit(page);
    });

    test(`Cyberpunk mobile rails and secondary bot controls fit at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 843 });
      await page.goto(CYBERPUNK_ROUTE);
      await expectMobileRailsFit(page);

      await page.getByRole("button", { name: "Open match activity" }).click();
      const drawer = page.getByRole("dialog", { name: "Match activity" });
      await expect(drawer).toBeVisible();
      await drawer.getByRole("tab", { name: "More" }).click();
      await expect(drawer.getByTestId("ai-control-panel")).toBeVisible();
    });
  }

  for (const [game, route] of GAME_ROUTES) {
    test(`${game} stays mobile at the 767px boundary`, async ({ page }) => {
      await page.setViewportSize({ width: 767, height: 843 });
      await page.goto(route);
      await expectMobileRailsFit(page);
    });

    test(`${game} uses mobile rails in short touch landscape`, async ({ browser }) => {
      const context = await browser.newContext({
        hasTouch: true,
        viewport: { width: 900, height: 500 },
      });
      const page = await context.newPage();
      try {
        await page.goto(route);
        await expectMobileRailsFit(page);
      } finally {
        await context.close();
      }
    });
  }

  for (const [game, route, expectedBands] of [
    ["Gundam", GUNDAM_ROUTE, [120, 64, 64, 120]],
    ["One Piece", ONE_PIECE_ROUTE, [120, 64, 120]],
    ["Cyberpunk", CYBERPUNK_ROUTE, [72, 64, 64, 72]],
  ] as const) {
    test(`${game} desktop keeps fixed chrome around flexible activity`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route);

      const shell = page.locator('[data-active-shell][data-layout="desktop"]');
      await expect(shell).toBeVisible({ timeout: 15_000 });
      const sidebar = shell.locator('aside[aria-label="Match panel"]');
      const matchSidebar = sidebar.locator(":scope aside").first();
      await expect(matchSidebar).toBeVisible();

      const bands = await matchSidebar.locator(":scope > *").evaluateAll((elements) =>
        elements.map((element) => ({
          label: element.getAttribute("aria-label"),
          height: Math.round(element.getBoundingClientRect().height),
        })),
      );
      const fixedHeights = bands
        .filter((band) => band.label !== "Activity")
        .map((band) => band.height);
      expect(fixedHeights).toEqual(expectedBands);
      expect(bands.find((band) => band.label === "Activity")?.height).toBeGreaterThan(0);

      const sidebarBox = await sidebar.boundingBox();
      const collapseBox = await page
        .getByRole("button", { name: "Collapse sidebar" })
        .boundingBox();
      expect(sidebarBox).not.toBeNull();
      expect(collapseBox).not.toBeNull();
      expect(collapseBox!.x).toBeGreaterThanOrEqual(sidebarBox!.x);
      expect(collapseBox!.x + collapseBox!.width).toBeLessThanOrEqual(
        sidebarBox!.x + sidebarBox!.width,
      );
    });

    test(`${game} switches to desktop at the 768px boundary`, async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 843 });
      await page.goto(route);

      const shell = page.locator('[data-active-shell][data-layout="desktop"]');
      await expect(shell).toBeVisible({ timeout: 15_000 });
      await expectNoDocumentOverflow(page);
    });
  }
});
