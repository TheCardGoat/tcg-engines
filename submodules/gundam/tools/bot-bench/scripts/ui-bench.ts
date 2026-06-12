#!/usr/bin/env node
import { chromium, type ConsoleMessage, type Locator, type Page } from "@playwright/test";
import {
  candidateToCommand,
  enumerateGundamBotCandidates,
  type CandidateStrategy,
  type GundamBotCandidate,
  type PlayerId,
} from "@tcg/gundam-engine";

import {
  buildBenchRuntime,
  PLAYER_ONE,
  PLAYER_TWO,
  REGISTERED_DECKS,
  type BenchDeckId,
} from "../src/runtime.ts";
import { REGISTERED_STRATEGIES, type BenchStrategyId } from "../src/strategies.ts";

interface CliArgs {
  p1: BenchStrategyId;
  p2: BenchStrategyId;
  "p1-deck": BenchDeckId;
  "p2-deck": BenchDeckId;
  seed: string;
  "base-url": string;
  "max-actions": number;
  headed: boolean;
  help?: boolean;
}

interface BrowserState {
  readonly stateId: number;
  readonly activePlayer: string;
  readonly phase: string;
  readonly step?: string;
  readonly gameEnded: boolean;
}

const UI_REGRESSION_EXIT_CODE = 4;
const STATE_ADVANCE_TIMEOUT_MS = 5000;
const OPTIONAL_CONTROL_TIMEOUT_MS = 1000;
const CARD_CLICK_TIMEOUT_MS = 5000;

class UiBenchRegressionError extends Error {
  readonly exitCode = UI_REGRESSION_EXIT_CODE;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "UiBenchRegressionError";
  }
}

const DEFAULTS: CliArgs = {
  p1: "greedy-legal",
  p2: "greedy-legal",
  "p1-deck": "ef-starter",
  "p2-deck": "ef-starter",
  seed: "bot-bench-ui",
  "base-url": "http://localhost:5180/gundam/simulator",
  "max-actions": 40,
  headed: false,
};

function parseArgs(argv: readonly string[]): CliArgs {
  const out = { ...DEFAULTS } as unknown as Record<string, unknown>;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--help" || arg === "-h") {
      out.help = true;
      continue;
    }
    if (arg === "--headed") {
      out.headed = true;
      continue;
    }
    if (arg === "--") continue;
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
    i++;
    out[key] = key === "max-actions" ? Number.parseInt(value, 10) : value;
  }
  return out as unknown as CliArgs;
}

function printHelp(): void {
  process.stdout.write(
    `bot-bench ui-bench\n\n` +
      `  --base-url <url>    Mounted simulator URL. Default http://localhost:5180/gundam/simulator\n` +
      `  --p1 <id>           Player one strategy.\n` +
      `  --p2 <id>           Player two strategy.\n` +
      `  --p1-deck <id>      Player one deck.\n` +
      `  --p2-deck <id>      Player two deck.\n` +
      `  --seed <seed>       Match seed.\n` +
      `  --max-actions <n>   UI action cap. Default 40.\n` +
      `  --headed            Show browser.\n`,
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  validate(args);

  const browser = await chromium.launch({ headless: !args.headed });
  const page = await browser.newPage();
  const consoleErrors: string[] = [];
  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err: Error) => consoleErrors.push(err.message));

  try {
    await runUiBench(page, args, consoleErrors);
  } finally {
    await browser.close();
  }
}

