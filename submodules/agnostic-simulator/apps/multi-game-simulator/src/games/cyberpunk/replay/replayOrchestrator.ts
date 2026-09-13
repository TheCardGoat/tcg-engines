import { replayStepPosition } from "@tcg/game-page-contract";
import type { MatchState, MoveLog } from "@tcg/cyberpunk-engine";
import type { ReplayPlaybackV1 } from "@tcg/game-page-contract";
import { ReplayPlaybackController } from "@tcg/simulator-runtime";

import {
  normalizeRemoteMoveLog,
  projectLiveStateForSimulator,
  projectLiveValueForSimulator,
} from "../engine/live/matchContext";
import {
  isFilteredMatchView,
  isMatchState,
  viewerProjectionToMatchState,
} from "../engine/live/liveState";
import type { PersistedReplayMetadata, ReplayPlayerInfo } from "./fetchReplay";

/** Cyberpunk renderer binding over the shared replay cursor and patch controller. */
export class CyberpunkReplayOrchestrator {
  readonly gameId: string;
  readonly matchId: string;
  readonly playerIds: [string, string];
  readonly metadata: PersistedReplayMetadata;

  readonly #controller: ReplayPlaybackController;
  readonly #turnNumbers: readonly number[];
  readonly #moveLogsByStep: readonly MoveLog[][];

  constructor(playback: ReplayPlaybackV1) {
    const replay = playback.replay;
    if (replay.gameType !== "cyberpunk") {
      throw new Error(`Replay is for ${replay.gameType}, not Cyberpunk.`);
    }
    const playerIds = replay.participants.map((participant) => participant.id);
    if (playerIds.length < 2) throw new Error("Replay is missing player participants.");

    this.gameId = replay.gameId;
    this.matchId = replay.matchId;
    this.playerIds = [playerIds[0]!, playerIds[1]!];
    this.metadata = {
      ...replay.metadata,
      completedAt: replay.metadata.completedAt ?? playback.publishedAt,
      authority: playback.trust === "server_authoritative" ? "server" : "client",
      players: [toPlayer(replay.participants[0]!), toPlayer(replay.participants[1]!)],
    };
    this.#controller = new ReplayPlaybackController(playback);
    this.#turnNumbers = [0, ...replay.steps.map((step) => replayStepPosition(step).turnNumber)];
    this.#moveLogsByStep = this.#buildMoveLogs();
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
    return this.#turnNumbers[this.currentStep] ?? 0;
  }

  get totalTurns(): number {
    return Math.max(0, ...this.#turnNumbers);
  }

  get isPlaying(): boolean {
    return this.#controller.snapshot.isPlaying;
  }

  get hasPatchData(): boolean {
    return this.#controller.snapshot.totalSteps > 0;
  }

  get isAtEnd(): boolean {
    return this.currentStep >= this.totalSteps - 1;
  }

  get currentState(): MatchState {
    return projectLiveStateForSimulator(
      unwrapReplayState(this.#controller.snapshot.state, this.matchId),
    );
  }

  get currentMoveLogs(): MoveLog[] {
    return this.#moveLogsByStep[this.currentStep] ?? [];
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
    const currentTurn = this.currentTurn;
    const next = this.#turnNumbers.findIndex(
      (turn, cursor) => cursor > this.currentStep && turn > currentTurn,
    );
    this.goToStep(next === -1 ? this.totalSteps - 1 : next);
  }

  prevTurn(): void {
    const currentTurn = this.currentTurn;
    const firstOfCurrent = this.#turnNumbers.indexOf(currentTurn);
    if (firstOfCurrent !== -1 && this.currentStep > firstOfCurrent) {
      this.goToStep(firstOfCurrent);
      return;
    }
    const previousTurn = this.#turnNumbers[this.currentStep - 1] ?? 0;
    this.goToStep(Math.max(0, this.#turnNumbers.indexOf(previousTurn)));
  }

  play(): void {
    this.#controller.play();
  }

  pause(): void {
    this.#controller.pause();
  }

  togglePlay(): void {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  setSpeed(ms: number): void {
    this.#controller.setSpeed(800 / ms);
  }

  dispose(): void {
    this.#controller.dispose();
  }

  #buildMoveLogs(): MoveLog[][] {
    const accumulated: MoveLog[] = [];
    const result: MoveLog[][] = [[]];
    for (let cursor = 1; cursor < this.totalSteps; cursor += 1) {
      this.#controller.seek(cursor);
      const state = unwrapReplayState(this.#controller.snapshot.state, this.matchId);
      for (const entry of this.#controller.playback.replay.steps[cursor - 1]?.logs ?? []) {
        const log = normalizePersistedReplayLog(entry);
        if (log) accumulated.push(projectLiveValueForSimulator(log, state));
      }
      result.push(accumulated.slice());
    }
    this.#controller.seek(0);
    return result;
  }
}

function toPlayer(participant: { id: string; displayName: string }): ReplayPlayerInfo {
  return { id: participant.id, displayName: participant.displayName, username: null };
}

function normalizePersistedReplayLog(log: unknown): MoveLog | null {
  const normalized = normalizeRemoteMoveLog(log);
  if (normalized) return normalized;
  if (isRecord(log) && "log" in log) return normalizeRemoteMoveLog(log.log);
  return null;
}

function unwrapReplayState(value: unknown, matchId: string, depth = 0): MatchState {
  if (depth > 5 || !isRecord(value)) {
    throw new Error("Replay state did not contain a Cyberpunk viewer projection.");
  }
  if (isMatchState(value)) return value;
  if (isFilteredMatchView(value)) return viewerProjectionToMatchState(value, matchId);
  if ("state" in value) return unwrapReplayState(value.state, matchId, depth + 1);
  if ("engineSnapshot" in value) {
    return unwrapReplayState(value.engineSnapshot, matchId, depth + 1);
  }
  throw new Error("Replay state did not contain a Cyberpunk viewer projection.");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
