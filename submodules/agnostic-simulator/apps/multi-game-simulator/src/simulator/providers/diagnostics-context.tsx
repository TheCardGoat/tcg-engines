import { createRequiredSimulatorContext } from "./context-utils";
import { EMPTY_SIMULATOR_AUTH_CONTEXT } from "./auth-context";
import { EMPTY_SIMULATOR_RUNTIME_CONNECTION_CONTEXT } from "./runtime-connection-context";
import { EMPTY_SIMULATOR_ROUTE_CONTEXT } from "./route-context";
import type { SimulatorDiagnosticsContextValue } from "./types";

export const EMPTY_SIMULATOR_DIAGNOSTICS_CONTEXT: SimulatorDiagnosticsContextValue = {
  route: EMPTY_SIMULATOR_ROUTE_CONTEXT,
  auth: {
    isAuthenticated: EMPTY_SIMULATOR_AUTH_CONTEXT.isAuthenticated,
    userId: EMPTY_SIMULATOR_AUTH_CONTEXT.userId,
    subscriptionTier: EMPTY_SIMULATOR_AUTH_CONTEXT.subscriptionTier,
  },
  runtime: EMPTY_SIMULATOR_RUNTIME_CONNECTION_CONTEXT,
  matchId: null,
  gameId: null,
  error: null,
};

export const [SimulatorDiagnosticsContextProvider, useSimulatorDiagnostics] =
  createRequiredSimulatorContext<SimulatorDiagnosticsContextValue>(
    EMPTY_SIMULATOR_DIAGNOSTICS_CONTEXT,
  );
