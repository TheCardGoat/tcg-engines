import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  applyCommand,
  createMatch,
  createSt01MirrorPracticeConfig,
  getLegalCommands,
  getOnePieceAutomatedActionStrategyOption,
  getSafeOnePieceAutomatedActionStrategyOption,
  ONE_PIECE_AUTOMATED_ACTION_STRATEGIES,
  resolveBotPromptCommand,
  type EngineCommand,
  type LegalCommandDescriptor,
  type MatchConfig,
  type MatchPlayerConfig,
  type MatchSeat,
  type MatchState,
  type OnePieceBotAgent,
  type OnePieceBotDecisionContext,
  type PromptState,
} from "@tcg/op-engine";
import type {
  AutoStepResult,
  CreatePlaySessionOptions,
  PlayAction,
  PlayAdapter,
  PlayDoctorResult,
  PlayEndResult,
  PlayObservation,
  PlaySession,
  PlayTerminationReason,
} from "../types.ts";

const GAME = "one-piece" as const;
const DEFAULT_MAX_STEPS = 1_000;
const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const PLAYABLE_DECK_DIR = join(PACKAGE_ROOT, "decks/playable");

interface DeckFile {
  readonly id?: string;
  readonly leaderId: string;
  readonly mainDeck: string[];
  readonly name?: string;
}

function loadDeckFile(spec: string | undefined, seatLabel: string): DeckFile | undefined {
  if (!spec) return undefined;
  const candidates = [
    isAbsolute(spec) ? spec : resolve(process.cwd(), spec),
    join(PLAYABLE_DECK_DIR, `${spec}.json`),
    join(PLAYABLE_DECK_DIR, spec),
    resolve(PACKAGE_ROOT, spec),
  ];
  const path = candidates.find((candidate) => existsSync(candidate));
  if (!path) {
    throw new Error(`Unknown ${seatLabel} deck "${spec}". Tried: ${candidates.join(", ")}`);
  }
  const parsed = JSON.parse(readFileSync(path, "utf8")) as DeckFile;
  if (!parsed.leaderId || !Array.isArray(parsed.mainDeck) || parsed.mainDeck.length === 0) {
    throw new Error(`Invalid deck file ${path}: need leaderId and non-empty mainDeck`);
  }
  return {
    id: parsed.id ?? spec,
    leaderId: parsed.leaderId,
    mainDeck: [...parsed.mainDeck],
    name: parsed.name,
  };
}

function playerConfigFromDeck(deck: DeckFile, playerName: string): MatchPlayerConfig {
  return {
    leaderCardId: deck.leaderId,
    mainDeck: [...deck.mainDeck],
    donDeckCount: 10,
    playerName,
  };
}

function buildMatchConfig(
  seed: string,
  p1Deck: DeckFile | undefined,
  p2Deck: DeckFile | undefined,
): MatchConfig {
  if (!p1Deck && !p2Deck) {
    return createSt01MirrorPracticeConfig({ firstPlayer: "south", seed });
  }
  const practice = createSt01MirrorPracticeConfig({ firstPlayer: "south", seed });
  return {
    ...practice,
    seed,
    shuffleDecks: true,
    skipFirstTurnDraw: true,
    players: {
      south: p1Deck
        ? playerConfigFromDeck(p1Deck, p1Deck.name ?? p1Deck.id ?? "P1")
        : practice.players.south,
      north: p2Deck
        ? playerConfigFromDeck(p2Deck, p2Deck.name ?? p2Deck.id ?? "P2")
        : practice.players.north,
    },
  };
}

/** Deterministic [0,1) stream from a string seed (FNV-ish + xorshift mix). */
function createSeededRandom(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1) >>> 0;
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

function botAgentFor(strategyId?: string): OnePieceBotAgent {
  if (strategyId === undefined || strategyId === "") {
    const option = getSafeOnePieceAutomatedActionStrategyOption();
    return { id: option.id, choose: option.strategy, resolvePrompt: option.resolvePrompt };
  }
  const option = getOnePieceAutomatedActionStrategyOption(strategyId);
  if (!option) {
    const known = ONE_PIECE_AUTOMATED_ACTION_STRATEGIES.map((entry) => entry.id).join(", ");
    throw new Error(`Unknown One Piece strategy: ${strategyId}. Known: ${known}`);
  }
  return { id: option.id, choose: option.strategy, resolvePrompt: option.resolvePrompt };
}

function listLegal(state: MatchState): LegalCommandDescriptor[] {
  const legal =
    state.status === "setup"
      ? [...getLegalCommands(state, "south"), ...getLegalCommands(state, "north")]
      : getLegalCommands(state);
  return legal.filter((descriptor) => descriptor.type !== "concede");
}

function actionIdFor(descriptor: LegalCommandDescriptor, index: number): string {
  const parts = [
    descriptor.type,
    descriptor.seat,
    descriptor.sourceId ?? "",
    (descriptor.targetIds ?? []).join(","),
    descriptor.promptId ?? "",
    String(index),
  ];
  return parts.join(":");
}

