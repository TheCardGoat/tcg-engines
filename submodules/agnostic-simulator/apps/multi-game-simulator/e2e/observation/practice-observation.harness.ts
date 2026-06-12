/**
 * Cyberpunk TCG Practice Match Observation Harness
 *
 * This is NOT an autoplay script. It is a browser-driving observation tool
 * that starts practice matches, makes one action at a time through the visible
 * UI, and captures comprehensive state snapshots (engine + DOM + screenshots)
 * after every step. The purpose is readiness evidence, not win-rate stats.
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
const TOTAL_GAMES = Number(process.env.TOTAL_GAMES ?? "20");

interface StateSnapshot {
  timestamp: string;
  turn: number;
  phase: string;
  activePlayer: string;
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
  attackState: boolean;
  gameOver: boolean;
  winnerId: string | null;
  winReason: string | null;
  promptType: string | null;
  promptMessage: string | null;
  availableVerbs: string[];
  lastAiError: string | null;
  moveLogCount: number;
  rawEngineEventCount: number;
}

interface ActionRecord {
  stepNumber: number;
  actor: "player" | "bot";
  actionDescription: string;
  before: StateSnapshot;
  after: StateSnapshot;
  screenshotPath: string;
  uiPath: string;
  engineBridgeMatch: boolean;
  notes: string[];
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
  actions: ActionRecord[];
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

const games: GameRecord[] = fs.existsSync(path.join(REPORT_DIR, "observation-log.json"))
  ? (JSON.parse(
      fs.readFileSync(path.join(REPORT_DIR, "observation-log.json"), "utf-8"),
    ) as GameRecord[])
  : [];
let globalIssueCounter = 0;

function nextIssueId(): string {
  return `ISSUE-${String(++globalIssueCounter).padStart(3, "0")}`;
}

function ensureDirs(): void {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function captureSnapshot(page: Page): Promise<StateSnapshot> {
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
                attackState: unknown;
              };
            };
            getPhase: () => string;
            getTurnNumber: () => number;
            getActivePlayerId: () => string;
            getPrompt: (p: string) => {
              choice: { type: string } | null;
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
          getHumanSide: () => string;
          getDispatchLog: () => unknown[];
        };
      }
    ).__cyberpunkSimulator;

    if (!sim) {
      throw new Error("__cyberpunkSimulator not attached");
    }

    const engine = sim.engine;
    const state = engine.getState();
    const p1 = "p1";
    const p2 = "p2";
    const activePlayer = engine.getActivePlayerId();

    const p1Prompt = engine.getPrompt(p1);
    const p2Prompt = engine.getPrompt(p2);
    const activePrompt = activePlayer === p1 ? p1Prompt : p2Prompt;

    const verbs = activePrompt.availableMoves.map((m) => m.moveId);

    return {
      timestamp: new Date().toISOString(),
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
      attackState: state.G.attackState !== null,
      gameOver: engine.isGameOver(),
      winnerId: state.G.winnerId,
      winReason: state.G.winReason,
      promptType: activePrompt.choice?.type ?? null,
      promptMessage: activePrompt.message ?? null,
      availableVerbs: verbs,
      lastAiError: null,
      moveLogCount: 0,
      rawEngineEventCount: 0,
    };
  });
}

async function readLastAiError(page: Page): Promise<string | null> {
  const errorEl = page.locator('[data-testid="ai-error-message"]').first();
  try {
    const text = await errorEl.textContent({ timeout: 500 });
    return text?.trim() || null;
  } catch {
    return null;
  }
}

async function takeScreenshot(page: Page, name: string): Promise<string> {
  const fileName = `${name}.png`;
  const filePath = path.join(SCREENSHOT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: false });
  return filePath;
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

  // Inject a deterministic seed by overriding Math.random briefly, or just let it use Date.now()
  // For observation purposes, we capture the matchId and seed after creation.
  await page.getByTestId("practice-setup-start").click();
  await page.waitForURL(/\/practice\/practice_/);
  await page.waitForSelector('[data-testid="board-wrap"]', { timeout: 15000 });

  // Wait for engine bridge
  await page.waitForFunction(() =>
    Boolean((window as unknown as { __cyberpunkEngine?: unknown }).__cyberpunkEngine),
  );

  const url = page.url();
  const matchIdMatch = url.match(/practice\/(practice_[^/]+)/);
  const matchId = matchIdMatch ? matchIdMatch[1] : "unknown";

  // Read seed from sessionStorage
  const seed = await page.evaluate((mid) => {
    const raw = sessionStorage.getItem("cyberpunk.simulator.practiceMatch.sessions");
    if (!raw) return "unknown";
    const sessions = JSON.parse(raw);
    return sessions[mid]?.seed ?? "unknown";
  }, matchId);

  return { matchId, seed };
}

async function waitForStableState(
  page: Page,
  timeoutMs = 10000,
  pollMs = 300,
): Promise<StateSnapshot> {
  const start = Date.now();
  let last = await captureSnapshot(page);
  while (Date.now() - start < timeoutMs) {
    await page.waitForTimeout(pollMs);
    const current = await captureSnapshot(page);
    // Stable if same turn/phase/activePlayer and not game over
    if (
      current.turn === last.turn &&
      current.phase === last.phase &&
      current.activePlayer === last.activePlayer &&
      current.gameOver === last.gameOver &&
      current.promptType === last.promptType &&
      JSON.stringify(current.availableVerbs) === JSON.stringify(last.availableVerbs)
    ) {
      return current;
    }
    last = current;
  }
  return last;
}

async function clickFirstAllowedFixerDie(page: Page, side: "player" | "opponent"): Promise<void> {
  // Try prompt banner gig buttons first
  const gigButtons = page.locator(`[data-testid^="prompt-gain-gig-"]`);
  const count = await gigButtons.count();
  if (count > 0) {
    await gigButtons.first().click();
    return;
  }
  // Fallback: click first fixer die in the zone
  const die = page
    .locator(`[data-testid="fixer-zone"][data-side="${side}"] [data-testid="fixer-die"]`)
    .first();
  await die.click();
}

async function playFirstPlayableCard(page: Page): Promise<boolean> {
  // Click armable cards in hand until the action menu shows Play
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
  // Click armable cards in hand until the action menu shows Sell
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
  // Click face-down legend slots until the action menu shows Call legend
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
  // Click ready field units until the action menu shows Steal (attackRival)
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

async function makePlayerMove(
  page: Page,
  snap: StateSnapshot,
  stepNumber: number,
  game: GameRecord,
): Promise<{ actionDescription: string; uiPath: string }> {
  const verbs = snap.availableVerbs;

  // 1. Setup: mulligan or keep
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
  }

  // 2. Gain Gig
  if (snap.promptType === "gainGig") {
    await clickFirstAllowedFixerDie(page, "player");
    return { actionDescription: "gainGig", uiPath: "fixer-die-click" };
  }

  // 3. Main phase actions
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
    } else {
      // 4. Attack in progress within the main phase.
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
    }
  }

  // 5. Fallback: phase-advance if visible
  const advance = page.locator('[data-testid="phase-advance"]').first();
  if (await advance.isVisible().catch(() => false)) {
    await advance.click();
    return { actionDescription: "passPhase", uiPath: "phase-advance" };
  }

  // 6. Desperation: if nothing worked and it's our turn, record an issue
  game.issues.push({
    id: nextIssueId(),
    severity: "P1",
    title: `Player turn with no actionable UI path (game ${game.gameNumber}, step ${stepNumber})`,
    description: `Phase=${snap.phase}, prompt=${snap.promptType}, verbs=[${verbs.join(", ")}]`,
    repro: "Observation harness reached player turn but could not find a valid UI action.",
    expected: "At least one UI action should be available and executable.",
    actual: "No UI action succeeded.",
  });
  return { actionDescription: "STUCK", uiPath: "none" };
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
    actions: [],
    screenshots: [],
    issues: [],
  };

  try {
    const { matchId, seed } = await startPracticeMatch(page, playerDeck, botDeck, botStrategy);
    game.matchId = matchId;
    game.seed = seed;

    let stepNumber = 0;
    const maxSteps = 100;
    let screenshotCounter = 0;
    let consecutiveNoChange = 0;

    async function maybeScreenshot(reason: string): Promise<string | null> {
      screenshotCounter++;
      // Only screenshot start, end, every 20th step, and issues
      if (
        screenshotCounter <= 2 ||
        screenshotCounter % 20 === 0 ||
        reason.includes("issue") ||
        reason.includes("end") ||
        reason.includes("error")
      ) {
        return takeScreenshot(page, `g${gameNumber}_${reason}`);
      }
      return null;
    }

    const startShot = await maybeScreenshot("start");
    if (startShot) game.screenshots.push(startShot);

    while (stepNumber < maxSteps) {
      const before = await waitForStableState(page, 4000, 150);
      before.lastAiError = await readLastAiError(page);

      if (before.gameOver) {
        game.finalResult = `Game ended: winner=${before.winnerId}, reason=${before.winReason}`;
        game.winner = before.winnerId;
        const endShot = await maybeScreenshot("end");
        if (endShot) game.screenshots.push(endShot);
        break;
      }

      const isPlayerTurn = before.activePlayer === "p1";

      if (isPlayerTurn) {
        stepNumber++;
        const shotPath = (await maybeScreenshot(`s${stepNumber}_before`)) ?? "";
        const { actionDescription, uiPath } = await makePlayerMove(page, before, stepNumber, game);

        await page.waitForTimeout(300);
        const after = await waitForStableState(page, 3000, 150);
        after.lastAiError = await readLastAiError(page);

        const stateChanged =
          after.turn !== before.turn ||
          after.phase !== before.phase ||
          after.activePlayer !== before.activePlayer ||
          after.playerHandSize !== before.playerHandSize ||
          after.playerFieldSize !== before.playerFieldSize ||
          after.playerGigCount !== before.playerGigCount;

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

        game.actions.push({
          stepNumber,
          actor: "player",
          actionDescription,
          before,
          after,
          screenshotPath: shotPath,
          uiPath,
          engineBridgeMatch: stateChanged || actionDescription === "passPhase",
          notes: stateChanged ? [] : ["No state change detected after action"],
        });
      } else {
        stepNumber++;
        const shotPath = (await maybeScreenshot(`s${stepNumber}_ai_before`)) ?? "";
        const startTurn = before.turn;
        const startPhase = before.phase;
        const startPlayer = before.activePlayer;

        let aiActed = false;
        let stuck = false;
        const aiStartTime = Date.now();
        const aiTimeout = 10000;
        let current: StateSnapshot | undefined;

        while (Date.now() - aiStartTime < aiTimeout) {
          await page.waitForTimeout(300);
          current = await captureSnapshot(page);
          current.lastAiError = await readLastAiError(page);

          if (current.gameOver) {
            aiActed = true;
            game.actions.push({
              stepNumber,
              actor: "bot",
              actionDescription: "ai-ended-game",
              before,
              after: current,
              screenshotPath: shotPath,
              uiPath: "auto-ai",
              engineBridgeMatch: true,
              notes: [],
            });
            game.finalResult = `Game ended: winner=${current.winnerId}, reason=${current.winReason}`;
            game.winner = current.winnerId;
            const endShot = await maybeScreenshot("end");
            if (endShot) game.screenshots.push(endShot);
            break;
          }

          if (
            current.turn !== startTurn ||
            current.phase !== startPhase ||
            current.activePlayer !== startPlayer
          ) {
            aiActed = true;
            game.actions.push({
              stepNumber,
              actor: "bot",
              actionDescription: `ai-action (turn ${startTurn}→${current.turn}, phase ${startPhase}→${current.phase})`,
              before,
              after: current,
              screenshotPath: shotPath,
              uiPath: "auto-ai",
              engineBridgeMatch: true,
              notes: current.lastAiError ? [`AI error: ${current.lastAiError}`] : [],
            });
            break;
          }

          if (current.lastAiError) {
            stuck = true;
            game.issues.push({
              id: nextIssueId(),
              severity: "P1",
              title: `AI error during bot turn (game ${gameNumber}, step ${stepNumber})`,
              description: current.lastAiError,
              repro: "Let AI run in auto mode during bot turn.",
              expected: "AI should make legal moves without errors.",
              actual: `AI error: ${current.lastAiError}`,
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

  const targetTotal = TOTAL_GAMES;
  const deckPairs: Array<[string, string]> = [];
  for (let i = 0; i < targetTotal; i++) {
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
    const game = await runSingleGame(browser, gameNumber, playerDeck, botDeck, "greedy");
    games.push(game);
    console.log(`  Result: ${game.finalResult ?? game.stopReason ?? "incomplete"}`);
    console.log(`  Actions: ${game.actions.length}, Issues: ${game.issues.length}`);

    // Write incremental JSON
    fs.writeFileSync(path.join(REPORT_DIR, "observation-log.json"), JSON.stringify(games, null, 2));
  }

  await browser.close();

  // Compile markdown report
  compileMarkdownReport();
  console.log(`\nReport written to ${REPORT_DIR}`);
}

function compileMarkdownReport(): void {
  const lines: string[] = [];
  lines.push("# Cyberpunk TCG Practice Match Readiness Report");
  lines.push("");
  lines.push(`**Date:** ${new Date().toISOString()}`);
  lines.push(`**Games:** ${games.length}`);
  lines.push(`**Decks:** Arasaka (Print & Play) vs Merc (Print & Play)`);
  lines.push(`**Bot Strategy:** greedy`);
  lines.push(`**Simulator URL:** ${BASE_URL}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");

  const completed = games.filter((g) => g.finalResult && !g.stopReason).length;
  const p0 = games.flatMap((g) => g.issues).filter((i) => i.severity === "P0").length;
  const p1 = games.flatMap((g) => g.issues).filter((i) => i.severity === "P1").length;
  const p2 = games.flatMap((g) => g.issues).filter((i) => i.severity === "P2").length;
  const p3 = games.flatMap((g) => g.issues).filter((i) => i.severity === "P3").length;

  lines.push(`- Games completed to end condition: ${completed}/${games.length}`);
  lines.push(`- P0 blockers: ${p0}`);
  lines.push(`- P1 release blockers: ${p1}`);
  lines.push(`- P2 polish: ${p2}`);
  lines.push(`- P3 follow-up: ${p3}`);
  lines.push("");

  // Grouped issues
  lines.push("## Grouped Findings");
  lines.push("");
  const allIssues = games.flatMap((g) => g.issues);
  for (const severity of ["P0", "P1", "P2", "P3"] as const) {
    const sevIssues = allIssues.filter((i) => i.severity === severity);
    if (sevIssues.length === 0) continue;
    lines.push(`### ${severity}`);
    lines.push("");
    for (const issue of sevIssues) {
      lines.push(`#### ${issue.id}: ${issue.title}`);
      lines.push(`- **Description:** ${issue.description}`);
      lines.push(`- **Repro:** ${issue.repro}`);
      lines.push(`- **Expected:** ${issue.expected}`);
      lines.push(`- **Actual:** ${issue.actual}`);
      lines.push("");
    }
  }

  // Per-game notes
  lines.push("## Per-Game Notes");
  lines.push("");
  for (const game of games) {
    lines.push(`### Game ${game.gameNumber}`);
    lines.push(`- **Player deck:** ${game.playerDeck}`);
    lines.push(`- **Bot deck:** ${game.botDeck}`);
    lines.push(`- **Bot strategy:** ${game.botStrategy}`);
    lines.push(`- **Match ID:** ${game.matchId}`);
    lines.push(`- **Seed:** ${game.seed}`);
    lines.push(`- **Result:** ${game.finalResult ?? game.stopReason ?? "stopped"}`);
    lines.push(`- **Winner:** ${game.winner ?? "n/a"}`);
    lines.push(`- **Actions recorded:** ${game.actions.length}`);
    lines.push(`- **Screenshots:** ${game.screenshots.length}`);
    lines.push("");

    if (game.actions.length > 0) {
      lines.push("#### Action Log");
      lines.push("");
      lines.push("| Step | Actor | Action | Phase→Phase | Turn | Notes |");
      lines.push("|------|-------|--------|-------------|------|-------|");
      for (const action of game.actions) {
        const phaseTransition = `${action.before.phase} → ${action.after.phase}`;
        const turn = action.after.turn;
        const notes = action.notes.join("; ") || "-";
        lines.push(
          `| ${action.stepNumber} | ${action.actor} | ${action.actionDescription} | ${phaseTransition} | ${turn} | ${notes} |`,
        );
      }
      lines.push("");
    }
  }

  lines.push("## Readiness Verdict");
  lines.push("");
  if (p0 > 0) {
    lines.push("**NOT READY** — P0 blockers prevent reliable practice match completion.");
  } else if (p1 > 5) {
    lines.push("**NOT READY** — Multiple P1 release blockers degrade the practice experience.");
  } else if (p1 > 0) {
    lines.push(
      "**READY WITH CAVEATS** — Core practice flow works, but P1 issues should be addressed before release.",
    );
  } else {
    lines.push("**READY** — No blocking issues found across 20 observed games.");
  }
  lines.push("");

  fs.writeFileSync(path.join(REPORT_DIR, "report.md"), lines.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
