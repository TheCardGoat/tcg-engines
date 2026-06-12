/**
 * Cyberpunk TCG Practice Match DEEP Observation Harness
 *
 * This is NOT an autoplay script. It is a browser-driving observation tool
 * that makes one action at a time, then captures comprehensive evidence:
 * - Full-page screenshot
 * - Engine bridge state snapshot
 * - DOM HTML snapshot (player-visible board)
 * - AI decision details (when available)
 * - Move log entries
 *
 * After each action, it records a structured observation record before
 * proceeding. The purpose is step-by-step readiness evidence.
 */
import { chromium, type Page, type Browser } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = process.env.SIMULATOR_URL ?? "http://localhost:5174/cyberpunk/simulator";
const REPORT_DIR = path.resolve(
  process.cwd(),
  "docs/exec-plans/active/cyberpunk-practice-readiness",
);
const SCREENSHOT_DIR = path.join(REPORT_DIR, "screenshots");
const DOM_DIR = path.join(REPORT_DIR, "dom-snapshots");
const TOTAL_GAMES = Number(process.env.TOTAL_GAMES ?? "20");
const BOT_STRATEGY = process.env.BOT_STRATEGY ?? "first-legal";

interface StepObservation {
  stepNumber: number;
  actor: "player" | "bot";
  actionDescription: string;
  uiPath: string;
  timestamp: string;
  before: EngineSnapshot;
  after: EngineSnapshot;
  screenshotPath: string;
  domSnapshotPath: string;
  aiDecision?: {
    moveId: string;
    args?: unknown;
    durationMs?: number;
  };
  notes: string[];
}

interface AttackStateSnapshot {
  attackerId: string | null;
  defenderId: string | null;
  rivalId: string | null;
  kind: string | null;
  step: string | null;
}

interface EngineSnapshot {
  turn: number;
  phase: string;
  activePlayer: string;
  gameOver: boolean;
  winnerId: string | null;
  winReason: string | null;
  promptType: string | null;
  promptSubType: string | null;
  promptMessage: string | null;
  promptChoiceChooser: string | null;
  promptChoiceEligibleIds: string[];
  promptChoiceTargetKind: "card" | "gig" | null;
  availableVerbs: string[];
  playerHandSize: number;
  opponentHandSize: number;
  playerFieldSize: number;
  opponentFieldSize: number;
  playerGigCount: number;
  opponentGigCount: number;
  playerEddies: number;
  opponentEddies: number;
  playerFixerDice: number;
  opponentFixerDice: number;
  playerFaceDownLegends: number;
  opponentFaceDownLegends: number;
  attackState: AttackStateSnapshot | null;
}

interface GameRecord {
  gameNumber: number;
  playerDeck: string;
  botDeck: string;
  botStrategy: string;
  matchId: string;
  seed: string;
  finalResult: string | null;
  winner: string | null;
  stopReason: string | null;
  observations: StepObservation[];
  screenshots: string[];
  issues: IssueRecord[];
}

interface IssueRecord {
  id: string;
  severity: "P0" | "P1" | "P2" | "P3";
  title: string;
  description: string;
  repro: string;
  expected: string;
  actual: string;
}

const games: GameRecord[] = fs.existsSync(path.join(REPORT_DIR, "deep-observation-log.json"))
  ? (JSON.parse(
      fs.readFileSync(path.join(REPORT_DIR, "deep-observation-log.json"), "utf-8"),
    ) as GameRecord[])
  : [];

let globalIssueCounter = games.flatMap((g) => g.issues).length;

function nextIssueId(): string {
  return `ISSUE-${String(++globalIssueCounter).padStart(3, "0")}`;
}

function ensureDirs(): void {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  fs.mkdirSync(DOM_DIR, { recursive: true });
}