async function runUiBench(
  page: Page,
  args: CliArgs,
  consoleErrors: readonly string[],
): Promise<void> {
  const p1Deck = REGISTERED_DECKS[args["p1-deck"]];
  const p2Deck = REGISTERED_DECKS[args["p2-deck"]];
  const p1Strategy = REGISTERED_STRATEGIES[args.p1];
  const p2Strategy = REGISTERED_STRATEGIES[args.p2];
  if (!p1Deck || !p2Deck || !p1Strategy || !p2Strategy) {
    throw new Error("Invalid strategy or deck");
  }

  const { runtime, staticResources } = buildBenchRuntime({
    p1Deck,
    p2Deck,
    seed: args.seed,
  });
  const strategies = new Map<PlayerId, CandidateStrategy>([
    [PLAYER_ONE, p1Strategy],
    [PLAYER_TWO, p2Strategy],
  ]);

  const baseUrl = args["base-url"].endsWith("/") ? args["base-url"] : `${args["base-url"]}/`;
  const url = new URL("bot-bench-ui", baseUrl);
  url.searchParams.set("p1Deck", args["p1-deck"]);
  url.searchParams.set("p2Deck", args["p2-deck"]);
  url.searchParams.set("seed", args.seed);
  await page.goto(url.toString());
  await page.getByTestId("bot-bench-state").waitFor({ state: "attached" });

  for (let actionIndex = 0; actionIndex < args["max-actions"]; actionIndex++) {
    if (consoleErrors.length > 0) {
      throwUiRegression(`browser console/page error: ${consoleErrors[0]}`);
    }

    const browserState = await readBrowserState(page);
    if (browserState.gameEnded) {
      process.stdout.write(`UI bench completed in ${actionIndex} action(s).\n`);
      return;
    }

    const activePlayer = runtime.getState().ctx.status.activePlayer;
    if (String(activePlayer) !== browserState.activePlayer) {
      throwUiRegression(
        `mirror active player ${String(activePlayer)} differs from UI ${browserState.activePlayer}`,
      );
    }
    const strategy = strategies.get(activePlayer);
    if (!strategy) throwUiRegression(`no strategy for ${String(activePlayer)}`);

    const candidate = chooseCandidate(runtime, staticResources, activePlayer, strategy);
    if (!candidate) throwUiRegression(`no UI candidate for ${String(activePlayer)}`);

    const before = browserState.stateId;
    await performUiCandidate(page, candidate, String(activePlayer));
    try {
      await page.waitForFunction(
        `(expectedStateId) => {
          const node = document.querySelector('[data-testid="bot-bench-state"]');
          if (!node?.textContent) return false;
          const parsed = JSON.parse(node.textContent);
          return parsed.stateId !== expectedStateId;
        }`,
        before,
        { timeout: STATE_ADVANCE_TIMEOUT_MS },
      );
    } catch (err) {
      const latest = await readBrowserState(page);
      throwUiRegression(
        `UI action did not advance state: action=${candidate.family} player=${String(
          activePlayer,
        )} before=${before} after=${latest.stateId} phase=${latest.phase} step=${latest.step}`,
        err,
      );
    }

    submitMirrorCandidate(runtime, activePlayer, candidate);
    await assertNoSubmitError(page);
  }

  throwUiRegression(`UI bench reached max-actions=${args["max-actions"]} before game end`);
}

function validate(args: CliArgs): void {
  if (!REGISTERED_STRATEGIES[args.p1]) throw new Error(`Unknown --p1 strategy: ${args.p1}`);
  if (!REGISTERED_STRATEGIES[args.p2]) throw new Error(`Unknown --p2 strategy: ${args.p2}`);
  if (!REGISTERED_DECKS[args["p1-deck"]]) throw new Error(`Unknown --p1-deck: ${args["p1-deck"]}`);
  if (!REGISTERED_DECKS[args["p2-deck"]]) throw new Error(`Unknown --p2-deck: ${args["p2-deck"]}`);
  if (!Number.isInteger(args["max-actions"]) || args["max-actions"] <= 0) {
    throw new Error(`--max-actions must be a positive integer`);
  }
}

function chooseCandidate(
  runtime: ReturnType<typeof buildBenchRuntime>["runtime"],
  staticResources: ReturnType<typeof buildBenchRuntime>["staticResources"],
  playerId: PlayerId,
  strategy: CandidateStrategy,
): GundamBotCandidate | null {
  const state = runtime.getState();
  const candidates = enumerateGundamBotCandidates(state, playerId, staticResources);
  if (candidates.length === 0) return null;
  const ordered = strategy.selectCandidates({
    playerId,
    state,
    view: runtime.getFilteredView({ role: "player", playerId }),
    candidates,
    turnNumber: state.ctx.status.turn,
    pendingChoice: runtime.getPendingChoice({ role: "player", playerId }) ?? null,
    cards: runtime.getCardReadAPI(),
  });
  return ordered[0] ?? null;
}

