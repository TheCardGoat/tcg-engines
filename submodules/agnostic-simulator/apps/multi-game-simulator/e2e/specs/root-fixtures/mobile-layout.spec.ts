import { expect, test, type Page } from "@playwright/test";

const OPENING_MAIN_MOBILE =
  "/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off&mobile=1";
const REACT_STEP_MOBILE =
  "/cyberpunk/simulator/tests/reactStep?ai=off&auto-advance-attack=off&mobile=1";
const LONG_HAND_MOBILE =
  "/cyberpunk/simulator/tests/retailProgramTargetBench?ai=off&auto-advance-attack=off&mobile=1";
const RETAIL_GEAR_LEGEND_BENCH_MOBILE =
  "/cyberpunk/simulator/tests/retailGearLegendBench?ai=off&auto-advance-attack=off&mobile=1";

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

async function expectHandCardsInsideZone(page: Page, side: string) {
  await expect
    .poll(async () =>
      page.locator(`[data-testid="hand-zone"][data-side="${side}"]`).evaluate((zone) => {
        const zoneRect = zone.getBoundingClientRect();
        const cards = Array.from(zone.querySelectorAll('[data-testid="hand-card"]'));
        return cards.every((card) => {
          const rect = card.getBoundingClientRect();
          return rect.left >= zoneRect.left - 1 && rect.right <= zoneRect.right + 1;
        });
      }),
    )
    .toBeTruthy();
}

test("small portrait shows the mobile board instead of the rotate gate", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(OPENING_MAIN_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cyberpunk-board")).toBeVisible();

  await expectNoDocumentOverflow(page);
});

test("small landscape shows the rotate-to-portrait gate instead of the board", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto(OPENING_MAIN_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rotate to portrait" })).toBeVisible();
  await expect(page.getByLabel("Current match status")).toBeVisible();
  await expect(page.getByTestId("mobile-cyberpunk-board")).toHaveCount(0);

  await expectNoDocumentOverflow(page);
});

test("small portrait keeps the board clear of mobile navigation and card inspect fits", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(OPENING_MAIN_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cyberpunk-board")).toBeVisible();
  await expect(page.getByRole("button", { name: "Actions", exact: true })).toHaveCount(0);

  const boardBox = await page.getByTestId("mobile-cyberpunk-board").boundingBox();
  const viewportAtLoad = page.viewportSize();
  expect(boardBox).not.toBeNull();
  expect(viewportAtLoad).not.toBeNull();
  expect(Math.round(boardBox!.y + boardBox!.height)).toBeLessThanOrEqual(viewportAtLoad!.height);

  await page.getByRole("button", { name: "Logs" }).click();
  await expect(page.getByText("Event log")).toBeVisible();
  await expect(page.getByText("Logs are not available in this build.")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByText("Event log")).toHaveCount(0);

  await page.getByRole("button", { name: "Chat", exact: true }).click();
  await page.getByTestId("chat-send").waitFor({ state: "attached" });
  await expect
    .poll(async () => {
      const viewport = page.viewportSize();
      return page.getByTestId("chat-send").evaluate(
        (button, bounds) => {
          const rect = button.getBoundingClientRect();
          return rect.bottom <= bounds.viewportHeight && rect.right <= bounds.viewportWidth;
        },
        {
          viewportHeight: viewport!.height,
          viewportWidth: viewport!.width,
        },
      );
    })
    .toBeTruthy();
  const chatSendBox = await page.getByTestId("chat-send").evaluate((button) => {
    const rect = button.getBoundingClientRect();
    return {
      bottom: rect.bottom,
      right: rect.right,
    };
  });
  expect(chatSendBox.bottom).toBeLessThanOrEqual(page.viewportSize()!.height);
  expect(chatSendBox.right).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("chat")).toHaveCount(0);

  await page.getByRole("button", { name: "AI", exact: true }).click();
  await expect(page.getByTestId("chat")).toHaveCount(0);
  const switchSideButton = page.getByTestId("ai-take-control");
  await switchSideButton.waitFor({ state: "attached" });
  await expect
    .poll(async () =>
      switchSideButton.evaluate((button, viewportHeight) => {
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.bottom <= viewportHeight;
      }, page.viewportSize()!.height),
    )
    .toBeTruthy();
  const switchSideBox = await switchSideButton.evaluate((button) => {
    const rect = button.getBoundingClientRect();
    return {
      bottom: rect.bottom,
      height: rect.height,
      top: rect.top,
      width: rect.width,
    };
  });
  expect(switchSideBox.width).toBeGreaterThan(0);
  expect(switchSideBox.height).toBeGreaterThan(0);
  expect(switchSideBox.top).toBeGreaterThanOrEqual(0);
  expect(switchSideBox.bottom).toBeLessThanOrEqual(page.viewportSize()!.height);
  await page.keyboard.press("Escape");
  await expect(switchSideButton).toHaveCount(0);

  const firstHandCard = page.locator('[data-testid="hand-card"][data-face-down="false"]').last();
  const firstHandCardBox = await firstHandCard.boundingBox();
  expect(firstHandCardBox).not.toBeNull();
  await firstHandCard.getByLabel("Inspect card").click();
  await expect(page.getByTestId("hand-command-tray")).toHaveCount(0);
  await expect(page.getByTestId("card-action-menu")).toHaveCount(0);

  const inspectImage = page.getByTestId("card-inspect-image");
  await expect(inspectImage).toBeVisible();

  const imageBox = await inspectImage.boundingBox();
  const closeBox = await page.getByLabel("Close inspect").boundingBox();
  const viewport = page.viewportSize();
  expect(imageBox).not.toBeNull();
  expect(closeBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(imageBox!.y).toBeGreaterThanOrEqual(0);
  expect(imageBox!.y + imageBox!.height).toBeLessThanOrEqual(viewport!.height);
  expect(closeBox!.y).toBeGreaterThanOrEqual(0);
  expect(closeBox!.y + closeBox!.height).toBeLessThanOrEqual(viewport!.height);
});