function actionsFromLegal(legal: readonly LegalCommandDescriptor[]): PlayAction[] {
  return legal.map((descriptor, index) => ({
    actionId: actionIdFor(descriptor, index),
    type: descriptor.type,
    actorId: descriptor.seat,
    summary: descriptor.label || descriptor.type,
  }));
}

function characterCount(player: MatchState["players"][MatchSeat]): number {
  return player.characterArea.filter((slot) => slot !== null).length;
}

function compactPlayerView(seat: MatchSeat, state: MatchState): Record<string, unknown> {
  const player = state.players[seat];
  return {
    seat,
    life: player.life.length,
    hand: player.hand.length,
    deck: player.deck.length,
    trash: player.trash.length,
    character: characterCount(player),
    stage: player.stageArea ? 1 : 0,
    donDeck: player.donDeckCount,
    activeDon: player.activeDon,
    restedDon: player.restedDon,
  };
}

function compactState(state: MatchState): Record<string, unknown> {
  return {
    status: state.status,
    turn: state.turnNumber,
    phase: state.phase,
    activeSeat: state.activeSeat,
    winner: state.winner,
    pendingPrompts: state.promptQueue
      .filter((p) => p.status === "pending")
      .map((p) => ({ id: p.id, kind: p.kind, seat: p.seat, choiceKind: p.choiceKind })),
    south: compactPlayerView("south", state),
    north: compactPlayerView("north", state),
  };
}

function toActFrom(state: MatchState, legal: readonly LegalCommandDescriptor[]): string[] {
  if (state.status === "finished") return [];
  const seats = new Set<string>();
  for (const prompt of state.promptQueue) {
    if (prompt.status === "pending" && prompt.seat) seats.add(String(prompt.seat));
  }
  for (const command of legal) seats.add(command.seat);
  return [...seats];
}

function resolvePromptWithAgents(
  state: MatchState,
  prompt: PromptState,
  agents: Record<MatchSeat, OnePieceBotAgent>,
  context: OnePieceBotDecisionContext,
): EngineCommand | null {
  if (prompt.kind !== "judge" && (prompt.seat === "north" || prompt.seat === "south")) {
    const resolved = agents[prompt.seat].resolvePrompt?.(state, prompt, context);
    if (resolved) return resolved;
  }
  return resolveBotPromptCommand(state, prompt);
}

function semanticFingerprint(state: MatchState): string {
  // Exclude append-only / monotonic bookkeeping so equivalent gameplay states
  // can still collide for the repeated-state detector (command loops).
  return JSON.stringify(state, (key, value) =>
    key === "idCounter" ||
    key === "commandHistory" ||
    key === "logHistory" ||
    key === "eventHistory" ||
    key === "eventSequence"
      ? undefined
      : value,
  );
}

class OnePiecePlaySession implements PlaySession {
  readonly game = GAME;
  readonly seed: string;
  private state: MatchState;
  private step = 0;
  private actionCount = 0;
  private readonly maxSteps: number;
  private readonly agents: Record<MatchSeat, OnePieceBotAgent>;
  private readonly decisionContext: OnePieceBotDecisionContext;
  private termination: PlayTerminationReason | undefined;
  private readonly recentFingerprints: string[] = [];
  private readonly maxRepeatWindow = 40;
  private readonly p1DeckId?: string;
  private readonly p2DeckId?: string;

  constructor(options: CreatePlaySessionOptions = {}) {
    this.seed = options.seed ?? `play-cli-${Date.now()}`;
    this.maxSteps = options.maxSteps ?? DEFAULT_MAX_STEPS;
    this.agents = {
      south: botAgentFor(options.p1Strategy),
      north: botAgentFor(options.p2Strategy),
    };
    this.decisionContext = { random: createSeededRandom(this.seed) };
    const p1Deck = loadDeckFile(options.p1Deck, "p1");
    const p2Deck = loadDeckFile(options.p2Deck, "p2");
    this.p1DeckId = p1Deck?.id ?? options.p1Deck;
    this.p2DeckId = p2Deck?.id ?? options.p2Deck;
    this.state = createMatch(buildMatchConfig(this.seed, p1Deck, p2Deck));
  }

  observe(): PlayObservation {
    const legal = listLegal(this.state);
    const ended = this.hasEnded();
    return {
      game: GAME,
      step: this.step,
      stateId: this.state.idCounter,
      turn: this.state.turnNumber,
      phase: this.state.phase,
      status: this.state.status,
      toAct: toActFrom(this.state, legal),
      gameEnded: ended,
      winner: this.state.winner,
      termination: this.termination ?? (ended ? "rules-win" : undefined),
      state: compactState(this.state),
      actions: actionsFromLegal(legal),
    };
  }

  hasEnded(): boolean {
    return this.state.status === "finished" || this.termination !== undefined;
  }

  result(): PlayEndResult | undefined {
    if (!this.hasEnded()) return undefined;
    return this.buildResult(this.termination ?? "rules-win");
  }

