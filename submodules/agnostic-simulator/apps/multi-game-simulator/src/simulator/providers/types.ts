import type {
  GameSnapshot,
  MatchInfo,
  MatchPageData,
  MatchResolution,
  Participant,
  CanonicalUserSettings,
  UserSettings,
} from "@tcg/game-page-contract";
import type {
  LiveStateTransition,
  LiveTransitionSource,
} from "@tcg/simulator-runtime/live-transition";
import type { AnimationPlanV1, PlayableGameSlug } from "@tcg/protocol";
import type { SessionResult } from "@tcg/shared/auth";
import type { GatewayTicket } from "@tcg/simulator-runtime/gateway";

import type { SharedSimulatorRouteData, SimulatorRouteKind } from "../routeData";
import type { SimulatorSettings } from "../settings/simulator-settings";

export interface SimulatorProviderInput {
  auth: SessionResult | null;
  gameSlug: PlayableGameSlug | null;
  gatewayTicket: GatewayTicket | null;
  simulatorRouteData: SharedSimulatorRouteData | null;
  simulatorSettings?: SimulatorSettings | null;
  viewerSettings?: CanonicalUserSettings | null;
  rootSocketReady?: boolean;
}

export interface SimulatorRouteContextValue {
  gameSlug: SharedSimulatorRouteData["gameSlug"];
  routeKind: SimulatorRouteKind;
  matchId?: string;
  gameId?: string;
  matchPageData: MatchPageData | null;
  matchResolution: MatchResolution | null;
  error: string | null;
}

export interface SimulatorAuthContextValue {
  auth: SessionResult | null;
  userId: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  subscriptionTier: string | null;
  isPremium: boolean;
}

export interface SimulatorRuntimeConnectionContextValue {
  gameSlug: PlayableGameSlug | null;
  gatewayTicket: GatewayTicket | null;
  rootSocketReady: boolean;
}

export interface SimulatorMatchContextValue {
  match: MatchInfo | null;
  viewerSeat: MatchPageData["viewerSeat"] | null;
  realtime: MatchPageData["realtime"] | null;
}

export interface SimulatorGameSnapshotContextValue {
  game: GameSnapshot | null;
}

export type SimulatorGameTransitionAnimation = AnimationPlanV1;

export interface SimulatorAuthoritativeGameUpdateInput {
  game: GameSnapshot;
  correlationId?: string;
  animationPlan?: readonly SimulatorGameTransitionAnimation[];
  source?: Extract<LiveTransitionSource, "authoritative" | "sync">;
}

export interface SimulatorTransitionContextValue {
  authoritativeGame: GameSnapshot | null;
  displayGame: GameSnapshot | null;
  activeTransition: LiveStateTransition<GameSnapshot, SimulatorGameTransitionAnimation> | null;
  queuedTransitions: readonly LiveStateTransition<GameSnapshot, SimulatorGameTransitionAnimation>[];
  markAnimationComplete: (transitionId: string) => void;
  enqueueAuthoritativeGameUpdate: (input: SimulatorAuthoritativeGameUpdateInput) => void;
}

export interface SimulatorPlayerSummary {
  participant: Participant | null;
  isPremium: boolean;
  mmr: number | null;
}

export interface SimulatorPlayersContextValue {
  currentPlayer: SimulatorPlayerSummary;
  opponentPlayer: SimulatorPlayerSummary;
  participants: readonly Participant[];
}

export interface SimulatorUserSettingsContextValue {
  /** Legacy route-local settings supplied by older game page payloads. */
  userSettings: UserSettings | null;
  /** Canonical signed-in viewer settings, including active per-game configuration. */
  viewerSettings: CanonicalUserSettings | null;
}

export interface SimulatorDiagnosticsContextValue {
  route: SimulatorRouteContextValue;
  auth: Pick<SimulatorAuthContextValue, "isAuthenticated" | "userId" | "subscriptionTier">;
  runtime: SimulatorRuntimeConnectionContextValue;
  matchId: string | null;
  gameId: string | null;
  error: string | null;
}
