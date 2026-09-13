import type { ReplayPlaybackV1 } from "@tcg/game-page-contract";
import type { GundamG, MatchState } from "@tcg/gundam-engine";
import { ReplayPlaybackController } from "@tcg/simulator-runtime";
import { readGundamPresentation, type GundamPresentation } from "@tcg/gundam-server-adapter";
import { parseGundamLiveProjection } from "../src/engine/live/liveProjection.ts";
import type { GundamReplayViewerState } from "../src/engine/live/liveState.ts";
import { displayTurn } from "../src/game/labels.ts";

/** Gundam renderer binding over the shared replay cursor and patch controller. */
export class GundamReplayOrchestrator {
  readonly gameId: string;
  readonly matchId: string;
  readonly presentation: GundamPresentation | undefined;

  readonly #controller: ReplayPlaybackController;
  readonly #turnNumbers: readonly number[];

  constructor(playback: ReplayPlaybackV1) {
    if (playback.replay.gameType !== "gundam") {
      throw new Error(`Replay is for ${playback.replay.gameType}, not Gundam.`);
    }
    this.gameId = playback.replay.gameId;
    this.matchId = playback.replay.matchId;
    this.presentation =
      readGundamPresentation(playback.resources) ??
      readGundamPresentation({ cardsMaps: (playback.replay as { cardsMaps?: unknown }).cardsMaps });
    this.#controller = new ReplayPlaybackController(playback);
    this.#turnNumbers = this.#buildTurnNumbers();
  }

  subscribe(listener: () => void): () => void {
    return this.#controller.subscribe(() => listener());
  }

  get currentStep(): number {
    return this.#controller.snapshot.cursor;
  }

  get totalSteps(): number {
    return this.#controller.snapshot.totalSteps + 1;
  }

  get currentTurn(): number {
    return displayTurn(this.#currentEngineTurn);
  }

  get totalTurns(): number {
    return displayTurn(Math.max(0, ...this.#turnNumbers));
  }

  get isPlaying(): boolean {
    return this.#controller.snapshot.isPlaying;
  }

  get isAtEnd(): boolean {
    return this.currentStep >= this.totalSteps - 1;
  }

  get currentState(): GundamReplayViewerState {
    return parseReplayState(this.#controller.snapshot.state);
  }

  stateAt(step: number): GundamReplayViewerState {
    const reader = new ReplayPlaybackController(this.#controller.playback);
    reader.seek(step);
    const state = parseReplayState(reader.snapshot.state);
    reader.dispose();
    return state;
  }

  goToStep(step: number): void {
    this.#controller.seek(step);
  }

  cursorForStateVersion(stateVersion: number): number {
    return this.#controller.cursorForStateVersion(stateVersion);
  }

  goToStateVersion(stateVersion: number): void {
    this.#controller.seekStateVersion(stateVersion);
  }

  nextStep(): void {
    this.#controller.next();
  }

  prevStep(): void {
    this.#controller.previous();
  }

  nextTurn(): void {
    const currentTurn = this.#currentEngineTurn;
    const next = this.#turnNumbers.findIndex(
      (turn, cursor) => cursor > this.currentStep && turn > currentTurn,
    );
    this.goToStep(next === -1 ? this.totalSteps - 1 : next);
  }

  prevTurn(): void {
    const currentTurn = this.#currentEngineTurn;
    const firstOfCurrent = this.#turnNumbers.indexOf(currentTurn);
    if (firstOfCurrent !== -1 && this.currentStep > firstOfCurrent) {
      this.goToStep(firstOfCurrent);
      return;
    }
    const previousTurn = this.#turnNumbers[this.currentStep - 1] ?? 0;
    this.goToStep(Math.max(0, this.#turnNumbers.indexOf(previousTurn)));
  }

  togglePlay(): void {
    if (this.isPlaying) this.#controller.pause();
    else this.#controller.play();
  }

  dispose(): void {
    this.#controller.dispose();
  }

  #buildTurnNumbers(): number[] {
    const turns: number[] = [];
    for (let cursor = 0; cursor < this.totalSteps; cursor += 1) {
      this.#controller.seek(cursor);
      turns.push(readTurnNumber(parseReplayState(this.#controller.snapshot.state)));
    }
    this.#controller.seek(0);
    return turns;
  }

  get #currentEngineTurn(): number {
    return this.#turnNumbers[this.currentStep] ?? 0;
  }
}

function parseReplayState(value: unknown): GundamReplayViewerState {
  if (typeof value === "string") {
    try {
      return parseReplayState(JSON.parse(value) as unknown);
    } catch {
      throw new Error("Replay state was not valid JSON.");
    }
  }
  const projection = parseGundamLiveProjection(value);
  if (projection) return projection;
  if (isGundamReplayState(value)) return value;
  if (isRecord(value) && "state" in value) return parseReplayState(value.state);
  if (isRecord(value) && "engineSnapshot" in value) return parseReplayState(value.engineSnapshot);
  throw new Error("Replay did not contain a valid Gundam engine snapshot.");
}

function readTurnNumber(state: GundamReplayViewerState): number {
  return "ctx" in state ? state.ctx.status.turn : state.status.turn;
}

function isGundamReplayState(value: unknown): value is MatchState<GundamG> {
  if (!isRecord(value) || !isRecord(value.G) || !isRecord(value.ctx)) return false;
  const { ctx } = value;
  return (
    typeof ctx.protocolVersion === "string" &&
    typeof ctx.matchID === "string" &&
    typeof ctx.gameID === "string" &&
    typeof ctx.rulesetHash === "string" &&
    typeof ctx._stateID === "number" &&
    Array.isArray(ctx.playerIds) &&
    ctx.playerIds.every((playerId) => typeof playerId === "string") &&
    isZoneRuntimeState(ctx.zones) &&
    isRecord(ctx.status) &&
    typeof ctx.status.turn === "number" &&
    typeof ctx.status.activePlayer === "string" &&
    typeof ctx.status.gameEnded === "boolean" &&
    Array.isArray(ctx.status.pendingDecision) &&
    isRecord(ctx.time) &&
    isRecord(ctx.random)
  );
}

function isZoneRuntimeState(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const publicZones = value.public;
  const privateZones = value.private;
  const reveals = value.reveals;
  return (
    isRecord(publicZones) &&
    isRecord(publicZones.zoneSummaries) &&
    isRecord(privateZones) &&
    isRecord(privateZones.zoneCards) &&
    isRecord(privateZones.cardIndex) &&
    isRecord(privateZones.cardMeta) &&
    isRecord(reveals) &&
    isRecord(reveals.active) &&
    typeof reveals.nextId === "number"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
