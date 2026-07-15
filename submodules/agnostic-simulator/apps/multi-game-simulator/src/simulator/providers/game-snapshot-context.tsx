import { createRequiredSimulatorContext } from "./context-utils";
import type { SimulatorGameSnapshotContextValue } from "./types";

export const EMPTY_SIMULATOR_GAME_SNAPSHOT_CONTEXT: SimulatorGameSnapshotContextValue = {
  game: null,
};

export const [SimulatorGameSnapshotContextProvider, useSimulatorGameSnapshot] =
  createRequiredSimulatorContext<SimulatorGameSnapshotContextValue>(
    EMPTY_SIMULATOR_GAME_SNAPSHOT_CONTEXT,
  );
