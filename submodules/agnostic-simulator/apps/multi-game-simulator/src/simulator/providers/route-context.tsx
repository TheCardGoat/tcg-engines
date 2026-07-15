import { createRequiredSimulatorContext } from "./context-utils";
import type { SimulatorRouteContextValue } from "./types";

export const EMPTY_SIMULATOR_ROUTE_CONTEXT: SimulatorRouteContextValue = {
  gameSlug: null,
  routeKind: "other",
  matchPageData: null,
  matchResolution: null,
  error: null,
};

export const [SimulatorRouteContextProvider, useSimulatorRoute] =
  createRequiredSimulatorContext<SimulatorRouteContextValue>(EMPTY_SIMULATOR_ROUTE_CONTEXT);
