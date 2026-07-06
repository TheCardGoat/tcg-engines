import { useMemo, type ReactNode } from "react";
import type { Participant, ViewerSeat } from "@tcg/game-page-contract";

import { participantIsPremium } from "../routeData";
import { SimulatorAuthContextProvider } from "./auth-context";
import { SimulatorDiagnosticsContextProvider } from "./diagnostics-context";
import { SimulatorGameSnapshotContextProvider } from "./game-snapshot-context";
import { SimulatorMatchContextProvider } from "./match-context";
import { EMPTY_SIMULATOR_PLAYER_SUMMARY, SimulatorPlayersContextProvider } from "./players-context";
import { SimulatorRouteContextProvider } from "./route-context";
import { SimulatorRuntimeConnectionContextProvider } from "./runtime-connection-context";
import { SimulatorGameTransitionProvider } from "./transition-context";
import { SimulatorUserSettingsContextProvider } from "./user-settings-context";
import { SimulatorAudioProvider } from "../audio";
import { SimulatorSettingsProvider } from "../settings";
import type {
  SimulatorAuthContextValue,
  SimulatorDiagnosticsContextValue,
  SimulatorGameSnapshotContextValue,
  SimulatorMatchContextValue,
  SimulatorPlayersContextValue,
  SimulatorProviderInput,
  SimulatorRouteContextValue,
  SimulatorRuntimeConnectionContextValue,
  SimulatorUserSettingsContextValue,
} from "./types";

export interface SimulatorProvidersProps extends SimulatorProviderInput {
  children: ReactNode;
}

export interface SimulatorProviderValues {
  route: SimulatorRouteContextValue;
  auth: SimulatorAuthContextValue;
  runtime: SimulatorRuntimeConnectionContextValue;
  match: SimulatorMatchContextValue;
  game: SimulatorGameSnapshotContextValue;
  players: SimulatorPlayersContextValue;
  userSettings: SimulatorUserSettingsContextValue;
  diagnostics: SimulatorDiagnosticsContextValue;
}

export function SimulatorProviders({
  auth,
  gameSlug,
  gatewayTicket,
  simulatorRouteData,
  simulatorSettings = null,
  rootSocketReady = false,
  children,
}: SimulatorProvidersProps) {
  const values = useMemo(
    () =>
      buildSimulatorProviderValues({
        auth,
        gameSlug,
        gatewayTicket,
        simulatorRouteData,
        rootSocketReady,
      }),
    [auth, gameSlug, gatewayTicket, rootSocketReady, simulatorRouteData],
  );
  const initialSimulatorSettings = useMemo(() => simulatorSettings, [simulatorSettings]);

  return (
    <SimulatorRouteContextProvider value={values.route}>
      <SimulatorAuthContextProvider value={values.auth}>
        <SimulatorSettingsProvider initialSettings={initialSimulatorSettings}>
          <SimulatorAudioProvider>
            <SimulatorRuntimeConnectionContextProvider value={values.runtime}>
              <SimulatorMatchContextProvider value={values.match}>
                <SimulatorGameSnapshotContextProvider value={values.game}>
                  <SimulatorGameTransitionProvider game={values.game.game}>
                    <SimulatorPlayersContextProvider value={values.players}>
                      <SimulatorUserSettingsContextProvider value={values.userSettings}>
                        <SimulatorDiagnosticsContextProvider value={values.diagnostics}>
                          {children}
                        </SimulatorDiagnosticsContextProvider>
                      </SimulatorUserSettingsContextProvider>
                    </SimulatorPlayersContextProvider>
                  </SimulatorGameTransitionProvider>
                </SimulatorGameSnapshotContextProvider>
              </SimulatorMatchContextProvider>
            </SimulatorRuntimeConnectionContextProvider>
          </SimulatorAudioProvider>
        </SimulatorSettingsProvider>
      </SimulatorAuthContextProvider>
    </SimulatorRouteContextProvider>
  );
}