async function performUiCandidate(
  page: Page,
  candidate: GundamBotCandidate,
  activePlayer: string,
): Promise<void> {
  switch (candidate.family) {
    case "chooseFirstPlayer":
      await page
        .getByRole("button", {
          name: candidate.playerId === activePlayer ? /i go first/i : /opponent goes first/i,
        })
        .click();
      return;
    case "alterHand":
      await page
        .getByRole("button", { name: candidate.wantsRedraw ? /redraw hand/i : /keep hand/i })
        .click();
      return;
    case "deployUnit":
    case "deployBase":
      await clickCard(page, candidate.cardId);
      await performTargetArray(page, candidate.targets);
      await clickOptionalConfirm(page);
      return;
    case "playCommand":
      await clickCard(page, candidate.cardId);
      await clickIfVisible(page.getByTestId("dual-mode-command"), "dual-mode command choice");
      await performTargetArray(page, candidate.targets);
      await clickOptionalConfirm(page);
      return;
    case "assignPilot":
      await clickCard(page, candidate.pilotId);
      await clickCard(page, candidate.unitId);
      await clickOptionalConfirm(page);
      return;
    case "playCommandAsPilot":
      await clickCard(page, candidate.cardId);
      await clickIfVisible(page.getByTestId("dual-mode-pilot"), "dual-mode pilot choice");
      await clickCard(page, candidate.unitId);
      await clickOptionalConfirm(page);
      return;
    case "enterBattle":
      await clickCard(page, candidate.attackerId);
      await clickAttackTarget(page, candidate.target);
      await clickOptionalConfirm(page);
      return;
    case "declareBlock":
      await clickCard(page, candidate.blockerId);
      await clickOptionalConfirm(page);
      return;
    case "activateAbility":
      await clickCard(page, candidate.cardId);
      await page.getByTestId(`game-prompt-mode-${candidate.effectIndex}`).click();
      await performTargetArray(page, candidate.targets);
      await clickOptionalConfirm(page);
      return;
    case "passBlock":
    case "passBattleAction":
    case "passActionStep":
    case "passTurn":
      await page.getByTestId("primary-action").click();
      return;
    case "concede":
      await page.getByTestId("concede-action").click();
      return;
    case "skipOpponentTurn":
      await page.getByTestId("skip-opponent-turn").click();
      return;
    case "dropOpponent":
      await page.getByTestId("drop-opponent").click();
      return;
    case "resolveEffect":
      await performResolveEffect(page, candidate);
      return;
    case "discardToHandLimit":
      for (const cardId of candidate.cardIds) {
        await clickCard(page, cardId);
      }
      await clickOptionalConfirm(page);
      return;
    default:
      return assertNeverCandidate(candidate);
  }
}

async function performTargetArray(
  page: Page,
  targets: readonly string[] | undefined,
): Promise<void> {
  if (!targets) return;
  for (const targetId of targets) {
    await clickCard(page, targetId);
  }
}

async function performResolveEffect(
  page: Page,
  candidate: Extract<GundamBotCandidate, { family: "resolveEffect" }>,
): Promise<void> {
  if (candidate.deckLookAnswers) {
    await performDeckLook(page, candidate.deckLookAnswers);
    return;
  }

  if (candidate.optionalAnswers) {
    const accepted = Object.values(candidate.optionalAnswers)[0];
    await page.getByTestId(accepted ? "pending-effect-accept" : "pending-effect-decline").click();
    return;
  }

  if (candidate.chooseOneAnswers) {
    const choice = Object.values(candidate.chooseOneAnswers)[0];
    if (typeof choice !== "number") {
      throwUiRegression(`invalid choose-one answer: ${JSON.stringify(candidate.chooseOneAnswers)}`);
    }
    await page.getByTestId(`pending-effect-choose-one-${choice}`).click();
    return;
  }

  await performTargetArray(page, candidate.targets);
  if ((candidate.targets?.length ?? 0) === 0) {
    const declined = await clickIfVisible(
      page.getByTestId("pending-effect-decline"),
      "pending effect decline",
    );
    if (declined) return;
  }
  await clickIfVisible(page.getByTestId("pending-effect-accept"), "pending effect accept");
}

