import type { MatchState, MoveLog } from "@tcg/cyberpunk-engine";
import {
  normalizeRemoteMoveLog,
  projectLiveStateForSimulator,
  projectLiveValueForSimulator,
} from "../engine/live/matchContext";
import type {
  PersistedReplayData,
  PersistedReplayMetadata,
  PersistedReplayStep,
  ReplayMoveRecord,
} from "./fetchReplay";

interface ParsedInitialState {
  state: MatchState;
}

export class CyberpunkReplayOrchestrator {
  readonly gameId: string;
  readonly matchId: string;
  readonly playerIds: [string, string];
  readonly metadata: PersistedReplayMetadata;

  readonly #states: MatchState[];
  readonly #turnNumbers: number[];
  readonly #moveLogsByStep: MoveLog[][];

  #currentStep = 0;
  #isPlaying = false;
  #speedMs = 800;
  #timer: ReturnType<typeof setTimeout> | null = null;
  #listeners = new Set<() => void>();

  constructor(replayData: PersistedReplayData) {
    const parsed = parseReplayInitialState(replayData.initialState);
    this.gameId = replayData.gameId;
    this.matchId = replayData.matchId;
    this.playerIds = replayData.playerIds;
    this.metadata = replayData.metadata;

    const serverStates: MatchState[] = [parsed.state];
    this.#turnNumbers = [0];

    console.info("[CyberpunkReplay] Building replay states", {
      gameId: replayData.gameId,
      matchId: replayData.matchId,
      steps: replayData.steps.length,
    });

    let currentState: unknown = parsed.state;
    replayData.steps.forEach((step, stepIndex) => {
      if (Array.isArray(step.patches) && step.patches.length > 0) {
        currentState = applyReplayJsonPatches(currentState, step.patches, {
          gameId: replayData.gameId,
          matchId: replayData.matchId,
          stepIndex,
          acceptedMove: step.acceptedMove,
        });
      }
      serverStates.push(currentState as MatchState);
      this.#turnNumbers.push(step.acceptedMove.turnNumber);
    });

    this.#states = serverStates.map(projectLiveStateForSimulator);
    this.#moveLogsByStep = buildMoveLogsByStep(replayData.steps, serverStates);
  }

  subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
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

  get hasPatchData(): boolean {
    return this.#states.length > 1;
  }

  get isAtEnd(): boolean {
    return this.#currentStep >= this.#states.length - 1;
  }

  get currentState(): MatchState {
    return this.#states[this.#currentStep]!;
  }

  get currentMoveLogs(): MoveLog[] {
    return this.#moveLogsByStep[this.#currentStep] ?? [];
  }

