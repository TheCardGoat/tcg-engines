import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { ClientLoaderFunctionArgs, LoaderFunctionArgs } from "react-router";
import { isPlayableGameSlug, type PlayableGameSlug } from "@tcg/protocol";
import { CanonicalUserSettingsSchema, type CanonicalUserSettings } from "@tcg/game-page-contract";
import type { GatewayTicket } from "@tcg/simulator-runtime/gateway";
import type { SessionResult } from "@tcg/shared/auth";

import { platformAuthSessionContext } from "../server/context";
import { resolveGatewayTicket, type GatewayTicketBootstrapResult } from "../server/gateway-ticket";
import { initRootSocket } from "./lib/gateway/root-socket";
import { apiUrl } from "./runtime/gameRuntimeApi";
import { fetchSharedSimulatorRouteData } from "./simulator/routeData";
import {
  normalizeSimulatorSettings,
  type SimulatorSettings,
} from "./simulator/settings/simulator-settings";

import "./app.css";
import "@tcg/simulator-ui/styles/theme.css";

export type SimulatorAuthBootstrapStatus =
  | "ready"
  | "anonymous_allowed"
  | "session_missing"
  | "ticket_failed"
  | "auth_parse_failed";

export type SimulatorAuthBootstrapResult = {
  status: SimulatorAuthBootstrapStatus;
  requireAuth: boolean;
  hasSession: boolean;
  hasTicket: boolean;
  hasToken: boolean;
  matchId?: string;
  playerId?: string;
  reason?: string;
};

export interface UrlGatewayCredentials {
  ticket?: string;
  authToken?: string;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Derives the active game slug from the FIRST path segment of the request URL
 * (path-prefix routing only). Mirrors the client-side `parseGameSlug` decode
 * handling for safety.
 */
function resolveGameSlugFromPath(pathname: string): PlayableGameSlug | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (!firstSegment) {
    return null;
  }
  let decoded: string;
  try {
    decoded = decodeURIComponent(firstSegment);
  } catch {
    return null;
  }
  return isPlayableGameSlug(decoded) ? decoded : null;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const gameSlug = resolveGameSlugFromPath(url.pathname);
  const authResult = context.get(platformAuthSessionContext);
  const auth: SessionResult | null = authResult.status === "ready" ? authResult.session : null;
  const routeAuth = resolveRouteAuthHints(url);
  const urlGatewayCredentials = parseUrlGatewayCredentials(url);
  const hasUrlGatewayCredentials = Boolean(
    urlGatewayCredentials.ticket || urlGatewayCredentials.authToken,
  );
  const simulatorRouteData = await fetchSharedSimulatorRouteData({
    request,
    env: process.env,
  });
  const requiresMatchPlayerAuth =
    routeAuth.requiresPlayerAuth ||
    (Boolean(simulatorRouteData.matchPageData) &&
      simulatorRouteData.matchPageData?.viewerSeat !== "spectator");
  const gatewayTicketMatchId = requiresMatchPlayerAuth ? routeAuth.matchId : undefined;
  const gatewayTicketPlayerId = requiresMatchPlayerAuth ? routeAuth.playerId : undefined;
  const requireAuth = Boolean(auth?.session) || requiresMatchPlayerAuth;
  const gatewayTicketResult =
    requireAuth && (Boolean(auth?.session) || !hasUrlGatewayCredentials)
      ? await resolveGatewayTicket({
          request,
          gameSlug,
          matchId: gatewayTicketMatchId,
          playerId: gatewayTicketPlayerId,
          requireAuth,
        })
      : null;
  const gatewayTicket: GatewayTicket | null =
    gatewayTicketResult?.status === "ready" ? gatewayTicketResult.ticket : null;
  const authBootstrap = buildSimulatorAuthBootstrap({
    authStatus: authResult.status,
    authReason: "reason" in authResult ? authResult.reason : undefined,
    gatewayTicketResult,
    hasSession: Boolean(auth?.session),
    hasToken: Boolean(
      gatewayTicket?.authToken ?? urlGatewayCredentials.authToken ?? auth?.session?.token,
    ),
    hasTicket: Boolean(gatewayTicket?.ticket ?? urlGatewayCredentials.ticket),
    requireAuth,
    matchId: gatewayTicketMatchId,
    playerId: gatewayTicketPlayerId,
  });
  const settingsBootstrap = auth?.session
    ? await fetchViewerSettings({ request, env: process.env })
    : null;
  return {
    auth,
    authBootstrap,
    gameSlug,
    gatewayTicket,
    simulatorRouteData,
    simulatorSettings: settingsBootstrap?.simulatorSettings ?? null,
    viewerSettings: settingsBootstrap?.viewerSettings ?? null,
    urlGatewayCredentials,
  };
}

/**
 * Initializes the persistent root gateway socket on the client. This is a
 * non-blocking side effect; the server `loader` data is still used for the
 * initial render. `hydrate = true` ensures the socket initializes on the first
 * document load as well as on subsequent client navigations.
 */
export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const serverData = await serverLoader<typeof loader>();
  initRootSocket({
    session: serverData.auth?.session ?? null,
    gameSlug: serverData.gameSlug,
    ticket: serverData.gatewayTicket?.ticket ?? serverData.urlGatewayCredentials.ticket,
    authToken: serverData.gatewayTicket?.authToken ?? serverData.urlGatewayCredentials.authToken,
    requireAuth: serverData.authBootstrap.requireAuth,
    matchId: serverData.authBootstrap.matchId,
    playerId: serverData.authBootstrap.playerId,
  });
  return { ...serverData, rootSocketReady: true };
}
clientLoader.hydrate = true as const;