async function captureEngineSnapshot(page: Page): Promise<EngineSnapshot> {
  return page.evaluate(() => {
    const sim = (
      window as unknown as {
        __cyberpunkSimulator?: {
          engine: {
            getState: () => {
              G: {
                gameEnded: boolean;
                winnerId: string | null;
                winReason: string | null;
                turnMetadata: {
                  pendingChoice: {
                    type: string;
                    chooserId: string;
                    payload: {
                      type?: string;
                      eligibleIds?: string[];
                      targetKind?: "card" | "gig";
                    };
                  } | null;
                  activePlayerId: string;
                };
                attackState: {
                  attackerId: string;
                  defenderId: string;
                  rivalId: string;
                  kind: string;
                  step: string;
                } | null;
              };
            };
            getPhase: () => string;
            getTurnNumber: () => number;
            getActivePlayerId: () => string;
            getPrompt: (p: string) => {
              choice: {
                type: string;
                payload?: { type?: string; eligibleIds?: string[]; targetKind?: "card" | "gig" };
              } | null;
              message: string | null;
              availableMoves: Array<{ moveId: string; enabled: boolean }>;
            };
            getCardsInZone: (zone: string, p: string) => unknown[];
            getFixerDice: (p: string) => unknown[];
            getGigCount: (p: string) => number;
            getEddies: (p: string) => number;
            getFaceDownLegends: (p: string) => unknown[];
            isGameOver: () => boolean;
          };
        };
      }
    ).__cyberpunkSimulator;

    if (!sim) throw new Error("__cyberpunkSimulator not attached");

    const engine = sim.engine;
    const state = engine.getState();
    const p1 = "p1";
    const p2 = "p2";
    const activePlayer = engine.getActivePlayerId();
    const activePrompt = engine.getPrompt(activePlayer);
    const pendingChoice = state.G.turnMetadata.pendingChoice;

    const attack = state.G.attackState;

    return {
      turn: engine.getTurnNumber(),
      phase: engine.getPhase(),
      activePlayer,
      playerHandSize: engine.getCardsInZone("hand", p1).length,
      opponentHandSize: engine.getCardsInZone("hand", p2).length,
      playerFieldSize: engine.getCardsInZone("field", p1).length,
      opponentFieldSize: engine.getCardsInZone("field", p2).length,
      playerGigCount: engine.getGigCount(p1),
      opponentGigCount: engine.getGigCount(p2),
      playerEddies: engine.getEddies(p1),
      opponentEddies: engine.getEddies(p2),
      playerFixerDice: engine.getFixerDice(p1).length,
      opponentFixerDice: engine.getFixerDice(p2).length,
      playerFaceDownLegends: engine.getFaceDownLegends(p1).length,
      opponentFaceDownLegends: engine.getFaceDownLegends(p2).length,
      gameOver: engine.isGameOver(),
      winnerId: state.G.winnerId,
      winReason: state.G.winReason,
      promptType: activePrompt.choice?.type ?? null,
      promptSubType: activePrompt.choice?.payload?.type ?? null,
      promptMessage: activePrompt.message ?? null,
      promptChoiceChooser: pendingChoice?.chooserId ?? null,
      promptChoiceEligibleIds: pendingChoice?.payload?.eligibleIds ?? [],
      promptChoiceTargetKind: pendingChoice?.payload?.targetKind ?? null,
      availableVerbs: activePrompt.availableMoves.map((m) => m.moveId),
      attackState: attack
        ? {
            attackerId: attack.attackerId,
            defenderId: attack.defenderId,
            rivalId: attack.rivalId,
            kind: attack.kind,
            step: attack.step,
          }
        : null,
    };
  });
}

async function captureDomSnapshot(page: Page, filePath: string): Promise<void> {
  const html = await page.content();
  fs.writeFileSync(filePath, html);
}

async function startPracticeMatch(
  page: Page,
  playerDeck: string,
  botDeck: string,
  botStrategy: string,
): Promise<{ matchId: string; seed: string }> {
  await page.goto(`${BASE_URL}/practice`);
  await page.getByTestId("practice-setup-your-deck").selectOption(playerDeck);
  await page.getByTestId("practice-setup-bot-deck").selectOption(botDeck);
  await page.getByTestId("practice-setup-bot-strategy").selectOption(botStrategy);
  await page.getByTestId("practice-setup-start").click();
  await page.waitForURL(/\/practice\/practice_/);
  await page.waitForSelector('[data-testid="board-wrap"]', { timeout: 15000 });
  await page.waitForFunction(() =>
    Boolean((window as unknown as { __cyberpunkEngine?: unknown }).__cyberpunkEngine),
  );

  const url = page.url();
  const matchIdMatch = url.match(/practice\/(practice_[^/]+)/);
  const matchId = matchIdMatch ? matchIdMatch[1] : "unknown";

  const seed = await page.evaluate((mid) => {
    const raw = sessionStorage.getItem("cyberpunk.simulator.practiceMatch.sessions");
    if (!raw) return "unknown";
    const sessions = JSON.parse(raw);
    return sessions[mid]?.seed ?? "unknown";
  }, matchId);

  return { matchId, seed };
}