export function buildSimulatorProviderValues(
  input: SimulatorProviderInput,
): SimulatorProviderValues {
  const route = buildRouteValue(input);
  const auth = buildAuthValue(input.auth);
  const runtime: SimulatorRuntimeConnectionContextValue = {
    gameSlug: input.gameSlug,
    gatewayTicket: input.gatewayTicket,
    rootSocketReady: input.rootSocketReady === true,
  };
  const match = buildMatchValue(route);
  const game: SimulatorGameSnapshotContextValue = {
    game: route.matchPageData?.game ?? null,
  };
  const players = buildPlayersValue(match);
  const userSettings: SimulatorUserSettingsContextValue = {
    userSettings: route.matchPageData?.userSettings ?? null,
  };
  const diagnostics: SimulatorDiagnosticsContextValue = {
    route,
    auth: {
      isAuthenticated: auth.isAuthenticated,
      userId: auth.userId,
      subscriptionTier: auth.subscriptionTier,
    },
    runtime,
    matchId: route.matchId ?? match.match?.matchId ?? null,
    gameId: route.gameId ?? game.game?.gameId ?? null,
    error: route.error,
  };

  return {
    route,
    auth,
    runtime,
    match,
    game,
    players,
    userSettings,
    diagnostics,
  };
}

function buildRouteValue(input: SimulatorProviderInput): SimulatorRouteContextValue {
  const data = input.simulatorRouteData;
  return {
    gameSlug: data?.gameSlug ?? null,
    routeKind: data?.routeKind ?? "other",
    ...(data?.matchId ? { matchId: data.matchId } : {}),
    ...(data?.gameId ? { gameId: data.gameId } : {}),
    matchPageData: data?.matchPageData ?? null,
    matchResolution: data?.matchResolution ?? null,
    error: data?.error ?? null,
  };
}

function buildAuthValue(auth: SimulatorProviderInput["auth"]): SimulatorAuthContextValue {
  const user = auth?.user ?? null;
  const subscriptionTier = user?.subscriptionTier ?? null;
  return {
    auth,
    userId: user?.id ?? null,
    displayName: user?.displayUsername ?? user?.name ?? null,
    isAuthenticated: Boolean(auth?.session && user),
    subscriptionTier,
    isPremium: Boolean(subscriptionTier && subscriptionTier !== "free"),
  };
}

function buildMatchValue(route: SimulatorRouteContextValue): SimulatorMatchContextValue {
  return {
    match: route.matchPageData?.match ?? route.matchResolution?.match ?? null,
    viewerSeat: route.matchPageData?.viewerSeat ?? null,
    realtime: route.matchPageData?.realtime ?? null,
  };
}

function buildPlayersValue(match: SimulatorMatchContextValue): SimulatorPlayersContextValue {
  const participants = match.match?.participants ?? [];
  const currentPlayer = findViewerParticipant(participants, match.viewerSeat);
  const opponentPlayer =
    currentPlayer && match.match
      ? (match.match.participants.find((participant) => participant.id !== currentPlayer.id) ??
        null)
      : null;

  return {
    currentPlayer: summarizeParticipant(currentPlayer),
    opponentPlayer: summarizeParticipant(opponentPlayer),
    participants,
  };
}

function findViewerParticipant(
  participants: readonly Participant[],
  viewerSeat: ViewerSeat | null,
): Participant | null {
  if (typeof viewerSeat !== "number") {
    return null;
  }
  return participants.find((participant) => participant.seat === viewerSeat) ?? null;
}

function summarizeParticipant(participant: Participant | null) {
  if (!participant) {
    return EMPTY_SIMULATOR_PLAYER_SUMMARY;
  }
  return {
    participant,
    isPremium: participantIsPremium(participant),
    mmr: typeof participant.mmrAtMatch === "number" ? participant.mmrAtMatch : null,
  };
}