test("small portrait turns the player helper cluster into a sell drop target", async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 915 });
  await page.goto(OPENING_MAIN_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cyberpunk-board")).toBeVisible();

  const sellableHandCard = page
    .locator('[data-testid="hand-card"][data-face-down="false"]')
    .filter({ has: page.locator('[data-testid="card"][data-card-id]') })
    .first();
  const playerHelpers = page.locator('[aria-label^="Player helper zones"][data-placement="field"]');

  const cardBox = await sellableHandCard.boundingBox();
  const helperBox = await playerHelpers.boundingBox();
  expect(cardBox).not.toBeNull();
  expect(helperBox).not.toBeNull();

  await page.mouse.move(cardBox!.x + cardBox!.width / 2, cardBox!.y + cardBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(helperBox!.x + helperBox!.width / 2, helperBox!.y + helperBox!.height / 2, {
    steps: 8,
  });

  await expect(playerHelpers).toHaveAttribute("data-drop-ready", "sellCard");
  await expect(playerHelpers.getByText("Drop to sell")).toBeVisible();
  await expect(playerHelpers.getByText("+1 Eddie")).toBeVisible();

  await page.mouse.up();
  await expectNoDocumentOverflow(page);
});

test("tablet landscape does not force rotation", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(OPENING_MAIN_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cyberpunk-board")).toBeVisible();

  await expectNoDocumentOverflow(page);
});

test("tablet portrait does not force rotation", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(OPENING_MAIN_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cyberpunk-board")).toBeVisible();

  await expectNoDocumentOverflow(page);
});

