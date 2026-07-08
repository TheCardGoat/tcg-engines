import { createRequiredSimulatorContext } from "./context-utils";
import type { SimulatorMatchContextValue } from "./types";

export const EMPTY_SIMULATOR_MATCH_CONTEXT: SimulatorMatchContextValue = {
  match: null,
  viewerSeat: null,
  realtime: null,
};

export const [SimulatorMatchContextProvider, useSimulatorMatch] =
  createRequiredSimulatorContext<SimulatorMatchContextValue>(EMPTY_SIMULATOR_MATCH_CONTEXT);
