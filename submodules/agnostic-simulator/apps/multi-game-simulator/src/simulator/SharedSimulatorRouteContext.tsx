import type { ReactNode } from "react";

import {
  buildSimulatorProviderValues,
  SimulatorProviders,
  useSimulatorPlayers,
  useSimulatorRoute,
  type SimulatorPlayerSummary,
} from "./providers";
import type { SharedSimulatorRouteData } from "./routeData";

export interface SharedSimulatorRouteContextValue extends SharedSimulatorRouteData {
  currentPlayer: SimulatorPlayerSummary;
  opponentPlayer: SimulatorPlayerSummary;
}

export type SharedSimulatorPlayerSummary = SimulatorPlayerSummary;

export function SharedSimulatorRouteProvider({
  value,
  children,
}: {
  value: SharedSimulatorRouteData | null | undefined;
  children: ReactNode;
}) {
  return (
    <SimulatorProviders
      auth={null}
      gameSlug={null}
      gatewayTicket={null}
      simulatorRouteData={value ?? null}
    >
      {children}
    </SimulatorProviders>
  );
}

export function useSharedSimulatorRoute(): SharedSimulatorRouteContextValue {
  const route = useSimulatorRoute();
  const players = useSimulatorPlayers();
  return {
    ...route,
    currentPlayer: players.currentPlayer,
    opponentPlayer: players.opponentPlayer,
  };
}

export function buildSharedSimulatorRouteContext(
  value: SharedSimulatorRouteData | null | undefined,
): SharedSimulatorRouteContextValue {
  const values = buildSimulatorProviderValues({
    auth: null,
    gameSlug: null,
    gatewayTicket: null,
    simulatorRouteData: value ?? null,
  });
  return {
    ...values.route,
    currentPlayer: values.players.currentPlayer,
    opponentPlayer: values.players.opponentPlayer,
  };
}
