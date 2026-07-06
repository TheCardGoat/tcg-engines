import { createRequiredSimulatorContext } from "./context-utils";
import type { SimulatorRuntimeConnectionContextValue } from "./types";

export const EMPTY_SIMULATOR_RUNTIME_CONNECTION_CONTEXT: SimulatorRuntimeConnectionContextValue = {
  gameSlug: null,
  gatewayTicket: null,
  rootSocketReady: false,
};

export const [SimulatorRuntimeConnectionContextProvider, useSimulatorRuntimeConnection] =
  createRequiredSimulatorContext<SimulatorRuntimeConnectionContextValue>(
    EMPTY_SIMULATOR_RUNTIME_CONNECTION_CONTEXT,
  );