async function takeScreenshot(page: Page, name: string): Promise<string> {
  const fileName = `${name}.png`;
  const filePath = path.join(SCREENSHOT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: false });
  return filePath;
}

async function waitForStableState(
  page: Page,
  timeoutMs = 8000,
  pollMs = 200,
): Promise<EngineSnapshot> {
  const start = Date.now();
  let last = await captureEngineSnapshot(page);
  while (Date.now() - start < timeoutMs) {
    await page.waitForTimeout(pollMs);
    const current = await captureEngineSnapshot(page);
    if (
      current.turn === last.turn &&
      current.phase === last.phase &&
      current.activePlayer === last.activePlayer &&
      current.gameOver === last.gameOver &&
      current.promptType === last.promptType &&
      current.promptSubType === last.promptSubType &&
      JSON.stringify(current.availableVerbs) === JSON.stringify(last.availableVerbs) &&
      current.attackState?.step === last.attackState?.step
    ) {
      return current;
    }
    last = current;
  }
  return last;
}

async function clickFirstAllowedFixerDie(page: Page, side: string): Promise<void> {
  const gainGigButtons = page.locator('[data-testid^="prompt-gain-gig-"]');
  const count = await gainGigButtons.count();
  if (count > 0) {
    await gainGigButtons.first().click();
    return;
  }
  const die = page
    .locator(`[data-testid="fixer-zone"][data-side="${side}"] [data-testid="fixer-die"]`)
    .first();
  await die.click();
}

async function playFirstPlayableCard(page: Page): Promise<boolean> {
  const armableCards = await page
    .locator(
      '[data-testid="hand-zone"][data-side="player"] [data-testid="hand-card"] [data-interaction-state="armable"]',
    )
    .all();
  for (const card of armableCards.slice(0, 4)) {
    try {
      await card.click({ timeout: 1500 });
    } catch {
      continue;
    }
    await page.waitForTimeout(300);
    const playBtn = page.locator('[data-testid="card-action-playCard"]').first();
    try {
      await playBtn.click({ timeout: 1500 });
      return true;
    } catch {
      await page.keyboard.press("Escape").catch(() => undefined);
      await page.waitForTimeout(150);
    }
  }
  return false;
}

async function sellFirstSellableCard(page: Page): Promise<boolean> {
  const armableCards = await page
    .locator(
      '[data-testid="hand-zone"][data-side="player"] [data-testid="hand-card"] [data-interaction-state="armable"]',
    )
    .all();
  for (const card of armableCards.slice(0, 4)) {
    try {
      await card.click({ timeout: 1500 });
    } catch {
      continue;
    }
    await page.waitForTimeout(300);
    const sellBtn = page.locator('[data-testid="card-action-sellCard"]').first();
    try {
      await sellBtn.click({ timeout: 1500 });
      return true;
    } catch {
      await page.keyboard.press("Escape").catch(() => undefined);
      await page.waitForTimeout(150);
    }
  }
  return false;
}

async function callFirstLegend(page: Page): Promise<boolean> {
  const faceDownLegends = await page
    .locator(
      '[data-testid="legends-zone"][data-side="player"] [data-testid="legend-slot"][data-face-down="true"] [data-interaction-state="armable"]',
    )
    .all();
  for (const legend of faceDownLegends.slice(0, 3)) {
    try {
      await legend.click({ timeout: 1500 });
    } catch {
      continue;
    }
    await page.waitForTimeout(300);
    const callBtn = page.locator('[data-testid="card-action-callLegend"]').first();
    try {
      await callBtn.click({ timeout: 1500 });
      return true;
    } catch {
      await page.keyboard.press("Escape").catch(() => undefined);
      await page.waitForTimeout(150);
    }
  }
  return false;
}

async function attackRivalWithFirstReadyUnit(page: Page): Promise<boolean> {
  const readyUnits = await page
    .locator(
      '[data-testid="field-zone"][data-side="player"] [data-testid="field-unit"][data-ready="true"] [data-interaction-state="armable"]',
    )
    .all();
  for (const unit of readyUnits.slice(0, 4)) {
    try {
      await unit.click({ timeout: 1500 });
    } catch {
      continue;
    }
    await page.waitForTimeout(300);
    const stealBtn = page.locator('[data-testid="card-action-attackRival"]').first();
    try {
      await stealBtn.click({ timeout: 1500 });
      return true;
    } catch {
      await page.keyboard.press("Escape").catch(() => undefined);
      await page.waitForTimeout(150);
    }
  }
  return false;
}

