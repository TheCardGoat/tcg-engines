import { createRequiredSimulatorContext } from "./context-utils";
import type { SimulatorAuthContextValue } from "./types";

export const EMPTY_SIMULATOR_AUTH_CONTEXT: SimulatorAuthContextValue = {
  auth: null,
  userId: null,
  displayName: null,
  isAuthenticated: false,
  subscriptionTier: null,
  isPremium: false,
};

export const [SimulatorAuthContextProvider, useSimulatorAuth] =
  createRequiredSimulatorContext<SimulatorAuthContextValue>(EMPTY_SIMULATOR_AUTH_CONTEXT);