test("wide landscape docks helper zones beside hands when the hand still fits", async ({
  page,
}) => {
  await page.setViewportSize({ width: 932, height: 430 });
  await page.goto(OPENING_MAIN_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cyberpunk-board")).toBeVisible();

  const playerHelpers = page.locator('[aria-label="Player helper zones"][data-placement="hand"]');
  const rivalHelpers = page.locator('[aria-label="Rival helper zones"][data-placement="hand"]');
  await expect(playerHelpers.getByTestId("legends-zone")).toBeVisible();
  await expect(rivalHelpers.getByTestId("legends-zone")).toBeVisible();

  const playerHand = page.locator('[data-testid="hand-zone"][data-side="player"]');
  const rivalHand = page.locator('[data-testid="hand-zone"][data-side="opponent"]');
  const playerHelperBox = await playerHelpers.boundingBox();
  const playerHandBox = await playerHand.boundingBox();
  const rivalHelperBox = await rivalHelpers.boundingBox();
  const rivalHandBox = await rivalHand.boundingBox();
  expect(playerHelperBox).not.toBeNull();
  expect(playerHandBox).not.toBeNull();
  expect(rivalHelperBox).not.toBeNull();
  expect(rivalHandBox).not.toBeNull();
  expect(playerHelperBox!.x + playerHelperBox!.width).toBeLessThanOrEqual(playerHandBox!.x + 1);
  expect(rivalHelperBox!.x).toBeGreaterThanOrEqual(rivalHandBox!.x + rivalHandBox!.width - 1);

  await expectHandCardsInsideZone(page, "player");
  await expectHandCardsInsideZone(page, "opponent");
  await expectNoDocumentOverflow(page);
});

test("mobile combat phase controls fit a short command bar", async ({ page }) => {
  await page.setViewportSize({ width: 831, height: 843 });
  await page.goto(REACT_STEP_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cyberpunk-board")).toBeVisible();

  const phaseHud = page.getByTestId("phase-hud");
  await expect(phaseHud).toHaveAttribute("data-attack-in-progress", "true");
  await expect(page.getByTestId("attack-target-summary")).toBeVisible();
  await expect(page.getByLabel("Attack step")).toBeVisible();

  const commandBarBox = await page.locator('[class*="bottomCommandBar"]').boundingBox();
  const phaseHudBox = await phaseHud.boundingBox();
  const advanceBox = await page.getByTestId("phase-advance").boundingBox();
  expect(commandBarBox).not.toBeNull();
  expect(phaseHudBox).not.toBeNull();
  expect(advanceBox).not.toBeNull();
  expect(phaseHudBox!.y).toBeGreaterThanOrEqual(commandBarBox!.y - 1);
  expect(phaseHudBox!.y + phaseHudBox!.height).toBeLessThanOrEqual(
    commandBarBox!.y + commandBarBox!.height + 1,
  );
  expect(advanceBox!.x + advanceBox!.width).toBeLessThanOrEqual(
    commandBarBox!.x + commandBarBox!.width + 1,
  );

  await expectNoDocumentOverflow(page);
});

test("portrait falls back to combined field helpers for an oversized hand", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(LONG_HAND_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cyberpunk-board")).toBeVisible();

  const boardBox = await page.getByTestId("mobile-cyberpunk-board").boundingBox();
  expect(boardBox).not.toBeNull();
  expect(Math.round(boardBox!.y + boardBox!.height)).toBeLessThanOrEqual(
    page.viewportSize()!.height,
  );

  const playerHelpers = page.locator('[aria-label="Player helper zones"][data-placement="field"]');
  await expect(playerHelpers.getByTestId("legends-zone")).toBeVisible();
  const helperBox = await playerHelpers.boundingBox();
  const helperLegendBox = await playerHelpers.getByTestId("legends-zone").boundingBox();
  expect(helperBox).not.toBeNull();
  expect(helperLegendBox).not.toBeNull();
  expect(helperLegendBox!.x).toBeGreaterThanOrEqual(helperBox!.x);
  expect(helperLegendBox!.y).toBeGreaterThanOrEqual(helperBox!.y);
  expect(helperLegendBox!.y + helperLegendBox!.height).toBeLessThanOrEqual(
    helperBox!.y + helperBox!.height,
  );

  const firstHandCard = page.locator('[data-testid="hand-card"][data-face-down="false"]').first();
  const firstHandCardBox = await firstHandCard.boundingBox();
  expect(firstHandCardBox).not.toBeNull();
  expect(firstHandCardBox!.x).toBeLessThan(48);
  await expectNoDocumentOverflow(page);
});

test("portrait combined field helpers show every legend when the hand helper cannot dock", async ({
  page,
}) => {
  await page.setViewportSize({ width: 412, height: 915 });
  await page.goto(RETAIL_GEAR_LEGEND_BENCH_MOBILE);

  await expect(page.getByLabel("Rotate to portrait to play Cyberpunk TCG")).toHaveCount(0);
  await expect(page.getByTestId("mobile-cyberpunk-board")).toBeVisible();

  const playerHelpers = page.locator('[aria-label="Player helper zones"][data-placement="field"]');
  await expect(playerHelpers).toHaveAttribute("data-legend-count", "3");
  await expect(
    page.locator('[aria-label="Player helper zones"][data-placement="hand"]'),
  ).toHaveCount(0);
  const occupiedLegendSlots = playerHelpers.locator(
    '[data-testid="legend-slot"][data-occupied="true"]',
  );
  await expect(occupiedLegendSlots).toHaveCount(3);

  const helperBox = await playerHelpers.boundingBox();
  expect(helperBox).not.toBeNull();
  for (const slot of await occupiedLegendSlots.all()) {
    const slotBox = await slot.boundingBox();
    expect(slotBox).not.toBeNull();
    expect(slotBox!.x).toBeGreaterThanOrEqual(helperBox!.x - 1);
    expect(slotBox!.x + slotBox!.width).toBeLessThanOrEqual(helperBox!.x + helperBox!.width + 1);
  }

  await expectNoDocumentOverflow(page);
});