/**
 * Click the first selectable card (field or hand) that matches eligible IDs.
 * Falls back to any selectable card if no IDs are provided.
 */
async function clickFirstSelectableCard(page: Page, eligibleIds?: string[]): Promise<boolean> {
  // Try field cards first
  const fieldCards = await page
    .locator('[data-testid="field-zone"] [data-interaction-state="selectable"]')
    .all();
  for (const card of fieldCards) {
    const cardId = await card.getAttribute("data-card-id").catch(() => null);
    if (!eligibleIds || eligibleIds.length === 0 || (cardId && eligibleIds.includes(cardId))) {
      await card.click();
      return true;
    }
  }
  // Then hand cards
  const handCards = await page
    .locator('[data-testid="hand-zone"] [data-interaction-state="selectable"]')
    .all();
  for (const card of handCards) {
    const cardId = await card.getAttribute("data-card-id").catch(() => null);
    if (!eligibleIds || eligibleIds.length === 0 || (cardId && eligibleIds.includes(cardId))) {
      await card.click();
      return true;
    }
  }
  // Then legend cards
  const legendCards = await page
    .locator('[data-testid="legends-zone"] [data-interaction-state="selectable"]')
    .all();
  for (const card of legendCards) {
    const cardId = await card.getAttribute("data-card-id").catch(() => null);
    if (!eligibleIds || eligibleIds.length === 0 || (cardId && eligibleIds.includes(cardId))) {
      await card.click();
      return true;
    }
  }
  return false;
}

/**
 * Click the first interactive gig die.
 */
async function clickFirstInteractiveGigDie(page: Page, eligibleIds?: string[]): Promise<boolean> {
  const dice = await page.locator('[data-testid="gig-die"][data-interactive="true"]').all();
  for (const die of dice) {
    const dieId = await die.getAttribute("data-die-id").catch(() => null);
    if (!eligibleIds || eligibleIds.length === 0 || (dieId && eligibleIds.includes(dieId))) {
      await die.click({ force: true });
      return true;
    }
  }
  // Fallback: any gig die in a selection-active row
  const rowDice = await page
    .locator('[data-testid="gig-row"][data-selection-active="true"] [data-testid="gig-die"]')
    .all();
  for (const die of rowDice) {
    const dieId = await die.getAttribute("data-die-id").catch(() => null);
    if (!eligibleIds || eligibleIds.length === 0 || (dieId && eligibleIds.includes(dieId))) {
      await die.click({ force: true });
      return true;
    }
  }
  return false;
}

/**
 * Handle modal-based choices (search deck, trigger, effect targets not on field, etc.)
 * by clicking the first button inside the modal.
 */
async function clickFirstModalOption(page: Page): Promise<boolean> {
  const modal = page.locator('[role="dialog"]');
  const buttons = await modal.locator("button").all();
  for (const btn of buttons) {
    const disabled = await btn.isDisabled().catch(() => true);
    if (!disabled) {
      await btn.click();
      return true;
    }
  }
  return false;
}

