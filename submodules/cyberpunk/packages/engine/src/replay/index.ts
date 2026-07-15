import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import { processCommand } from "../command/index.ts";

// Re-export engine-core replay primitives for cross-engine consumers.
// Cyberpunk-specific ReplayBuilder/ReplayEngine/ReplayExporter below are
// kept because they are tightly coupled to Cyberpunk’s CommandEnvelope shape
// and local processCommand runtime.
export {
  ReplayBuilder as UnifiedReplayBuilder,
  ReplayEngine as UnifiedReplayEngine,
  ReplayExporter as UnifiedReplayExporter,
} from "@tcg/engine-core";
export type {
  ReplayCommand as UnifiedReplayCommand,
  ReplaySnapshot as UnifiedReplaySnapshot,
  ReplayData as UnifiedReplayData,
  ReplayEngineOptions as UnifiedReplayEngineOptions,
  CreateRuntimeFn as UnifiedCreateRuntimeFn,
} from "@tcg/engine-core";

export interface CommandLogEntry {
  commandID: string;
  move: string;
  input?: unknown;
  playerId: string;
  stateID: number;
  timestamp: number;
}

export interface MatchReplayData {
  version: string;
  initialState: MatchState;
  commands: CommandLogEntry[];
  metadata: {
    players: { id: string; name: string }[];
    winner: string | null;
    endReason: string | null;
    duration: number;
    seed: string;
  };
}

export class ReplayBuilder {
  private commands: CommandLogEntry[] = [];
  private initialState: MatchState | null = null;
  private startTime = Date.now();

  setInitialState(state: MatchState): this {
    this.initialState = structuredClone(state);
    return this;
  }

  addCommand(entry: CommandLogEntry): this {
    this.commands.push(entry);
    return this;
  }

  build(): MatchReplayData {
    if (!this.initialState) throw new Error("Initial state not set");
    return {
      version: "1.0.0",
      initialState: this.initialState,
      commands: this.commands,
      metadata: {
        players: [],
        winner: null,
        endReason: null,
        duration: Date.now() - this.startTime,
        seed: this.initialState.ctx.seed,
      },
    };
  }
}

export class ReplayEngine {
  private data: MatchReplayData;
  private currentStep = -1;

  constructor(data: MatchReplayData) {
    this.data = data;
  }

  getTotalSteps(): number {
    return this.data.commands.length;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  jumpToStep(step: number): MatchState | undefined {
    if (step < 0 || step >= this.data.commands.length) return undefined;

    let state = structuredClone(this.data.initialState);
    for (let i = 0; i <= step; i++) {
      const cmd = this.data.commands[i]!;
      const result = processCommand(
        state,
        {
          commandID: cmd.commandID,
          move: cmd.move,
          input: cmd.input as any,
          timestamp: cmd.timestamp,
        },
        cmd.playerId as PlayerId,
      );
      if (!result.success) return undefined;
      state = result.state;
    }

    this.currentStep = step;
    return state;
  }

  getInitialState(): MatchState {
    return structuredClone(this.data.initialState);
  }

  getCommandAt(step: number): CommandLogEntry | undefined {
    return this.data.commands[step] ?? undefined;
  }

  getAllCommands(): CommandLogEntry[] {
    return [...this.data.commands];
  }
}

export class ReplayExporter {
  static toJSON(data: MatchReplayData): string {
    return JSON.stringify(data);
  }

  static filterForRole(
    data: MatchReplayData,
    _role: "player" | "spectator" | "judge",
    _playerId?: string,
  ): MatchReplayData {
    return data;
  }
}