  autoStep(): AutoStepResult {
    if (this.hasEnded()) {
      const observation = this.observe();
      return {
        accepted: false,
        ended: true,
        observation,
        result: this.result(),
      };
    }

    if (this.step >= this.maxSteps) {
      this.termination = "max-actions";
      const observation = this.observe();
      return { accepted: false, ended: true, observation, result: this.result() };
    }

    const fingerprint = semanticFingerprint(this.state);
    this.recentFingerprints.push(fingerprint);
    if (this.recentFingerprints.length > this.maxRepeatWindow) {
      this.recentFingerprints.shift();
    }
    if (this.recentFingerprints.filter((f) => f === fingerprint).length >= 8) {
      this.termination = "repeated-state";
      const observation = this.observe();
      return { accepted: false, ended: true, observation, result: this.result() };
    }

    const pending = this.state.promptQueue.find((p) => p.status === "pending");
    if (pending) {
      const command = resolvePromptWithAgents(
        this.state,
        pending,
        this.agents,
        this.decisionContext,
      );
      if (!command) {
        this.termination = "unsupported-prompt";
        const observation = this.observe();
        return { accepted: false, ended: true, observation, result: this.result() };
      }
      return this.apply(command);
    }

    const legal = listLegal(this.state);
    const setupActor = legal
      .map((descriptor) => descriptor.seat)
      .find((seat): seat is MatchSeat => seat === "south" || seat === "north");
    const activeSeat =
      this.state.status === "setup" && setupActor ? setupActor : this.state.activeSeat;
    const myLegal = legal.filter((c) => c.seat === activeSeat);
    if (myLegal.length === 0) {
      this.termination = "unsupported-prompt";
      const observation = this.observe();
      return { accepted: false, ended: true, observation, result: this.result() };
    }

    const chosen = this.agents[activeSeat].choose(
      this.state,
      activeSeat,
      myLegal,
      this.decisionContext,
    );
    if (!chosen) {
      const endTurn = myLegal.find((c) => c.type === "endTurn");
      if (endTurn) {
        return this.apply({ type: "endTurn", seat: activeSeat });
      }
      this.termination = "unsupported-prompt";
      const observation = this.observe();
      return { accepted: false, ended: true, observation, result: this.result() };
    }

    return this.apply(chosen);
  }

  runToEnd(): PlayEndResult {
    while (!this.hasEnded()) {
      this.autoStep();
    }
    return this.result()!;
  }

  private apply(command: EngineCommand): AutoStepResult {
    const result = applyCommand(this.state, command);
    this.step += 1;
    this.actionCount += 1;
    if (!result.accepted) {
      this.termination = "illegal-command";
      // Keep pre-reject state for observation, but mark terminal.
      const observation = this.observe();
      return { accepted: false, ended: true, observation, result: this.result() };
    }
    this.state = result.state;
    if (this.state.status === "finished") {
      this.termination = "rules-win";
    }
    const observation = this.observe();
    return {
      accepted: true,
      ended: this.hasEnded(),
      observation,
      result: this.result(),
    };
  }

  private buildResult(termination: PlayTerminationReason): PlayEndResult {
    return {
      game: GAME,
      seed: this.seed,
      winner: this.state.winner,
      termination,
      turnCount: this.state.turnNumber,
      actionCount: this.actionCount,
      step: this.step,
      p1DeckId: this.p1DeckId,
      p2DeckId: this.p2DeckId,
    };
  }
}

export const onePiecePlayAdapter: PlayAdapter = {
  game: GAME,

  listStrategies() {
    return ONE_PIECE_AUTOMATED_ACTION_STRATEGIES.map((entry) => entry.id);
  },

  doctor(): PlayDoctorResult {
    const checks: PlayDoctorResult["checks"][number][] = [];
    try {
      const defaultStrategy = getSafeOnePieceAutomatedActionStrategyOption();
      checks.push({
        name: "default-strategy",
        ok: true,
        detail: defaultStrategy.id,
      });
    } catch (error) {
      checks.push({
        name: "default-strategy",
        ok: false,
        detail: error instanceof Error ? error.message : String(error),
      });
    }

    try {
      const session = new OnePiecePlaySession({
        seed: "play-cli-doctor",
        maxSteps: 5,
        p1Strategy: "first-legal",
        p2Strategy: "first-legal",
      });
      const obs = session.observe();
      const step = session.autoStep();
      checks.push({
        name: "create-observe-autostep",
        ok: obs.game === GAME && step.accepted,
        detail: `step=${step.observation.step} actions=${obs.actions.length} accepted=${step.accepted}`,
      });
    } catch (error) {
      checks.push({
        name: "create-observe-autostep",
        ok: false,
        detail: error instanceof Error ? error.message : String(error),
      });
    }

    try {
      const known = getOnePieceAutomatedActionStrategyOption("first-legal");
      checks.push({
        name: "strategy-registry",
        ok: known !== undefined,
        detail: known?.id ?? "missing first-legal",
      });
    } catch (error) {
      checks.push({
        name: "strategy-registry",
        ok: false,
        detail: error instanceof Error ? error.message : String(error),
      });
    }

    return {
      game: GAME,
      ok: checks.every((c) => c.ok),
      checks,
    };
  },

  createSession(options: CreatePlaySessionOptions = {}): PlaySession {
    return new OnePiecePlaySession(options);
  },
};