async function makePlayerMove(
  page: Page,
  snap: EngineSnapshot,
  stepNumber: number,
  game: GameRecord,
): Promise<{ actionDescription: string; uiPath: string }> {
  const verbs = snap.availableVerbs;

  if (snap.phase === "setup") {
    const mulligan = page.locator('[data-testid="prompt-verb-mulligan"]').first();
    if (verbs.includes("mulligan") && (await mulligan.isVisible().catch(() => false))) {
      await mulligan.click();
      return { actionDescription: "mulligan", uiPath: "prompt-verb-mulligan" };
    }
    const keep = page.locator('[data-testid="prompt-verb-keepHand"]').first();
    if (verbs.includes("keepHand") && (await keep.isVisible().catch(() => false))) {
      await keep.click();
      return { actionDescription: "keepHand", uiPath: "prompt-verb-keepHand" };
    }
    // After mulligan/keep, pass setup
    if (verbs.includes("passPhase")) {
      const advance = page.locator('[data-testid="phase-advance"]').first();
      if (await advance.isVisible().catch(() => false)) {
        await advance.click();
        return { actionDescription: "passPhase", uiPath: "phase-advance" };
      }
    }
  }

  // ── Pending choices MUST be resolved before phase advancement ──

  if (snap.promptType === "gainGig") {
    await clickFirstAllowedFixerDie(page, "player");
    return { actionDescription: "gainGig", uiPath: "fixer-die-click" };
  }

  if (snap.promptType === "chooseTarget") {
    if (snap.promptSubType === "effectTarget" && verbs.includes("resolveEffectTarget")) {
      if (snap.promptChoiceTargetKind === "gig") {
        const ok = await clickFirstInteractiveGigDie(page, snap.promptChoiceEligibleIds);
        if (ok) return { actionDescription: "resolveEffectTarget(gig)", uiPath: "gig-die-click" };
      }
      const ok = await clickFirstSelectableCard(page, snap.promptChoiceEligibleIds);
      if (ok) return { actionDescription: "resolveEffectTarget", uiPath: "selectable-card-click" };
      // Fallback: modal-based target selection (hand cards, etc.)
      const modalOk = await clickFirstModalOption(page);
      if (modalOk)
        return { actionDescription: "resolveEffectTarget", uiPath: "modal-option-click" };
    }

    if (snap.promptSubType === "discardFromHand" && verbs.includes("resolveDiscardFromHand")) {
      const ok = await clickFirstSelectableCard(page, snap.promptChoiceEligibleIds);
      if (ok)
        return { actionDescription: "resolveDiscardFromHand", uiPath: "selectable-hand-card" };
      const modalOk = await clickFirstModalOption(page);
      if (modalOk)
        return { actionDescription: "resolveDiscardFromHand", uiPath: "modal-option-click" };
    }

    if (snap.promptSubType === "adjustGig" && verbs.includes("resolveEffectTarget")) {
      // First click the gig die to select it (if interactive)
      const ok = await clickFirstInteractiveGigDie(page, snap.promptChoiceEligibleIds);
      if (ok) {
        await page.waitForTimeout(200);
        // Then click the max adjustment option
        const options = await page.locator('[data-testid="gig-adjust-option"]').all();
        if (options.length > 0) {
          // Click the option with highest value (usually last)
          await options[options.length - 1]!.click();
          return {
            actionDescription: "resolveEffectTarget(adjustGig)",
            uiPath: "gig-adjust-option",
          };
        }
      }
    }
  }

  if (snap.promptType === "chooseGigsToSteal" && verbs.includes("resolveStealGigs")) {
    const gigOptions = await page.locator('[data-testid^="steal-gig-"]').all();
    for (const opt of gigOptions) {
      await opt.click();
    }
    const confirm = page.locator('[data-testid="confirm-steal-gigs"]').first();
    try {
      await confirm.click({ timeout: 1500 });
      return { actionDescription: "resolveStealGigs", uiPath: "choose-gigs-to-steal-modal" };
    } catch {
      // confirm disabled — not enough gigs selected (shouldn't happen if we clicked all)
    }
  }

  if (snap.promptType === "chooseCardToPlay" && verbs.includes("resolveCardToPlay")) {
    const ok = await clickFirstSelectableCard(page, snap.promptChoiceEligibleIds);
    if (ok) return { actionDescription: "resolveCardToPlay", uiPath: "selectable-card-click" };
  }

  if (snap.promptType === "chooseCardToMove" && verbs.includes("resolveCardToMove")) {
    const ok = await clickFirstSelectableCard(page, snap.promptChoiceEligibleIds);
    if (ok) return { actionDescription: "resolveCardToMove", uiPath: "selectable-card-click" };
    // If no selectable card found, maybe we need to pass
    const modalOk = await clickFirstModalOption(page);
    if (modalOk) return { actionDescription: "resolveCardToMove", uiPath: "modal-option-click" };
  }

  if (snap.promptType === "searchDeck" && verbs.includes("resolveSearchDeck")) {
    const cards = await page.locator('[data-testid="search-deck-card"]').all();
    if (cards.length === 0) {
      // Try clicking skip/take none if available
      const skip = page.locator('[data-testid="search-deck-skip"]').first();
      if (await skip.isVisible().catch(() => false)) {
        await skip.click();
        return { actionDescription: "resolveSearchDeck(skip)", uiPath: "search-deck-skip" };
      }
    } else {
      // Click all cards, then confirm
      for (const card of cards) {
        await card.click();
      }
      const confirm = page.locator('[data-testid="search-deck-confirm"]').first();
      if (await confirm.isVisible().catch(() => false)) {
        await confirm.click();
        return { actionDescription: "resolveSearchDeck", uiPath: "search-deck-confirm" };
      }
      // Single-select: first click already submitted
      return { actionDescription: "resolveSearchDeck", uiPath: "search-deck-card-click" };
    }
  }

  if (snap.promptType === "chooseTrigger" && verbs.includes("resolveTrigger")) {
    const modalOk = await clickFirstModalOption(page);
    if (modalOk) return { actionDescription: "resolveTrigger", uiPath: "modal-option-click" };
  }

  if (snap.promptType === "chooseEffect") {
    const modalOk = await clickFirstModalOption(page);
    if (modalOk) return { actionDescription: "chooseEffect", uiPath: "modal-option-click" };
  }

  if (snap.promptType === "discardFromHand" && verbs.includes("resolveDiscardFromHand")) {
    const ok = await clickFirstSelectableCard(page, snap.promptChoiceEligibleIds);
    if (ok) return { actionDescription: "resolveDiscardFromHand", uiPath: "selectable-hand-card" };
  }

  if (snap.promptType === "adjustGig" && verbs.includes("resolveAdjustGig")) {
    const options = await page.locator('[data-testid="gig-adjust-option"]').all();
    if (options.length > 0) {
      await options[options.length - 1]!.click();
      return { actionDescription: "resolveAdjustGig", uiPath: "gig-adjust-option" };
    }
  }

  // ── Normal phase actions ──

  if (snap.phase === "main") {
    if (!snap.attackState) {
      if (verbs.includes("sellCard")) {
        const ok = await sellFirstSellableCard(page);
        if (ok)
          return { actionDescription: "sellCard", uiPath: "hand-card + card-action-sellCard" };
      }
      if (verbs.includes("playCard")) {
        const ok = await playFirstPlayableCard(page);
        if (ok)
          return { actionDescription: "playCard", uiPath: "hand-card + card-action-playCard" };
      }
      if (verbs.includes("callLegend")) {
        const ok = await callFirstLegend(page);
        if (ok)
          return {
            actionDescription: "callLegend",
            uiPath: "legend-slot + card-action-callLegend",
          };
      }
      if (verbs.includes("passPhase")) {
        const advance = page.locator('[data-testid="phase-advance"]').first();
        if (await advance.isVisible().catch(() => false)) {
          await advance.click();
          return { actionDescription: "passPhase", uiPath: "phase-advance" };
        }
      }
    } else {
      // Attack in progress within the main phase.
      if (verbs.includes("attackRival")) {
        const ok = await attackRivalWithFirstReadyUnit(page);
        if (ok)
          return {
            actionDescription: "attackRival",
            uiPath: "field-unit + card-action-attackRival",
          };
      }
      if (verbs.includes("passPhase")) {
        const advance = page.locator('[data-testid="phase-advance"]').first();
        if (await advance.isVisible().catch(() => false)) {
          await advance.click();
          return { actionDescription: "passPhase", uiPath: "phase-advance" };
        }
      }
      if (verbs.includes("resolveAttack")) {
        const advance = page.locator('[data-testid="phase-advance"]').first();
        if (await advance.isVisible().catch(() => false)) {
          await advance.click();
          return { actionDescription: "resolveAttack", uiPath: "phase-advance" };
        }
      }
    }
  }

  const advance = page.locator('[data-testid="phase-advance"]').first();
  if (await advance.isVisible().catch(() => false)) {
    await advance.click();
    return { actionDescription: "passPhase", uiPath: "phase-advance" };
  }

  game.issues.push({
    id: nextIssueId(),
    severity: "P1",
    title: `Player turn with no actionable UI path (game ${game.gameNumber}, step ${stepNumber})`,
    description: `Phase=${snap.phase}, prompt=${snap.promptType}:${snap.promptSubType}, verbs=[${verbs.join(", ")}]`,
    repro: "Observation harness reached player turn but could not find a valid UI action.",
    expected: "At least one UI action should be available and executable.",
    actual: "No UI action succeeded.",
  });
  return { actionDescription: "STUCK", uiPath: "none" };
}

