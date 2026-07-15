/**
 * Replay Orchestrator
 *
 * Reconstructs match states from a persisted replay by applying patches
 * to the initial state. Supports step-through viewing and move log display.
 */

import { getLorcanaCardCatalogSync } from "@tcg/lorcana-cards/cards/sync";
import {
  createLorcanaClient,
  createPlayerId,
  type CardsMaps,
  type LorcanaClient,
  type LorcanaMatchState,
} from "@tcg/lorcana-engine";
import { apply, type Patch } from "mutative";
import type { LorcanaPlayerSide, MoveLogEntrySnapshot } from "../simulator/model/contracts.js";
import {
  createSpectatorHistoryEntries,
  extractMatchState,
} from "../spectator/spectator-match-orchestrator.svelte.js";
import type {
  PersistedReplayData,
  PersistedReplayMetadata,
  PersistedReplayStep,
  ReplayChatMessage,
} from "./fetch-replay.js";

// ---------------------------------------------------------------------------
// State parsing
// ---------------------------------------------------------------------------

/**
 * Parse the initialState JSON string into a LorcanaMatchState.
 * Handles v2 format (state-only, no cardsMaps) and legacy formats.
 */
export function parseReplayInitialState(
  initialState: string,
  cardsMaps?: CardsMaps,
): { state: LorcanaMatchState; cardsMaps: CardsMaps } | null {
  try {
    const parsed = JSON.parse(initialState) as Record<string, unknown>;

    // v2 format: { state: LorcanaMatchState, historyLength } — cardsMaps is top-level on PersistedReplayData
    if (parsed.state && typeof parsed.state === "object" && cardsMaps) {
      return { state: parsed.state as LorcanaMatchState, cardsMaps };
    }

    // Legacy: EngineSnapshot format { state, cardsMaps, historyLength } — cardsMaps embedded
    if (
      parsed.state &&
      typeof parsed.state === "object" &&
      parsed.cardsMaps &&
      typeof parsed.cardsMaps === "object"
    ) {
      return {
        state: parsed.state as LorcanaMatchState,
        cardsMaps: parsed.cardsMaps as CardsMaps,
      };
    }

    // Client-authority format: { state: { engineSnapshot: { state, cardsMaps } } }
    if (parsed.state && typeof parsed.state === "object") {
      const extracted = extractMatchState(parsed.state);
      if (extracted) return extracted;
    }

    // Direct LorcanaMatchState (no wrapping) — fallback
    if ("ctx" in parsed) {
      return {
        state: parsed as unknown as LorcanaMatchState,
        cardsMaps: cardsMaps ?? ({} as CardsMaps),
      };
    }

    return null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

export class ReplayOrchestrator {
  readonly readModel = new ReplayReadModel();
  readonly #engine: LorcanaClient;
  readonly #cardsMaps: CardsMaps;
  readonly #playerIds: [string, string];
  /** Pre-computed states indexed by step (step 0 = initial state). */
  readonly #states: LorcanaMatchState[];
  /** Turn number per step (step 0 = 0 / pre-game). */
  readonly #turnNumbers: number[];
  readonly #chatMessages: ReplayChatMessage[];
  /** Step timestamps (index N = steps[N-1].acceptedMove.timestamp; index 0 = 0). */
  readonly #stepTimestamps: number[];
  readonly #metadata: PersistedReplayMetadata;
  readonly #steps: PersistedReplayStep[];

  #currentStep = $state(0);
  #isPlaying = $state(false);
  #speedMs = $state(800);
  #timer: ReturnType<typeof setTimeout> | null = null;

  constructor(replayData: PersistedReplayData) {
    // Use top-level cardsMaps (v2) — no longer buried inside initialState
    const topLevelCardsMaps = replayData.cardsMaps as CardsMaps | undefined;
    const parsed = parseReplayInitialState(replayData.initialState, topLevelCardsMaps);

    if (!parsed) {
      throw new Error("Failed to parse replay initial state");
    }

    const { state, cardsMaps } = parsed;
    this.#cardsMaps = cardsMaps;
    this.#playerIds = replayData.playerIds;
    this.#chatMessages = replayData.chatMessages ?? [];
    this.#stepTimestamps = [0, ...replayData.steps.map((s) => s.acceptedMove.timestamp)];
    this.#metadata = replayData.metadata;
    this.#steps = replayData.steps;

    const playerIdList =
      Object.keys(cardsMaps.owners ?? {}).length > 0
        ? Object.keys(cardsMaps.owners)
        : [...replayData.playerIds];

    const players = playerIdList.map((id) => ({ id }));

    this.#engine = createLorcanaClient({
      seed: state.ctx.random.seed,
      cardsMaps,
      cardCatalog: getLorcanaCardCatalogSync(),
      players,
      playerId: "replay-viewer",
      role: "spectator",
      matchID: state.ctx.matchID,
      gameID: state.ctx.gameID ?? replayData.gameId,
      goingFirst: createPlayerId(String(players[0]?.id ?? replayData.playerIds[0])),
    });

    // Reconstruct states by applying patches to the initial state
    this.#states = [state];
    this.#turnNumbers = [0];

    let currentState: unknown = state;
    for (const step of replayData.steps) {
      const turnNumber = step.acceptedMove.turnNumber;

      if (step.patches.length === 0) {
        this.#states.push(currentState as LorcanaMatchState);
        this.#turnNumbers.push(turnNumber);
        continue;
      }

      try {
        currentState = apply(currentState as object, step.patches as Patch[]);
        this.#states.push(currentState as LorcanaMatchState);
        this.#turnNumbers.push(turnNumber);
      } catch {
        break;
      }
    }

    // Strip time context — replay data does not capture per-move clock state,
    // so showing stale/frozen timers is misleading. Setting mode to "none"
    // causes the projection pipeline to omit all timer UI.
    for (let i = 0; i < this.#states.length; i++) {
      const s = this.#states[i]!;
      this.#states[i] = {
        ...s,
        ctx: { ...s.ctx, time: { mode: "none" as const, running: false, players: {} } },
      } as LorcanaMatchState;
    }

    // Build move log from step data — acceptedMove already has the shape spectator history expects
    const acceptedMoves = replayData.steps.map((step) => step.acceptedMove);

    const engineLogs = buildReplayEngineLogs(replayData.steps);

    const entries = createSpectatorHistoryEntries({
      acceptedMoves,
      engineLogs,
      engine: this.#engine,
      cardsMaps: this.#cardsMaps,
      resolveActorSide: (actorId) => this.#resolveActorSide(actorId),
    });

    this.readModel.setMoveLog(entries);
    this.readModel.setVisibleStep(0);

    // Load initial state into engine
    this.#engine.loadState(state);
  }

  /** Returns the pre-computed game state at a given step (0 = initial). */
  getStateAtStep(step: number): LorcanaMatchState | undefined {
    return this.#states[step];
  }

  get cardsMaps(): CardsMaps {
    return this.#cardsMaps;
  }

  get playerIds(): [string, string] {
    return this.#playerIds;
  }

  get metadata(): PersistedReplayMetadata {
    return this.#metadata;
  }

  get currentEngine(): LorcanaClient {
    return this.#engine;
  }

  get currentStep(): number {
    return this.#currentStep;
  }

  get totalSteps(): number {
    return this.#states.length;
  }

  get currentTurn(): number {
    return this.#turnNumbers[this.#currentStep] ?? 0;
  }

  get totalTurns(): number {
    return Math.max(0, ...this.#turnNumbers);
  }

  get isPlaying(): boolean {
    return this.#isPlaying;
  }

  get speedMs(): number {
    return this.#speedMs;
  }

  /** True when replay patches produced more than the initial state. */
  get hasPatchData(): boolean {
    return this.#states.length > 1;
  }

  /** True when the current step is the final step (game over). */
  get isAtEnd(): boolean {
    return this.#currentStep >= this.#states.length - 1;
  }

  /** Chat messages visible up to (and including) the current step's timestamp. */
  get chatMessages(): ReplayChatMessage[] {
    const cutoff = this.#stepTimestamps[this.#currentStep] ?? 0;
    return this.#chatMessages.filter((msg) => msg.timestamp <= cutoff);
  }

  goToStep(step: number): void {
    const clamped = Math.max(0, Math.min(step, this.#states.length - 1));
    if (clamped === this.#currentStep) return;
    this.#currentStep = clamped;
    const nextState = this.#states[clamped];
    if (nextState) {
      this.#engine.loadState(nextState);
      this.readModel.setVisibleStep(clamped);
      this.readModel.notify();
    }

    // Step 0 = initial state (no move); step N corresponds to steps[N-1]
    const stepData = clamped > 0 ? this.#steps[clamped - 1] : null;
    if (stepData) {
      console.group(`[Replay] Step ${clamped} — ${stepData.acceptedMove.moveId}`);
      console.log("Move:", stepData.acceptedMove);
      console.log("Logs:", stepData.logs);
      console.log("Patches (state diff):", stepData.patches);
      console.groupEnd();
    } else {
      console.log("[Replay] Step 0 — initial state (no move)");
    }
  }

  nextStep(): void {
    this.goToStep(this.#currentStep + 1);
  }

  prevStep(): void {
    this.goToStep(this.#currentStep - 1);
  }

  nextTurn(): void {
    const currentTurn = this.currentTurn;
    for (let i = this.#currentStep + 1; i < this.#turnNumbers.length; i++) {
      if ((this.#turnNumbers[i] ?? 0) > currentTurn) {
        this.goToStep(i);
        return;
      }
    }
    this.goToStep(this.#states.length - 1);
  }

  prevTurn(): void {
    const currentTurn = this.currentTurn;
    const firstOfCurrentTurn = this.#turnNumbers.indexOf(currentTurn);

    if (firstOfCurrentTurn !== -1 && this.#currentStep > firstOfCurrentTurn) {
      this.goToStep(firstOfCurrentTurn);
      return;
    }

    if (this.#currentStep === 0) return;
    const prevTurnNum = this.#turnNumbers[this.#currentStep - 1] ?? 0;
    const firstOfPrevTurn = this.#turnNumbers.indexOf(prevTurnNum);
    this.goToStep(firstOfPrevTurn === -1 ? 0 : firstOfPrevTurn);
  }

  play(): void {
    if (this.#isPlaying) return;
    if (this.#currentStep >= this.#states.length - 1) {
      this.goToStep(0);
    }
    this.#isPlaying = true;
    this.#scheduleNext();
  }

  pause(): void {
    this.#isPlaying = false;
    this.#clearTimer();
  }

  togglePlay(): void {
    if (this.#isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setSpeed(ms: number): void {
    this.#speedMs = ms;
  }

  dispose(): void {
    this.pause();
  }

  #scheduleNext(): void {
    this.#timer = setTimeout(() => {
      this.#timer = null;
      if (!this.#isPlaying) return;
      if (this.#currentStep >= this.#states.length - 1) {
        this.#isPlaying = false;
        return;
      }
      this.nextStep();
      this.#scheduleNext();
    }, this.#speedMs);
  }

  #clearTimer(): void {
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }

  #resolveActorSide(actorId: string): LorcanaPlayerSide | undefined {
    const [p1, p2] = this.#playerIds;
    if (actorId === p1) return "playerOne";
    if (actorId === p2) return "playerTwo";
    return undefined;
  }
}

type ReplayEngineLog = {
  stateVersion: number;
  log: unknown;
};

function buildReplayEngineLogs(steps: readonly PersistedReplayStep[]): ReplayEngineLog[] {
  const choiceLabelsByEffectId = new Map<string, readonly string[]>();
  const engineLogs: ReplayEngineLog[] = [];

  for (const step of steps) {
    for (const log of step.logs) {
      engineLogs.push({
        stateVersion: step.acceptedMove.stateVersion,
        log: enrichChoiceSelectionLog(log, step.acceptedMove.input, choiceLabelsByEffectId),
      });
    }

    captureChoiceLabelsFromPatches(step.patches, choiceLabelsByEffectId);
  }

  return engineLogs;
}

function enrichChoiceSelectionLog(
  log: unknown,
  input: unknown,
  choiceLabelsByEffectId: ReadonlyMap<string, readonly string[]>,
): unknown {
  if (!isRecord(log) || log.moveType !== "resolveEffect") {
    return log;
  }

  const effectId = readEffectId(input);
  if (!effectId) {
    return log;
  }

  const zeroBasedChoiceIndex = readChoiceIndex(input);
  const labels = choiceLabelsByEffectId.get(effectId);
  const choiceLabel =
    typeof zeroBasedChoiceIndex === "number" ? labels?.[zeroBasedChoiceIndex] : undefined;
  if (!choiceLabel) {
    return log;
  }

  const publicMessages = Array.isArray(log.public) ? log.public : null;
  if (!publicMessages) {
    return log;
  }

  let changed = false;
  const nextPublicMessages = publicMessages.map((message) => {
    if (!isRecord(message) || !isRecord(message.values)) {
      return message;
    }
    if (
      message.key !== "lorcana.effect.resolve.choiceSelection" &&
      message.key !== "lorcana.effect.resolve.choiceSelection.withReveal"
    ) {
      return message;
    }

    changed = true;
    return {
      ...message,
      values: {
        ...message.values,
        choiceLabel,
      },
    };
  });

  if (!changed) {
    return log;
  }

  return {
    ...log,
    public: nextPublicMessages,
  };
}

function captureChoiceLabelsFromPatches(
  patches: readonly unknown[],
  choiceLabelsByEffectId: Map<string, readonly string[]>,
): void {
  for (const patch of patches) {
    if (!isRecord(patch) || !("value" in patch)) {
      continue;
    }
    captureChoiceLabelsFromValue(patch.value, choiceLabelsByEffectId);
  }
}

function captureChoiceLabelsFromValue(
  value: unknown,
  choiceLabelsByEffectId: Map<string, readonly string[]>,
): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      captureChoiceLabelsFromValue(item, choiceLabelsByEffectId);
    }
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  const id = value.id;
  const labels = readPendingChoiceLabels(value);
  if (typeof id === "string" && labels.length > 0) {
    choiceLabelsByEffectId.set(id, labels);
  }
}

function readPendingChoiceLabels(value: Record<string, unknown>): readonly string[] {
  const selectionContext = value.selectionContext;
  if (isRecord(selectionContext) && Array.isArray(selectionContext.options)) {
    const labels = selectionContext.options
      .map((option) => (isRecord(option) && typeof option.label === "string" ? option.label : null))
      .filter((label): label is string => label !== null);
    if (labels.length > 0) {
      return labels;
    }
  }

  const effect = value.effect;
  if (isRecord(effect) && Array.isArray(effect.optionLabels)) {
    return effect.optionLabels.filter((label): label is string => typeof label === "string");
  }

  return [];
}

function readEffectId(input: unknown): string | null {
  const args = isRecord(input) && isRecord(input.args) ? input.args : null;
  return args && typeof args.effectId === "string" ? args.effectId : null;
}

function readChoiceIndex(input: unknown): number | null {
  const args = isRecord(input) && isRecord(input.args) ? input.args : null;
  const params = args && isRecord(args.params) ? args.params : null;
  return params && typeof params.choiceIndex === "number" ? params.choiceIndex : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// ---------------------------------------------------------------------------
// Read Model
// ---------------------------------------------------------------------------

class ReplayReadModel {
  #listeners = new Set<(stateID: number) => void>();
  #stateId = 0;
  #allEntries: MoveLogEntrySnapshot[] = [];
  /** Number of visible entries (step 0 = 0 entries, step N = N entries). */
  #visibleCount = 0;

  getMoveLog(limit = 50): MoveLogEntrySnapshot[] {
    const visible = this.#allEntries.slice(0, this.#visibleCount);
    return limit > 0 ? visible.slice(-limit) : visible;
  }

  subscribeStateUpdates(handler: (stateID: number) => void): () => void {
    this.#listeners.add(handler);
    return () => {
      this.#listeners.delete(handler);
    };
  }

  setMoveLog(entries: MoveLogEntrySnapshot[]): void {
    this.#allEntries = entries;
  }

  /** Update the number of visible log entries (matches replay step index). */
  setVisibleStep(step: number): void {
    this.#visibleCount = step;
  }

  notify(): void {
    this.#stateId += 1;
    for (const listener of this.#listeners) {
      listener(this.#stateId);
    }
  }
}