  goToStep(step: number): void {
    const clamped = Math.max(0, Math.min(step, this.#states.length - 1));
    if (clamped === this.#currentStep) return;
    this.#currentStep = clamped;
    this.#notify();
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
    const prevTurn = this.#turnNumbers[this.#currentStep - 1] ?? 0;
    const firstOfPrevTurn = this.#turnNumbers.indexOf(prevTurn);
    this.goToStep(firstOfPrevTurn === -1 ? 0 : firstOfPrevTurn);
  }

  play(): void {
    if (this.#isPlaying) return;
    if (this.isAtEnd) {
      this.goToStep(0);
    }
    this.#isPlaying = true;
    this.#notify();
    this.#scheduleNext();
  }

  pause(): void {
    this.#isPlaying = false;
    this.#clearTimer();
    this.#notify();
  }

  togglePlay(): void {
    if (this.#isPlaying) this.pause();
    else this.play();
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
      if (this.isAtEnd) {
        this.#isPlaying = false;
        this.#notify();
        return;
      }
      this.nextStep();
      this.#scheduleNext();
    }, this.#speedMs);
  }

  #clearTimer(): void {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }

  #notify(): void {
    for (const listener of this.#listeners) {
      listener();
    }
  }
}

export function parseReplayInitialState(initialState: string): ParsedInitialState {
  const parsed = JSON.parse(initialState) as unknown;
  const state = unwrapMatchState(parsed);
  if (!state) {
    throw new Error("Replay initial state did not contain a Cyberpunk match state.");
  }
  return { state };
}

function buildMoveLogsByStep(
  steps: readonly PersistedReplayStep[],
  serverStates: readonly MatchState[],
): MoveLog[][] {
  const byStep: MoveLog[][] = [[]];
  const accumulated: MoveLog[] = [];
  steps.forEach((step, index) => {
    const state = serverStates[index + 1] ?? serverStates[index]!;
    for (const log of step.logs) {
      const moveLog = normalizePersistedReplayLog(log);
      if (!moveLog) continue;
      accumulated.push(projectLiveValueForSimulator(moveLog, state));
    }
    byStep.push(accumulated.slice());
  });
  return byStep;
}

function normalizePersistedReplayLog(log: unknown): MoveLog | null {
  const normalized = normalizeRemoteMoveLog(log);
  if (normalized) {
    return normalized;
  }
  if (isRecord(log) && "log" in log) {
    return normalizeRemoteMoveLog(log.log);
  }
  return null;
}

function unwrapMatchState(value: unknown, depth = 0): MatchState | null {
  if (depth > 5 || !isRecord(value)) return null;
  if ("G" in value && "ctx" in value) return value as unknown as MatchState;
  if ("state" in value) {
    return unwrapMatchState(value.state, depth + 1);
  }
  if ("engineSnapshot" in value) {
    return unwrapMatchState(value.engineSnapshot, depth + 1);
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

interface JsonPatchOperation {
  op: "add" | "remove" | "replace";
  path: string | readonly (string | number)[];
  value?: unknown;
}

interface ReplayPatchContext {
  gameId: string;
  matchId: string;
  stepIndex: number;
  acceptedMove: ReplayMoveRecord;
}

export function applyReplayJsonPatches(
  root: unknown,
  patches: readonly unknown[],
  context: ReplayPatchContext,
): unknown {
  const next = structuredClone(root);
  patches.forEach((patch, patchIndex) => {
    if (!isJsonPatchOperation(patch)) {
      console.warn("[CyberpunkReplay] Ignoring invalid replay patch", {
        ...context,
        patchIndex,
        patch,
      });
      return;
    }
    try {
      applyJsonPatch(next, patch);
    } catch (error) {
      console.error("[CyberpunkReplay] Failed to apply replay patch", {
        ...context,
        patchIndex,
        patch,
        path: patch.path,
        parsedPath: parsePatchPath(patch.path),
        error,
      });
      throw error;
    }
  });
  return next;
}

function applyJsonPatch(root: unknown, patch: JsonPatchOperation): void {
  const segments = parsePatchPath(patch.path);
  if (segments.length === 0) {
    throw new Error("Replay patch cannot replace the root state.");
  }
  const key = segments[segments.length - 1]!;
  const parent = resolvePatchParent(root, segments.slice(0, -1));

  if (Array.isArray(parent)) {
    if (key === "length") {
      applyArrayLengthPatch(parent, patch, segments);
      return;
    }
    const index = key === "-" ? parent.length : Number(key);
    if (!Number.isInteger(index)) {
      throw new Error(`Replay patch array path is invalid: ${String(key)}`);
    }
    if (patch.op === "remove") {
      parent.splice(index, 1);
    } else if (patch.op === "add") {
      parent.splice(index, 0, patch.value);
    } else {
      parent[index] = patch.value;
    }
    return;
  }

  if (!isRecord(parent)) {
    throw new Error(`Replay patch parent is not an object at ${segments.join("/")}`);
  }
  if (patch.op === "remove") {
    delete parent[key];
  } else {
    parent[key] = patch.value;
  }
}

function applyArrayLengthPatch(
  target: unknown[],
  patch: JsonPatchOperation,
  segments: readonly string[],
): void {
  if (patch.op !== "replace" || typeof patch.value !== "number" || !Number.isInteger(patch.value)) {
    throw new Error(`Replay patch array length is invalid at ${segments.join("/")}`);
  }
  if (patch.value < 0) {
    throw new Error(`Replay patch array length is negative at ${segments.join("/")}`);
  }

  console.debug("[CyberpunkReplay] Applying replay array length patch", {
    path: segments,
    previousLength: target.length,
    nextLength: patch.value,
  });
  target.length = patch.value;
}

function resolvePatchParent(root: unknown, segments: readonly string[]): unknown {
  let cursor = root;
  for (const segment of segments) {
    if (Array.isArray(cursor)) {
      cursor = cursor[Number(segment)];
    } else if (isRecord(cursor)) {
      cursor = cursor[segment];
    } else {
      throw new Error(`Replay patch path is invalid: ${segments.join("/")}`);
    }
  }
  return cursor;
}

function parsePatchPath(path: JsonPatchOperation["path"]): string[] {
  if (typeof path === "string") {
    return path
      .split("/")
      .slice(1)
      .map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"));
  }
  return path.map(String);
}

function isJsonPatchOperation(value: unknown): value is JsonPatchOperation {
  if (!isRecord(value)) return false;
  return (
    (value.op === "add" || value.op === "remove" || value.op === "replace") &&
    (typeof value.path === "string" || Array.isArray(value.path))
  );
}