function isHumanTurn(snap: EngineSnapshot): boolean {
  const humanSide = "p1";
  if (snap.activePlayer === humanSide) return true;
  // During attack defensive step, the defender (rivalId) must act even though
  // activePlayer is still the attacker.
  if (
    snap.attackState &&
    snap.attackState.step === "defensive" &&
    snap.attackState.rivalId === humanSide
  ) {
    return true;
  }
  return false;
}

async function runSingleGame(
  browser: Browser,
  gameNumber: number,
  playerDeck: string,
  botDeck: string,
  botStrategy: string,
): Promise<GameRecord> {
  const page = await browser.newPage();
  const game: GameRecord = {
    gameNumber,
    playerDeck,
    botDeck,
    botStrategy,
    matchId: "",
    seed: "",
    finalResult: null,
    winner: null,
    stopReason: null,
    observations: [],
    screenshots: [],
    issues: [],
  };

  try {
    const { matchId, seed } = await startPracticeMatch(page, playerDeck, botDeck, botStrategy);
    game.matchId = matchId;
    game.seed = seed;

    let stepNumber = 0;
    const maxSteps = 100;
    let consecutiveNoChange = 0;

    // Initial screenshot before any action
    const startShot = await takeScreenshot(page, `g${gameNumber}_start`);
    game.screenshots.push(startShot);

    while (stepNumber < maxSteps) {
      const before = await waitForStableState(page, 4000, 150);

      if (before.gameOver) {
        game.finalResult = `Game ended: winner=${before.winnerId}, reason=${before.winReason}`;
        game.winner = before.winnerId;
        const endShot = await takeScreenshot(page, `g${gameNumber}_end`);
        game.screenshots.push(endShot);
        break;
      }

      const playerTurn = isHumanTurn(before);
      stepNumber++;

      const shotName = `g${gameNumber}_s${stepNumber}_${playerTurn ? "player" : "bot"}_${before.phase}`;
      const screenshotPath = await takeScreenshot(page, shotName);
      const domPath = path.join(DOM_DIR, `${shotName}.html`);
      await captureDomSnapshot(page, domPath);
      game.screenshots.push(screenshotPath);

      if (playerTurn) {
        const { actionDescription, uiPath } = await makePlayerMove(page, before, stepNumber, game);

        await page.waitForTimeout(300);
        const after = await waitForStableState(page, 3000, 150);

        const stateChanged =
          after.turn !== before.turn ||
          after.phase !== before.phase ||
          after.activePlayer !== before.activePlayer ||
          after.playerHandSize !== before.playerHandSize ||
          after.playerFieldSize !== before.playerFieldSize ||
          after.playerGigCount !== before.playerGigCount ||
          after.attackState?.step !== before.attackState?.step;

        if (!stateChanged && actionDescription !== "STUCK" && actionDescription !== "passPhase") {
          consecutiveNoChange++;
          if (consecutiveNoChange >= 3) {
            game.stopReason = "player-stuck";
            game.issues.push({
              id: nextIssueId(),
              severity: "P1",
              title: `Player actions repeatedly failed to change state (game ${gameNumber})`,
              description: `Last attempted action: ${actionDescription} via ${uiPath}. Consecutive no-change count: ${consecutiveNoChange}`,
              repro:
                "Player turn with sell/play actions that click successfully but produce no engine state change.",
              expected: "Card actions should dispatch successfully and change engine state.",
              actual: "Action UI clicks succeed but engine state remains unchanged.",
            });
            break;
          }
        } else {
          consecutiveNoChange = 0;
        }

        if (!stateChanged && actionDescription !== "STUCK" && actionDescription !== "passPhase") {
          game.issues.push({
            id: nextIssueId(),
            severity: "P2",
            title: `Player action had no visible state change (game ${gameNumber}, step ${stepNumber})`,
            description: `Action: ${actionDescription} via ${uiPath}`,
            repro: "Click the UI element and observe engine state.",
            expected: "Engine state should change after a successful UI action.",
            actual: "Before and after snapshots are identical.",
          });
        }

        game.observations.push({
          stepNumber,
          actor: "player",
          actionDescription,
          uiPath,
          timestamp: new Date().toISOString(),
          before,
          after,
          screenshotPath,
          domSnapshotPath: domPath,
          notes: stateChanged ? [] : ["No state change detected after action"],
        });
      } else {
        const startTurn = before.turn;
        const startPhase = before.phase;
        const startPlayer = before.activePlayer;
        const startAttackStep = before.attackState?.step ?? null;

        let aiActed = false;
        let stuck = false;
        const aiStartTime = Date.now();
        const aiTimeout = 10000;
        let current: EngineSnapshot | undefined;

        while (Date.now() - aiStartTime < aiTimeout) {
          await page.waitForTimeout(300);
          current = await captureEngineSnapshot(page);

          if (current.gameOver) {
            aiActed = true;
            game.observations.push({
              stepNumber,
              actor: "bot",
              actionDescription: "ai-ended-game",
              uiPath: "auto-ai",
              timestamp: new Date().toISOString(),
              before,
              after: current,
              screenshotPath,
              domSnapshotPath: domPath,
              notes: [],
            });
            game.finalResult = `Game ended: winner=${current.winnerId}, reason=${current.winReason}`;
            game.winner = current.winnerId;
            const endShot = await takeScreenshot(page, `g${gameNumber}_end`);
            game.screenshots.push(endShot);
            break;
          }

          // If it's now the human's turn (e.g., defensive step), stop waiting for AI
          if (isHumanTurn(current)) {
            aiActed = true;
            game.observations.push({
              stepNumber,
              actor: "bot",
              actionDescription: `ai-yielded (turn ${startTurn}→${current.turn}, phase ${startPhase}→${current.phase})`,
              uiPath: "auto-ai",
              timestamp: new Date().toISOString(),
              before,
              after: current,
              screenshotPath,
              domSnapshotPath: domPath,
              notes: ["AI yielded to human for defensive step or pending choice"],
            });
            break;
          }

          if (
            current.turn !== startTurn ||
            current.phase !== startPhase ||
            current.activePlayer !== startPlayer ||
            current.attackState?.step !== startAttackStep
          ) {
            aiActed = true;
            game.observations.push({
              stepNumber,
              actor: "bot",
              actionDescription: `ai-action (turn ${startTurn}→${current.turn}, phase ${startPhase}→${current.phase})`,
              uiPath: "auto-ai",
              timestamp: new Date().toISOString(),
              before,
              after: current,
              screenshotPath,
              domSnapshotPath: domPath,
              notes: [],
            });
            break;
          }
        }

        if (!aiActed && !stuck) {
          game.issues.push({
            id: nextIssueId(),
            severity: "P1",
            title: `AI appears stuck (game ${gameNumber}, step ${stepNumber})`,
            description: "AI did not act within timeout and no error surfaced.",
            repro: "Let AI run in auto mode.",
            expected: "AI should advance the game state.",
            actual: "No state change after 15s.",
          });
          game.stopReason = "ai-stuck";
          break;
        }

        if (current?.gameOver) break;
      }
    }

    if (stepNumber >= maxSteps) {
      game.stopReason = "max-steps-reached";
      game.issues.push({
        id: nextIssueId(),
        severity: "P2",
        title: `Game ${gameNumber} reached max steps (${maxSteps})`,
        description: "Game did not end within the step limit.",
        repro: "Play the match to completion.",
        expected: "Game should end naturally within a reasonable number of steps.",
        actual: `Stopped after ${maxSteps} steps.`,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    game.stopReason = `exception: ${message}`;
    game.issues.push({
      id: nextIssueId(),
      severity: "P0",
      title: `Exception during game ${gameNumber}`,
      description: message,
      repro: "Run observation harness.",
      expected: "No exceptions.",
      actual: message,
    });
    const errorShot = await takeScreenshot(page, `g${gameNumber}_error`).catch(() => "");
    if (errorShot) game.screenshots.push(errorShot);
  } finally {
    await page.close();
  }

  return game;
}

async function main(): Promise<void> {
  ensureDirs();
  const browser = await chromium.launch({ headless: true });

  const deckPairs: Array<[string, string]> = [];
  for (let i = 0; i < TOTAL_GAMES; i++) {
    if (i % 2 === 0) {
      deckPairs.push(["arasaka-print-n-play", "merc-print-n-play"]);
    } else {
      deckPairs.push(["merc-print-n-play", "arasaka-print-n-play"]);
    }
  }

  const startIdx = games.length;
  for (let i = 0; i < TOTAL_GAMES; i++) {
    const [playerDeck, botDeck] = deckPairs[i]!;
    const gameNumber = startIdx + i + 1;
    console.log(
      `\n=== Game ${gameNumber}/${startIdx + TOTAL_GAMES}: ${playerDeck} vs ${botDeck} ===`,
    );
    const game = await runSingleGame(browser, gameNumber, playerDeck, botDeck, BOT_STRATEGY);
    games.push(game);
    console.log(`  Result: ${game.finalResult ?? game.stopReason ?? "incomplete"}`);
    console.log(`  Observations: ${game.observations.length}, Issues: ${game.issues.length}`);

    fs.writeFileSync(
      path.join(REPORT_DIR, "deep-observation-log.json"),
      JSON.stringify(games, null, 2),
    );
  }

  await browser.close();
  console.log(`\nDeep observation complete. ${games.length} games recorded.`);
  console.log(`Data: ${REPORT_DIR}/deep-observation-log.json`);
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);
  console.log(`DOM snapshots: ${DOM_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
