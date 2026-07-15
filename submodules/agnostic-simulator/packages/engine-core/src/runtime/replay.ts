import type { CommandEnvelope, MatchState } from "../types/index.ts";

export interface ReplayCommand {
  commandID: string;
  move: string;
  args: unknown;
  playerId: string;
  timestamp: number;
}

export interface ReplaySnapshot {
  index: number;
  state: MatchState;
}

export interface ReplayData {
  version: string;
  gameId: string;
  timestamp: number;
  seed: string;
  players: { id: string; name: string; deck: string[] }[];
  commands: ReplayCommand[];
  snapshots: ReplaySnapshot[];
  metadata?: Record<string, unknown>;
}

export class ReplayBuilder {
  private commands: ReplayCommand[] = [];
  private snapshots: ReplaySnapshot[] = [];

  addCommand(envelope: CommandEnvelope, playerId: string, timestamp: number): void {
    this.commands.push({
      commandID: envelope.commandID,
      move: envelope.move,
      args: envelope.args,
      playerId,
      timestamp,
    });
  }

  takeSnapshot(state: MatchState): void {
    this.snapshots.push({
      index: this.commands.length,
      state: structuredClone(state) as MatchState,
    });
  }

  addCommandWithAutoSnapshot(
    envelope: CommandEnvelope,
    playerId: string,
    currentState: MatchState,
  ): void {
    if (this.commands.length % 50 === 0) {
      this.takeSnapshot(currentState);
    }
    this.addCommand(envelope, playerId, Date.now());
  }

  build(): ReplayData {
    return {
      version: "1.0.0",
      gameId: "",
      timestamp: Date.now(),
      seed: "",
      players: [],
      commands: this.commands,
      snapshots: this.snapshots,
    };
  }
}

export interface ReplayEngineOptions {
  staticResources: unknown;
}

export type CreateRuntimeFn = (state: MatchState) => {
  executeCommand(envelope: CommandEnvelope, playerId: string): MatchState;
};

export class ReplayEngine {
  private currentIndex = -1;
  private currentState: MatchState;
  private initialState: MatchState;
  private commands: ReplayCommand[];
  private snapshots: ReplaySnapshot[];
  private createRuntime: CreateRuntimeFn;

  constructor(
    initialState: MatchState,
    commands: ReplayCommand[],
    snapshots: ReplaySnapshot[],
    createRuntime: CreateRuntimeFn,
  ) {
    this.initialState = initialState;
    this.commands = commands;
    this.snapshots = snapshots;
    this.createRuntime = createRuntime;
    // Replay snapshots are persisted plain data, so structuredClone is the
    // intentional boundary for independent state copies.
    this.currentState = structuredClone(initialState) as MatchState;
  }

  stepForward(): void {
    if (this.currentIndex + 1 >= this.commands.length) return;
    this.currentIndex++;
    const cmd = this.commands[this.currentIndex]!;
    const runtime = this.createRuntime(this.getCurrentState());
    this.currentState = runtime.executeCommand(
      {
        commandID: cmd.commandID,
        move: cmd.move,
        prevStateID: 0,
        actorRole: "player",
        args: cmd.args,
      },
      cmd.playerId,
    );
  }

  stepBackward(): void {
    if (this.currentIndex <= 0) {
      this.currentIndex = -1;
      this.currentState = structuredClone(this.initialState) as MatchState;
      return;
    }
    this.seekTo(this.currentIndex - 1);
  }

  seekTo(index: number): void {
    if (index < 0) {
      this.currentIndex = -1;
      this.currentState = structuredClone(this.initialState) as MatchState;
      return;
    }
    if (this.commands.length === 0) {
      this.currentIndex = -1;
      this.currentState = structuredClone(this.initialState) as MatchState;
      return;
    }
    const targetIndex = Math.min(index, this.commands.length - 1);
    const snapshot = this.findNearestSnapshot(targetIndex);
    let state = structuredClone(snapshot.state) as MatchState;
    const startIndex = Math.max(0, snapshot.index);
    for (let i = startIndex; i <= targetIndex; i++) {
      const cmd = this.commands[i]!;
      const runtime = this.createRuntime(state);
      state = runtime.executeCommand(
        {
          commandID: cmd.commandID,
          move: cmd.move,
          prevStateID: 0,
          actorRole: "player",
          args: cmd.args,
        },
        cmd.playerId,
      );
    }
    this.currentIndex = targetIndex;
    this.currentState = state;
  }

  private findNearestSnapshot(targetIndex: number): ReplaySnapshot {
    let best: ReplaySnapshot = {
      index: -1,
      state: structuredClone(this.initialState) as MatchState,
    };
    for (const snapshot of this.snapshots) {
      if (snapshot.index <= targetIndex && snapshot.index > best.index) {
        best = snapshot;
      }
    }
    return best;
  }

  getCurrentState(): MatchState {
    return this.currentState;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }
}

export const ReplayExporter = {
  toJSON(replay: ReplayData): string {
    return JSON.stringify(replay);
  },
  fromJSON(json: string): ReplayData {
    return JSON.parse(json) as ReplayData;
  },
  toCompact(replay: ReplayData): Omit<ReplayData, "snapshots"> {
    const { snapshots: _, ...compact } = replay;
    return compact;
  },
};
