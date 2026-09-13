import { replayStepPosition } from "@tcg/game-page-contract";
import { ReplayPlaybackV1Schema, type ReplayPlaybackV1 } from "@tcg/game-page-contract";
import { materializeReplayStateAtCursor } from "@tcg/game-page-contract/replay-materializer";

export { applyReplayPatch } from "@tcg/game-page-contract/replay-materializer";

export async function fetchReplayPlayback(
  url: string,
  fetcher: typeof fetch = fetch,
): Promise<ReplayPlaybackV1> {
  const response = await fetcher(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch replay (${response.status}).`);
  return ReplayPlaybackV1Schema.parse(await response.json());
}

export const REPLAY_MOVE_INTERVAL_MS = 800;

export interface ReplayPlaybackSnapshot {
  readonly cursor: number;
  readonly totalSteps: number;
  readonly state: unknown;
  readonly isPlaying: boolean;
  readonly speed: number;
}

/** Framework-neutral cursor, checkpoint, patch, and playback owner. */
export class ReplayPlaybackController {
  readonly playback: ReplayPlaybackV1;
  readonly #checkpointEvery: number;
  readonly #checkpoints = new Map<number, unknown>();
  readonly #listeners = new Set<(snapshot: ReplayPlaybackSnapshot) => void>();
  #cursor = 0;
  #state: unknown;
  #playing = false;
  #speed = 1;
  #timer: ReturnType<typeof setTimeout> | null = null;

  constructor(playback: ReplayPlaybackV1, options?: { checkpointEvery?: number }) {
    this.playback = ReplayPlaybackV1Schema.parse(playback);
    this.#checkpointEvery = Math.max(1, options?.checkpointEvery ?? 25);
    this.#state = structuredClone(this.playback.replay.initialState);
    this.#checkpoints.set(0, structuredClone(this.#state));
    for (const checkpoint of this.playback.replay.checkpoints) {
      if (checkpoint.cursor <= this.playback.replay.steps.length) {
        this.#checkpoints.set(checkpoint.cursor, structuredClone(checkpoint.state));
      }
    }
  }

  get snapshot(): ReplayPlaybackSnapshot {
    return {
      cursor: this.#cursor,
      totalSteps: this.playback.replay.steps.length,
      state: this.#state,
      isPlaying: this.#playing,
      speed: this.#speed,
    };
  }

  subscribe(listener: (snapshot: ReplayPlaybackSnapshot) => void): () => void {
    this.#listeners.add(listener);
    listener(this.snapshot);
    return () => this.#listeners.delete(listener);
  }

  seek(cursor: number): void {
    const target = Math.max(0, Math.min(Math.trunc(cursor), this.playback.replay.steps.length));
    const state = materializeReplayStateAtCursor(
      this.playback.replay,
      target,
      Array.from(this.#checkpoints, ([checkpointCursor, checkpointState]) => ({
        cursor: checkpointCursor,
        state: checkpointState,
      })),
    );
    if (target % this.#checkpointEvery === 0) {
      this.#checkpoints.set(target, structuredClone(state));
    }
    this.#cursor = target;
    this.#state = state;
    this.#notify();
  }

  cursorForStateVersion(stateVersion: number): number {
    const target = Math.trunc(stateVersion);
    const exactIndex = this.playback.replay.steps.findIndex(
      (step) => replayStepPosition(step).stateVersion === target,
    );
    if (exactIndex >= 0) return exactIndex + 1;

    let nearestPriorCursor = 0;
    let nearestPriorVersion = Number.NEGATIVE_INFINITY;
    for (const [index, step] of this.playback.replay.steps.entries()) {
      const version = replayStepPosition(step).stateVersion;
      if (version <= target && version > nearestPriorVersion) {
        nearestPriorCursor = index + 1;
        nearestPriorVersion = version;
      }
    }
    return nearestPriorCursor;
  }

  seekStateVersion(stateVersion: number): void {
    this.seek(this.cursorForStateVersion(stateVersion));
  }

  next(): void {
    this.seek(this.#cursor + 1);
  }

  previous(): void {
    this.seek(this.#cursor - 1);
  }

  setSpeed(speed: number): void {
    if (!Number.isFinite(speed) || speed <= 0) throw new Error("Replay speed must be positive.");
    this.#speed = speed;
    if (this.#playing) this.#schedule();
    this.#notify();
  }

  play(): void {
    if (this.#playing) return;
    if (this.#cursor >= this.playback.replay.steps.length) this.seek(0);
    this.#playing = true;
    this.#notify();
    this.#schedule();
  }

  pause(): void {
    this.#playing = false;
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = null;
    this.#notify();
  }

  dispose(): void {
    this.pause();
    this.#listeners.clear();
  }

  #schedule(): void {
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = setTimeout(() => {
      this.#timer = null;
      if (!this.#playing) return;
      if (this.#cursor >= this.playback.replay.steps.length) {
        this.pause();
        return;
      }
      this.next();
      this.#schedule();
    }, REPLAY_MOVE_INTERVAL_MS / this.#speed);
  }

  #notify(): void {
    const snapshot = this.snapshot;
    for (const listener of this.#listeners) listener(snapshot);
  }
}
