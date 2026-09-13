// Standalone Playwright probe — NOT a test-runner spec.
// Confirms the native mobile board DOM so we design the validation harness on facts.
// Run: node mobile-validation/probe-mobile.cjs
const { chromium } = require("@playwright/test");

const PORT = process.env.PLAYWRIGHT_PORT || "5193";
const BASE = `http://localhost:${PORT}`;
const SCENARIO = process.env.SCENARIO || "unitMoxIncitersRetail";

void (async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  const url = `${BASE}/cyberpunk/simulator/tests/${SCENARIO}?ai=off&auto-advance-attack=off&mobile=1`;
  console.log("GOTO", url);
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Wait for the engine harness + mobile board.
  await page.waitForFunction(() => Boolean(window.__cyberpunkSimulator), null, { timeout: 15000 });
  await page.waitForSelector('[data-testid="mobile-cyberpunk-board"]', { timeout: 15000 });

  const report = await page.evaluate(() => {
    const has = (sel) => document.querySelector(sel) !== null;
    const count = (sel) => document.querySelectorAll(sel).length;
    const board = document.querySelector('[data-testid="mobile-cyberpunk-board"]');
    const handCards = Array.from(document.querySelectorAll('[data-testid="hand-card"]'));
    const sim = window.__cyberpunkSimulator;
    return {
      boardAttrs: board
        ? {
            activeSide: board.getAttribute("data-active-side"),
            phase: board.getAttribute("data-phase"),
            gameStatus: board.getAttribute("data-game-status"),
            mode: board.getAttribute("data-mode"),
          }
        : null,
      interactionPanelPresent: has('[aria-label="Interaction panel"]'),
      cardActionMenuPresent: has('[data-testid="card-action-menu"]'),
      phaseAdvancePresent: has('[data-testid="phase-advance"]'),
      promptBannerPresent: has('[data-testid="prompt-banner"]'),
      promptState: document
        .querySelector('[data-testid="prompt-banner"]')
        ?.getAttribute("data-state"),
      handCardCount: handCards.length,
      handCardNames: handCards.slice(0, 8).map((c) => c.getAttribute("data-card-name")),
      handCardActions: handCards.slice(0, 3).map(() => null),
      legendSlots: count('[data-testid="legend-slot"]'),
      fieldUnits: count('[data-testid="field-unit"]'),
      fixerDice: count('[data-testid="fixer-die"]'),
      gigDice: count('[data-testid="gig-die"]'),
      simKeys: sim ? Object.keys(sim) : null,
      humanSide: sim ? sim.getHumanSide() : null,
    };
  });

  console.log(JSON.stringify({ scenario: SCENARIO, report, pageErrors: errors }, null, 2));

  // Snapshot: tap the first face-up hand card and inspect its card action menu.
  const handCard = page
    .locator('[data-testid="hand-card"] [data-testid="card"][data-actionable="true"]')
    .first();
  const handCardCount = await handCard.count();
  if (handCardCount > 0) {
    await handCard.click();
  }
  await page.waitForTimeout(250);
  const tap = await page.evaluate(() => {
    const card = document.querySelector(
      '[data-testid="hand-card"] [data-testid="card"][data-actionable="true"]',
    );
    const menu = document.querySelector('[data-testid="card-action-menu"]');
    const actions = Array.from(menu?.querySelectorAll('[data-testid^="card-action-"]') ?? []).map(
      (action) => action.getAttribute("data-testid"),
    );
    return {
      tapped: card !== null,
      cardName: card?.getAttribute("data-card-name") ?? null,
      menuVisible: menu !== null,
      actions,
    };
  });
  console.log("TAP_RESULT", JSON.stringify(tap, null, 2));

  await page.screenshot({
    path: "mobile-validation/screenshots/probe-" + SCENARIO + ".png",
    fullPage: false,
  });
  await browser.close();
})().catch((e) => {
  console.error("PROBE_FAILED", e);
  process.exit(1);
});
