import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { ClientLoaderFunctionArgs, LoaderFunctionArgs } from "react-router";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { isPlayableGameSlug, type PlayableGameSlug } from "@tcg/protocol";
import { CanonicalUserSettingsSchema, type CanonicalUserSettings } from "@tcg/game-page-contract";
import type { GatewayTicket } from "@tcg/simulator-runtime/gateway";
import type { SessionResult } from "@tcg/shared/auth";
import { getPlayGameConfig } from "@tcg/shared/game-adapter";

import { platformAuthSessionContext } from "../server/context";
import { resolveGatewayTicket, type GatewayTicketBootstrapResult } from "../server/gateway-ticket";
import { initRootSocket } from "./lib/gateway/root-socket";
import { logDebugPayload } from "./lib/debug-logging";
import { apiUrl, runtimeApiEnvForServer } from "./runtime/gameRuntimeApi";
import { parseSharedSimulatorRoute } from "./simulator/routeData";
import { isSimulatorDebugExportEnabled } from "./simulator/debug-export/debug-export-feature";
import {
  normalizeSimulatorSettings,
  type SimulatorSettings,
} from "./simulator/settings/simulator-settings";

import "./app.css";
import "@tcg/simulator-ui/styles/theme.css";
// The FAB sideboard is a lazy route with a dense, fixed-height card grid.
// Keep its layout CSS in the initial document so card and footer geometry is
// reserved before the route module and remote board art finish loading.
import "./games/flesh-and-blood/flesh-and-blood.css";

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
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
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
  const runtimeEnv = runtimeApiEnvForServer(process.env);
  const route = parseSharedSimulatorRoute(url);
  const sessionRoute = route.routeKind === "live-match" || route.routeKind === "match-landing";
  const requireAuth = Boolean(auth?.session);
  const [gatewayTicketResult, settingsBootstrap] = await Promise.all([
    !sessionRoute && requireAuth ? resolveGatewayTicket({ request, gameSlug, requireAuth }) : null,
    auth?.session ? fetchViewerSettings({ request, env: runtimeEnv }) : null,
  ]);
  const gatewayTicket: GatewayTicket | null =
    gatewayTicketResult?.status === "ready" ? gatewayTicketResult.ticket : null;
  const authBootstrap = buildSimulatorAuthBootstrap({
    authStatus: authResult.status,
    authReason: "reason" in authResult ? authResult.reason : undefined,
    gatewayTicketResult,
    hasSession: Boolean(auth?.session),
    hasToken: Boolean(gatewayTicket?.authToken ?? auth?.session?.token),
    hasTicket: Boolean(gatewayTicket?.ticket),
    requireAuth,
  });
  return {
    auth,
    authBootstrap,
    debugExportEnabled: isSimulatorDebugExportEnabled(process.env),
    gameSlug,
    gatewayTicket,
    sessionRoute,
    simulatorSettings: settingsBootstrap?.simulatorSettings ?? null,
    viewerSettings: settingsBootstrap?.viewerSettings ?? null,
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
  logDebugPayload("[simulator:ssr] root loader payload", serverData);
  if (serverData.sessionRoute) return { ...serverData, rootSocketReady: false };
  const isLiveGame =
    serverData.gameSlug !== null && getPlayGameConfig(serverData.gameSlug)?.isActive === true;
  initRootSocket({
    session: serverData.auth?.session ?? null,
    gameSlug: isLiveGame ? serverData.gameSlug : null,
    ticket: serverData.gatewayTicket?.ticket,
    authToken: serverData.gatewayTicket?.authToken,
    requireAuth: serverData.authBootstrap.requireAuth,
  });
  return { ...serverData, rootSocketReady: true };
}
clientLoader.hydrate = true as const;

// Applies to document and framework data responses, including the Vite dev
// handler which does not run the production Express response middleware.
export function headers() {
  return { "Cache-Control": "private, no-store", Vary: "Cookie, Authorization" };
}

export default function Root() {
  return <Outlet />;
}

interface UserSettingsResponse {
  playerSettings?: CanonicalUserSettings["playerSettings"];
  gameSettings?: CanonicalUserSettings["gameSettings"];
  gameplaySettings?: {
    soundVolume?: number;
    cardInteractionMode?: SimulatorSettings["cardInteractionMode"];
    animationSpeed?: SimulatorSettings["animationSpeed"];
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
    const cardInteractionMode =
      viewerSettings?.playerSettings.cardInteractionMode ??
      body.gameplaySettings?.cardInteractionMode;
    const animationSpeed =
      viewerSettings?.playerSettings.animationSpeed ?? body.gameplaySettings?.animationSpeed;
    return {
      viewerSettings,
      simulatorSettings:
        soundVolume === undefined &&
        cardInteractionMode === undefined &&
        animationSpeed === undefined
          ? null
          : normalizeSimulatorSettings({ soundVolume, cardInteractionMode, animationSpeed }),
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