async function performDeckLook(
  page: Page,
  answers: NonNullable<Extract<GundamBotCandidate, { family: "resolveEffect" }>["deckLookAnswers"]>,
): Promise<void> {
  const answer = Object.values(answers)[0];
  if (!answer) throwUiRegression("missing deck-look answer");

  await page.getByTestId("pending-effect-open-modal").click();

  if (answer.tutorCardId) {
    await clickDeckLookAction(page, answer.tutorCardId, /^(HAND|DEPLOY)$/);
  }
  for (const cardId of answer.toTop ?? []) {
    await clickDeckLookAction(page, cardId, /^TOP$/);
  }
  for (const cardId of answer.toBottom ?? []) {
    await clickDeckLookAction(page, cardId, /^BOTTOM$/);
  }
  for (const cardId of answer.toTrash ?? []) {
    await clickDeckLookAction(page, cardId, /^TRASH$/);
  }

  await page.getByTestId("deck-look-confirm").click();
}

async function clickDeckLookAction(page: Page, cardId: string, label: RegExp): Promise<void> {
  const card = page.getByTestId(`deck-look-card-${cardId}`).locator("xpath=..");
  await card.getByRole("button", { name: label }).click();
}

async function clickAttackTarget(page: Page, targetId: string): Promise<void> {
  if (targetId === "direct") {
    await page.getByTestId("attack-target-direct").click();
    return;
  }
  await page.getByTestId(`attack-target-${targetId}`).click();
}

async function clickOptionalConfirm(page: Page): Promise<void> {
  await clickIfVisible(page.getByTestId("game-prompt-confirm"), "game prompt confirm");
}

async function clickIfVisible(locator: Locator, description: string): Promise<boolean> {
  try {
    await locator.waitFor({ state: "visible", timeout: OPTIONAL_CONTROL_TIMEOUT_MS });
    await locator.click();
    return true;
  } catch {
    process.stderr.write(`ui-bench optional control not visible: ${description}\n`);
    return false;
  }
}

async function clickCard(page: Page, cardId: string): Promise<void> {
  const card = page.locator(cardXPath(cardId)).first();
  try {
    await card.click({ timeout: CARD_CLICK_TIMEOUT_MS });
  } catch (err) {
    throwUiRegression(`could not click visible card ${cardId}`, err);
  }
}

function assertNeverCandidate(_candidate: never): never {
  throwUiRegression("unsupported UI candidate");
}

function cardXPath(cardId: string): string {
  return (
    `xpath=//*[@data-card-id=${xpathString(cardId)}` +
    ` and not(self::button)` +
    ` and not(ancestor::*[@aria-hidden="true"])` +
    ` and not(ancestor::*[@role="log"])]`
  );
}

function xpathString(value: string): string {
  if (!value.includes("'")) return `'${value}'`;
  if (!value.includes('"')) return `"${value}"`;
  return `concat(${value
    .split("'")
    .map((part) => `'${part}'`)
    .join(`, "'", `)})`;
}

function submitMirrorCandidate(
  runtime: ReturnType<typeof buildBenchRuntime>["runtime"],
  playerId: PlayerId,
  candidate: GundamBotCandidate,
): void {
  const { move, args } = candidateToCommand(candidate);
  const stateID = runtime.getState().ctx._stateID;
  const result = runtime.executeCommand(
    {
      commandID: `ui-bench-${String(playerId)}-${stateID}-${move}`,
      move,
      prevStateID: stateID,
      actorRole: "player",
      args,
    },
    playerId,
  );
  if (!result.success) {
    throwUiRegression(`mirror rejected ${candidate.family}: ${result.errorCode} ${result.error}`);
  }
}

async function readBrowserState(page: Page): Promise<BrowserState> {
  const text = await page.getByTestId("bot-bench-state").textContent();
  if (!text) throwUiRegression("missing bot-bench-state");
  return JSON.parse(text) as BrowserState;
}

async function assertNoSubmitError(page: Page): Promise<void> {
  const toast = page.getByTestId("submit-error-toast");
  if ((await toast.count()) === 0) return;
  if (!(await toast.first().isVisible())) return;
  const text = await toast.first().textContent();
  throwUiRegression(`submit error toast appeared: ${text ?? ""}`);
}

function throwUiRegression(message: string, cause?: unknown): never {
  throw new UiBenchRegressionError(message, cause instanceof Error ? { cause } : undefined);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  process.stderr.write(`ui-bench failed: ${message}\n`);
  const code =
    typeof (err as { exitCode?: unknown }).exitCode === "number"
      ? (err as { exitCode: number }).exitCode
      : 1;
  process.exit(code);
});
