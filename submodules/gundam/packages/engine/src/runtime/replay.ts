/**
 * Replay engine — Record, replay, and export full game replays.
 */

import type { CommandEnvelope, CommandResult } from "../types/command.ts";
import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import { MatchRuntime } from "./match-runtime.ts";
import type { MatchStaticResources, Player } from "./static-resources.ts";
import { renderGundamLogTemplate } from "../gundam/i18n/render-log-template.ts";

// ── Data structures ─────────────────────────────────────────────────────────

export interface ReplayData {
  version: string;
  gameId: string;
  timestamp: number;
  seed: string;
  players: Player[];
  commands: ReplayCommand[];
  /** Snapshots at key points for fast seeking */
  snapshots: ReplaySnapshot[];
  metadata?: Record<string, unknown>;
}

export interface ReplayCommand {
  index: number;
  commandEnvelope: CommandEnvelope;
  playerId: PlayerId;
  timestamp: number;
}

export interface ReplaySnapshot {
  /** Command index this snapshot was taken at */
  atCommandIndex: number;
  state: MatchState;
}

/** Compact replay format — just seed + commands, no snapshots */
export interface CompactReplayData {
  version: string;
  gameId: string;
  timestamp: number;
  seed: string;
  players: Player[];
  commands: ReplayCommand[];
  metadata?: Record<string, unknown>;
}

// ── Constants ───────────────────────────────────────────────────────────────

const REPLAY_VERSION = "1.0.0";
const AUTO_SNAPSHOT_INTERVAL = 50;

// ── ReplayBuilder ───────────────────────────────────────────────────────────

/**
 * Records a game as it's played. Attach to a MatchRuntime to capture
 * every command and periodic state snapshots.
 */
export class ReplayBuilder {
  private gameId: string;
  private seed: string;
  private players: Player[];
  private commands: ReplayCommand[] = [];
  private snapshots: ReplaySnapshot[] = [];
  private metadata: Record<string, unknown> = {};
  private startTimestamp: number;
  private snapshotInterval: number;

  constructor(
    gameId: string,
    seed: string,
    players: Player[],
    options?: { snapshotInterval?: number; metadata?: Record<string, unknown> },
  ) {
    this.gameId = gameId;
    this.seed = seed;
    this.players = players;
    this.startTimestamp = Date.now();
    this.snapshotInterval = options?.snapshotInterval ?? AUTO_SNAPSHOT_INTERVAL;
    if (options?.metadata) {
      this.metadata = { ...options.metadata };
    }
  }

  /**
   * Record a command that was executed.
   */
  addCommand(envelope: CommandEnvelope, playerId: PlayerId): void {
    const index = this.commands.length;
    this.commands.push({
      index,
      commandEnvelope: envelope,
      playerId,
      timestamp: Date.now(),
    });
  }

  /**
   * Snapshot state at the current point. Also called automatically
   * every N commands when addCommand detects the interval.
   */
  takeSnapshot(state: MatchState): void {
    const atCommandIndex = this.commands.length;
    // Avoid duplicate snapshots at the same index
    const last = this.snapshots[this.snapshots.length - 1];
    if (last && last.atCommandIndex === atCommandIndex) {
      return;
    }
    this.snapshots.push({
      atCommandIndex,
      state: structuredClone(state),
    });
  }

  /**
   * Record a command and automatically snapshot if the interval is hit.
   * Convenience method combining addCommand + conditional takeSnapshot.
   */
  addCommandWithAutoSnapshot(
    envelope: CommandEnvelope,
    playerId: PlayerId,
    currentState: MatchState,
  ): void {
    this.addCommand(envelope, playerId);
    if (this.commands.length % this.snapshotInterval === 0) {
      this.takeSnapshot(currentState);
    }
  }

  /**
   * Build the final ReplayData object.
   */
  build(): ReplayData {
    return {
      version: REPLAY_VERSION,
      gameId: this.gameId,
      timestamp: this.startTimestamp,
      seed: this.seed,
      players: this.players,
      commands: [...this.commands],
      snapshots: [...this.snapshots],
      metadata: { ...this.metadata },
    };
  }

