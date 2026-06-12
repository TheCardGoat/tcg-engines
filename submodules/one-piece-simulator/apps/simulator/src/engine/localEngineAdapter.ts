import {
  applyCommand,
  createMatch,
  getLegalCommands,
  projectStateForSeat,
  type EngineCommand,
  type MatchState,
  type Viewer,
} from "../../../../packages/engine/src/index";
import type { EngineAdapter, EngineUpdateListener, LocalAdapterConfig } from "./adapter";

export function createLocalEngineAdapter(config: LocalAdapterConfig): EngineAdapter {
  let state = createMatch(config);
  const listeners = new Set<EngineUpdateListener>();

  return {
    async getState() {
      return state;
    },
    async getView(viewer: Viewer) {
      return projectStateForSeat(state, viewer);
    },
    async getLegalCommands(viewer: Viewer = state.activeSeat) {
      return getLegalCommands(state, viewer === "spectator" ? state.activeSeat : viewer);
    },
    async applyCommand(command: EngineCommand) {
      const result = applyCommand(state, command);
      state = result.state;
      for (const listener of listeners) {
        listener(result, state);
      }
      return result;
    },
    subscribe(listener: EngineUpdateListener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export async function snapshotLocalState(adapter: EngineAdapter): Promise<MatchState> {
  return adapter.getState();
}
