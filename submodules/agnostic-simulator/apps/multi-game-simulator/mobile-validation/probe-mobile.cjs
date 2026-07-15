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
      handCommandTrayPresent: has('[data-testid="hand-command-tray"]'),
      handActionPlayPresent: has('[data-testid="hand-action-play"]'),
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

  // Snapshot: tap the first face-up hand card and see if a command tray appears.
  const tap = await page.evaluate(async () => {
    const card = document.querySelector('[data-testid="hand-card"]');
    if (!card) return { tapped: false };
    const r = card.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    for (const type of ["pointerdown", "pointerup"]) {
      card.dispatchEvent(
        new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1 }),
      );
    }
    await new Promise((res) => setTimeout(res, 250));
    const tray = document.querySelector('[data-testid="hand-command-tray"]');
    const play = document.querySelector('[data-testid="hand-action-play"]');
    const sell = document.querySelector('[data-testid="hand-action-sell"]');
    const goSolo = document.querySelector('[data-testid="hand-action-goSolo"]');
    return {
      tapped: true,
      cardName: card.getAttribute("data-card-name"),
      trayVisible: tray !== null,
      playVisible: play !== null,
      sellVisible: sell !== null,
      goSoloVisible: goSolo !== null,
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
