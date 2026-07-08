import type { JsonPatch, ReplayStep } from "@tcg/game-page-contract";

import type { GundamReplayData } from "./fetchReplay.ts";

export class GundamReplayOrchestrator {
  readonly gameId: string;
  readonly matchId: string;
  readonly replay: GundamReplayData;

  readonly #states: readonly Record<string, unknown>[];
  readonly #turnNumbers: readonly number[];
  #currentStep = 0;
  #isPlaying = false;
  #speedMs = 800;
  #timer: ReturnType<typeof setTimeout> | null = null;
  #listeners = new Set<() => void>();

  constructor(replay: GundamReplayData) {
    if (replay.gameType !== "gundam") {
      throw new Error(`Replay is for ${replay.gameType}, not Gundam.`);
    }
    this.gameId = replay.gameId;
    this.matchId = replay.matchId;
    this.replay = replay;

    const states: Record<string, unknown>[] = [parseReplayState(replay.initialState)];
    const turns: number[] = [readTurnNumber(states[0])];
    let currentState: unknown = states[0];

    replay.steps.forEach((step, stepIndex) => {
      currentState = applyReplayJsonPatches(currentState, step.patches, {
        gameId: replay.gameId,
        matchId: replay.matchId,
        stepIndex,
        acceptedMove: step.acceptedMove,
      });
      const state = parseReplayState(currentState);
      states.push(state);
      turns.push(readTurnNumber(state));
    });

    this.#states = states;
    this.#turnNumbers = turns;
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

  get isAtEnd(): boolean {
    return this.#currentStep >= this.#states.length - 1;
  }

  get currentState(): Record<string, unknown> {
    return this.#states[this.#currentStep]!;
  }

  stateAt(step: number): Record<string, unknown> {
    const clamped = Math.max(0, Math.min(step, this.#states.length - 1));
    return this.#states[clamped]!;
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

  togglePlay(): void {
    if (this.#isPlaying) this.pause();
    else this.play();
  }

  play(): void {
    if (this.#isPlaying) return;
    if (this.isAtEnd) this.goToStep(0);
    this.#isPlaying = true;
    this.#notify();
    this.#scheduleNext();
  }

  pause(): void {
    this.#isPlaying = false;
    this.#clearTimer();
    this.#notify();
  }

  dispose(): void {
    this.pause();
    this.#listeners.clear();
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
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = null;
  }

  #notify(): void {
    for (const listener of this.#listeners) listener();
  }
}

interface ReplayPatchContext {
  readonly gameId: string;
  readonly matchId: string;
  readonly stepIndex: number;
  readonly acceptedMove: ReplayStep["acceptedMove"];
}

interface JsonPatchOperation {
  readonly op: "add" | "remove" | "replace";
  readonly path: string | readonly (string | number)[];
  readonly value?: unknown;
}

export function applyReplayJsonPatches(
  root: unknown,
  patches: JsonPatch,
  context: ReplayPatchContext,
): unknown {
  const next = structuredClone(root);
  patches.forEach((patch, patchIndex) => {
    if (!isJsonPatchOperation(patch)) {
      // eslint-disable-next-line no-console
      console.warn("[GundamReplay] Ignoring unsupported replay patch", {
        ...context,
        patchIndex,
        patch,
      });
      return;
    }
    applyJsonPatch(next, patch);
  });
  return next;
}

function applyJsonPatch(root: unknown, patch: JsonPatchOperation): void {
  const segments = parsePatchPath(patch.path);
  if (segments.length === 0) throw new Error("Replay patch cannot replace the root state.");
  const key = segments[segments.length - 1]!;
  const parent = resolvePatchParent(root, segments.slice(0, -1));

  if (Array.isArray(parent)) {
    if (key === "length") {
      if (patch.op !== "replace" || typeof patch.value !== "number") {
        throw new Error(`Replay patch array length is invalid at ${segments.join("/")}`);
      }
      parent.length = patch.value;
      return;
    }
    const index = key === "-" ? parent.length : Number(key);
    if (!Number.isInteger(index)) throw new Error(`Replay patch array path is invalid: ${key}`);
    if (patch.op === "remove") parent.splice(index, 1);
    else if (patch.op === "add") parent.splice(index, 0, patch.value);
    else parent[index] = patch.value;
    return;
  }

  if (!isRecord(parent)) throw new Error(`Replay patch parent is invalid: ${segments.join("/")}`);
  if (patch.op === "remove") delete parent[key];
  else parent[key] = patch.value;
}

function resolvePatchParent(root: unknown, segments: readonly string[]): unknown {
  let cursor = root;
  for (const segment of segments) {
    if (Array.isArray(cursor)) cursor = cursor[Number(segment)];
    else if (isRecord(cursor)) cursor = cursor[segment];
    else throw new Error(`Replay patch path is invalid: ${segments.join("/")}`);
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

function parseReplayState(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try {
      return parseReplayState(JSON.parse(value) as unknown);
    } catch {
      throw new Error("Replay initial state was not valid JSON.");
    }
  }
  if (isRecord(value) && "G" in value && "ctx" in value) return value;
  if (isRecord(value) && "state" in value) return parseReplayState(value.state);
  if (isRecord(value) && "engineSnapshot" in value) return parseReplayState(value.engineSnapshot);
  throw new Error("Replay did not contain a Gundam match state.");
}

function readTurnNumber(state: Record<string, unknown>): number {
  const ctx = state.ctx;
  if (!isRecord(ctx)) return 0;
  const turn = ctx.turnNumber;
  return typeof turn === "number" ? turn : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