  /**
   * Serialize for storage.
   */
  toJSON(): string {
    return JSON.stringify(this.build());
  }
}

// ── ReplayEngine ────────────────────────────────────────────────────────────

/**
 * Replays a recorded game, supporting forward/backward stepping
 * and seeking to arbitrary positions.
 */
export class ReplayEngine {
  private replayData: ReplayData;
  private staticResources: MatchStaticResources;
  private _currentIndex: number = -1;
  private _state: MatchState;
  private initialState: MatchState;

  constructor(replayData: ReplayData, staticResources: MatchStaticResources) {
    this.replayData = replayData;
    this.staticResources = staticResources;

    // Initialize the match to get the starting state
    const runtime = new MatchRuntime(staticResources);
    runtime.initialize(replayData.players, replayData.seed);
    this.initialState = runtime.getState();
    this._state = this.initialState;
  }

  /** Total number of commands in the replay. */
  get totalCommands(): number {
    return this.replayData.commands.length;
  }

  /** Current command index (-1 means at start, before any command). */
  get currentIndex(): number {
    return this._currentIndex;
  }

  /** Current match state. */
  getState(): MatchState {
    return this._state;
  }

  /** Has the replay reached the end? */
  get isComplete(): boolean {
    return this._currentIndex >= this.replayData.commands.length - 1;
  }

  /**
   * Execute the next command. Returns the CommandResult or null if
   * already at the end.
   */
  stepForward(): CommandResult | null {
    const nextIndex = this._currentIndex + 1;
    if (nextIndex >= this.replayData.commands.length) {
      return null;
    }

    const replayCmd = this.replayData.commands[nextIndex]!;
    const runtime = this.createRuntimeAtState(this._state);
    const result = runtime.executeCommand(replayCmd.commandEnvelope, replayCmd.playerId);

    if (result.success) {
      this._state = result.state;
      this._currentIndex = nextIndex;
    }

    return result;
  }

  /**
   * Undo the last command by seeking to the previous position.
   * Uses snapshots for efficiency.
   */
  stepBackward(): boolean {
    if (this._currentIndex < 0) {
      return false;
    }

    const targetIndex = this._currentIndex - 1;
    this.seekTo(targetIndex);
    return true;
  }

  /**
   * Jump to a specific command index. Use -1 to go to the start
   * (before any commands). Finds the nearest snapshot before the
   * target and replays from there.
   */
  seekTo(index: number): void {
    if (index < -1 || index >= this.replayData.commands.length) {
      throw new Error(
        `Seek index ${index} out of range [-1, ${this.replayData.commands.length - 1}]`,
      );
    }

    // If seeking to start
    if (index === -1) {
      this._state = this.initialState;
      this._currentIndex = -1;
      return;
    }

    // Find the nearest snapshot at or before the target command index.
    // A snapshot at atCommandIndex N represents the state *after* executing
    // command N-1 (i.e., the state right before command N would execute).
    // So a snapshot is usable if atCommandIndex <= index (we need to replay
    // from atCommandIndex through index).
    let bestSnapshot: ReplaySnapshot | null = null;
    for (const snapshot of this.replayData.snapshots) {
      if (
        snapshot.atCommandIndex <= index &&
        (bestSnapshot === null || snapshot.atCommandIndex > bestSnapshot.atCommandIndex)
      ) {
        bestSnapshot = snapshot;
      }
    }

    // Determine starting point
    let startState: MatchState;
    let startIndex: number;

    if (bestSnapshot !== null) {
      startState = structuredClone(bestSnapshot.state);
      startIndex = bestSnapshot.atCommandIndex;
    } else {
      startState = this.initialState;
      startIndex = 0;
    }

    // If seeking backwards and current position is closer than the snapshot,
    // and we're already past the target, we must use the snapshot/initial.
    // If seeking forward and we're before the target, we can continue from current.
    if (this._currentIndex >= 0 && this._currentIndex < index && this._currentIndex >= startIndex) {
      // We can continue from current position
      startState = this._state;
      startIndex = this._currentIndex + 1;
    }

    // Replay commands from startIndex through index
    const runtime = this.createRuntimeAtState(startState);
    for (let i = startIndex; i <= index; i++) {
      const replayCmd = this.replayData.commands[i]!;
      const result = runtime.executeCommand(replayCmd.commandEnvelope, replayCmd.playerId);
      if (!result.success) {
        throw new Error(`Replay failed at command ${i}: ${result.error}`);
      }
    }

    this._state = runtime.getState();
    this._currentIndex = index;
  }