export default function Root() {
  return <Outlet />;
}

interface UserSettingsResponse {
  playerSettings?: CanonicalUserSettings["playerSettings"];
  gameSettings?: CanonicalUserSettings["gameSettings"];
  gameplaySettings?: {
    soundVolume?: number;
  };
}

async function fetchViewerSettings({
  request,
  env,
  fetcher = fetch,
}: {
  request: Request;
  env: NodeJS.ProcessEnv;
  fetcher?: typeof fetch;
}): Promise<{
  viewerSettings: CanonicalUserSettings | null;
  simulatorSettings: SimulatorSettings | null;
} | null> {
  try {
    const response = await fetcher(apiUrl("platform", "/users/me/settings", env), {
      headers: forwardedRequestHeaders(request),
    });
    if (!response.ok) {
      return null;
    }
    const body = (await response.json()) as UserSettingsResponse;
    const parsed = CanonicalUserSettingsSchema.safeParse({
      playerSettings: body.playerSettings ?? {},
      gameSettings: body.gameSettings ?? {},
    });
    const viewerSettings = parsed.success ? parsed.data : null;
    const soundVolume =
      viewerSettings?.playerSettings.soundVolume ?? body.gameplaySettings?.soundVolume;
    return {
      viewerSettings,
      simulatorSettings:
        soundVolume === undefined ? null : normalizeSimulatorSettings({ soundVolume }),
    };
  } catch {
    return null;
  }
}

function forwardedRequestHeaders(request: Request): Headers {
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");
  if (cookie) {
    headers.set("cookie", cookie);
  }
  if (authorization) {
    headers.set("authorization", authorization);
  }
  return headers;
}

function resolveRouteAuthHints(url: URL): {
  requiresPlayerAuth: boolean;
  matchId?: string;
  playerId?: string;
} {
  const playerId = url.searchParams.get("playerId")?.trim() || undefined;
  const matchId = matchIdFromPath(url.pathname);
  return {
    ...(matchId ? { matchId } : {}),
    ...(playerId ? { playerId } : {}),
    requiresPlayerAuth: Boolean(matchId && playerId),
  };
}

function parseUrlGatewayCredentials(url: URL): UrlGatewayCredentials {
  const ticket = url.searchParams.get("ticket")?.trim() || undefined;
  const authToken = url.searchParams.get("authToken")?.trim() || undefined;
  return {
    ...(ticket ? { ticket } : {}),
    ...(authToken ? { authToken } : {}),
  };
}

function matchIdFromPath(pathname: string): string | undefined {
  const segments = pathname.split("/").filter(Boolean);
  const matchIndex = segments.indexOf("matches");
  const encodedMatchId = matchIndex >= 0 ? segments[matchIndex + 1] : undefined;
  if (!encodedMatchId) {
    return undefined;
  }
  try {
    return decodeURIComponent(encodedMatchId);
  } catch {
    return undefined;
  }
}

function buildSimulatorAuthBootstrap({
  authStatus,
  authReason,
  gatewayTicketResult,
  hasSession,
  hasToken,
  hasTicket,
  requireAuth,
  matchId,
  playerId,
}: {
  authStatus: SimulatorAuthBootstrapStatus;
  authReason?: string;
  gatewayTicketResult: GatewayTicketBootstrapResult | null;
  hasSession: boolean;
  hasToken: boolean;
  hasTicket: boolean;
  requireAuth: boolean;
  matchId?: string;
  playerId?: string;
}): SimulatorAuthBootstrapResult {
  if (gatewayTicketResult?.status === "ticket_failed") {
    return {
      status: "ticket_failed",
      reason: gatewayTicketResult.reason,
      requireAuth,
      hasSession,
      hasTicket,
      hasToken,
      ...(matchId ? { matchId } : {}),
      ...(playerId ? { playerId } : {}),
    };
  }

  if (authStatus === "ready") {
    return {
      status: "ready",
      requireAuth,
      hasSession,
      hasTicket,
      hasToken,
      ...(matchId ? { matchId } : {}),
      ...(playerId ? { playerId } : {}),
    };
  }

  if (requireAuth && (hasTicket || hasToken)) {
    return {
      status: "ready",
      requireAuth,
      hasSession,
      hasTicket,
      hasToken,
      ...(matchId ? { matchId } : {}),
      ...(playerId ? { playerId } : {}),
    };
  }

  if (requireAuth) {
    logAuthBootstrapFailure(authStatus, authReason, {
      requireAuth,
      hasSession,
      hasTicket,
      hasToken,
    });
    return {
      status: authStatus,
      reason: authReason,
      requireAuth,
      hasSession,
      hasTicket,
      hasToken,
      ...(matchId ? { matchId } : {}),
      ...(playerId ? { playerId } : {}),
    };
  }

  return {
    status: "anonymous_allowed",
    reason: authStatus,
    requireAuth,
    hasSession,
    hasTicket,
    hasToken,
    ...(matchId ? { matchId } : {}),
    ...(playerId ? { playerId } : {}),
  };
}

function logAuthBootstrapFailure(
  status: SimulatorAuthBootstrapStatus,
  reason: string | undefined,
  details: Pick<
    SimulatorAuthBootstrapResult,
    "requireAuth" | "hasSession" | "hasTicket" | "hasToken"
  >,
): void {
  console.warn("[simulator-auth] required auth bootstrap failed", {
    status,
    reason,
    ...details,
  });
}