  /**
   * Go back to the start (before any commands).
   */
  reset(): void {
    this._state = this.initialState;
    this._currentIndex = -1;
  }

  // ── Private helpers ─────────────────────────────────────────────────────

  private createRuntimeAtState(state: MatchState): MatchRuntime {
    const runtime = new MatchRuntime(this.staticResources);
    runtime.initialize(this.replayData.players, this.replayData.seed);
    // Replace state with the desired starting state
    runtime.state = structuredClone(state) as import("../types/match-state.ts").MatchState<
      import("../gundam/types.ts").GundamG
    >;
    return runtime;
  }
}

// ── ReplayExporter ──────────────────────────────────────────────────────────

/**
 * Export/import replays in different formats.
 */
export const ReplayExporter = {
  /** Serialize a ReplayData to a JSON string. */
  toJSON(replay: ReplayData): string {
    return JSON.stringify(replay);
  },

  /** Deserialize a ReplayData from a JSON string. */
  fromJSON(json: string): ReplayData {
    const data = JSON.parse(json) as ReplayData;
    if (!data.version || !data.commands || !Array.isArray(data.commands)) {
      throw new Error(renderGundamLogTemplate("gundam.error.replay.invalidDataFormat", {}));
    }
    return data;
  },

  /** Export in compact format — just seed + commands, no snapshots. */
  toCompact(replay: ReplayData): string {
    const compact: CompactReplayData = {
      version: replay.version,
      gameId: replay.gameId,
      timestamp: replay.timestamp,
      seed: replay.seed,
      players: replay.players,
      commands: replay.commands,
      metadata: replay.metadata,
    };
    return JSON.stringify(compact);
  },

  /**
   * Rebuild full ReplayData from compact format by replaying all
   * commands to generate snapshots.
   */
  fromCompact(compactJson: string, staticResources: MatchStaticResources): ReplayData {
    const compact = JSON.parse(compactJson) as CompactReplayData;
    if (!compact.version || !compact.commands || !Array.isArray(compact.commands)) {
      throw new Error("Invalid compact replay data format");
    }

    // Replay the game to generate snapshots
    const runtime = new MatchRuntime(staticResources);
    runtime.initialize(compact.players, compact.seed);

    const snapshots: ReplaySnapshot[] = [];

    // Take initial snapshot (at command index 0, before any commands)
    snapshots.push({
      atCommandIndex: 0,
      state: structuredClone(runtime.getState() as MatchState),
    });

    for (let i = 0; i < compact.commands.length; i++) {
      const cmd = compact.commands[i]!;
      const result = runtime.executeCommand(cmd.commandEnvelope, cmd.playerId);

      if (!result.success) {
        throw new Error(`Replay reconstruction failed at command ${i}: ${result.error}`);
      }

      // Snapshot every AUTO_SNAPSHOT_INTERVAL commands
      if ((i + 1) % AUTO_SNAPSHOT_INTERVAL === 0) {
        snapshots.push({
          atCommandIndex: i + 1,
          state: structuredClone(runtime.getState() as MatchState),
        });
      }
    }

    return {
      version: compact.version,
      gameId: compact.gameId,
      timestamp: compact.timestamp,
      seed: compact.seed,
      players: compact.players,
      commands: compact.commands,
      snapshots,
      metadata: compact.metadata,
    };
  },
};
