import type { CredentialsController, GatewayCredentials, GatewayHandle } from "@tcg/gateway-client";
import type { PlayableGameSlug } from "@tcg/protocol";
import { requestGatewayTicket } from "@tcg/simulator-runtime/gateway";
import type { GameSlug } from "@tcg/simulator-contract";
import type { AuthSession } from "@tcg/shared/auth";

import { gameApiBaseUrl } from "../../runtime/gameRuntimeApi";
import { getGatewayManager } from "./gateway-manager";

export interface InitRootSocketArgs {
  /** Better-Auth session (with `.token`) from the root server loader, if any. */
  session: AuthSession | null;
  /** Active game slug, used as the gateway namespace. `null` tears down. */
  gameSlug: PlayableGameSlug | null;
  /**
   * Single-use gateway ticket resolved server-side (cookie-forwarded to the
   * per-game ticket endpoint). Seeded into the credentials controller.
   */
  ticket?: string;
  /** JWT (preferred) resolved alongside the SSR ticket. */
  authToken?: string;
  /** True when this route must not downgrade to an anonymous gateway join. */
  requireAuth?: boolean;
  /** Active live-match id, forwarded when refreshing route-scoped tickets. */
  matchId?: string;
  /** Active player/profile id, forwarded when refreshing route-scoped tickets. */
  playerId?: string;
}

/**
 * Module-level hold on the root namespace. The root `clientLoader` runs on
 * hydration; this handle stays open across client navigation so the gateway
 * socket (and the user's presence) persists. LiveMatch acquires the SAME
 * namespace from the shared manager, bumping the ref-count to 2.
 */
let currentHandle: GatewayHandle | null = null;
let currentSlug: PlayableGameSlug | null = null;
/**
 * Credentials controller installed once per slug (first acquire wins). Stable
 * across same-slug re-init so the library's "first acquire owns the
 * controller" invariant holds.
 */
let currentController: CredentialsController | null = null;
/**
 * Mutable credentials snapshot the controller reads on every handshake. Same-
 * slug re-init overwrites this with the freshest SSR credentials; refresh
 * overwrites it with the freshly fetched ticket.
 */
let currentSnapshot: GatewayCredentials = {};
let currentMatchId: string | undefined;
let currentPlayerId: string | undefined;

function buildCredentials(
  session: AuthSession | null,
  ticket: string | undefined,
  authToken: string | undefined,
  requireAuth: boolean | undefined,
): GatewayCredentials {
  // Fall back to the opaque Better-Auth session token when the SSR ticket/JWT
  // is missing (e.g. the ticket fetch was skipped or failed). This matches the
  // web app and keeps the requireAuth gate from refusing to dial even though a
  // valid session exists.
  const token = authToken ?? session?.token;
  return {
    ...(ticket !== undefined ? { ticket } : {}),
    ...(token ? { token } : {}),
    requireAuth: Boolean(requireAuth ?? session),
  };
}

function hasHandshakeCredential(snapshot: GatewayCredentials): boolean {
  return Boolean(snapshot.ticket || snapshot.token);
}

function shouldForceCredentialHandshake(
  handle: GatewayHandle | null,
  snapshot: GatewayCredentials,
  options: { includeConnecting: boolean },
): boolean {
  if (!handle) return false;
  if (!snapshot.requireAuth || !hasHandshakeCredential(snapshot)) return false;
  const state = handle.getState();
  if (state.authenticated) return false;
  if (state.status === "connected" || state.status === "disconnected") return true;
  return options.includeConnecting && state.status === "connecting";
}

/**
 * Narrow a protocol namespace slug to the simulator-contract runtime-API slug
 * the ticket endpoint resolver expects. Unsupported protocol namespaces do not
 * have a runtime API origin yet, so required-auth refresh must fail closed
 * instead of minting another game's ticket.
 */
function runtimeApiGameSlug(slug: PlayableGameSlug): GameSlug | null {
  switch (slug) {
    case "cyberpunk":
    case "gundam":
    case "lorcana":
    case "one-piece":
    case "platform":
      return slug;
    default:
      return null;
  }
}

/**
 * Build a stable credentials controller for a slug. The controller reads the
 * module-level {@link currentSnapshot} on every `get()` (so SSR credential
 * refreshes land without rebuilding the controller) and fetches a fresh ticket
 * via the gateway ticket endpoint on `refresh()` (called by the library on
 * auth failure or a blocked requireAuth connect gate).
 */
function buildCredentialsController(slug: PlayableGameSlug): CredentialsController {
  return {
    get: () => currentSnapshot,
    refresh: async () => {
      const apiGameSlug = runtimeApiGameSlug(slug);
      if (apiGameSlug === null) {
        throw new Error(`Gateway ticket refresh is not supported for ${slug}.`);
      }
      // Game-agnostic ticket refresh: resolve the per-game runtime-API origin
      // from the slug, then hit the shared `/v1/gateway/ticket` resolver. No
      // game-specific auth priming or HTTP-error shaping here — those stay in
      // each game's liveGateway wrapper if that game's UI needs them.
      const refreshed = await requestGatewayTicket({
        apiBaseUrl: gameApiBaseUrl(apiGameSlug),
        ...(currentMatchId ? { matchId: currentMatchId } : {}),
        ...(currentPlayerId ? { playerId: currentPlayerId } : {}),
      });
      const requireAuth = Boolean(currentSnapshot.requireAuth);
      currentSnapshot = {
        ...(refreshed.ticket ? { ticket: refreshed.ticket } : {}),
        ...(refreshed.authToken ? { token: refreshed.authToken } : {}),
        requireAuth,
      };
      return currentSnapshot;
    },
  };
}

/**
 * Initialize (or reuse) the persistent root gateway handle for the given game
 * namespace. Safe to call on every client hydration.
 *
 * The socket is KEPT OPEN across navigation when the slug is stable: a same-
 * slug call only refreshes the SSR credentials snapshot the controller reads.
 * Only a slug CHANGE tears down the old namespace (controller included) and
 * acquires the new one. A `null` slug tears down.
 */
export function initRootSocket({
  session,
  gameSlug,
  ticket,
  authToken,
  requireAuth,
  matchId,
  playerId,
}: InitRootSocketArgs): void {
  const manager = getGatewayManager();

  if (gameSlug === null) {
    destroyRootSocket();
    return;
  }

  const nextSnapshot = buildCredentials(session, ticket, authToken, requireAuth);
  const nextMatchId = matchId?.trim() || undefined;
  const nextPlayerId = playerId?.trim() || undefined;

  // Stable slug: keep the existing handle + controller open. Update the
  // snapshot the controller reads on every handshake; the controller object
  // itself stays stable so the library's first-acquire-wins invariant holds.
  if (currentHandle !== null && currentSlug === gameSlug) {
    const previousSnapshot = currentSnapshot;
    currentSnapshot = nextSnapshot;
    currentMatchId = nextMatchId;
    currentPlayerId = nextPlayerId;
    const state = currentHandle.getState();
    if (
      shouldReconnectAfterCredentialUpdate({
        previousSnapshot,
        nextSnapshot,
        status: state.status,
        authenticated: state.authenticated,
      })
    ) {
      currentHandle.reconnect();
    }
    return;
  }

  // Slug changed: release the old namespace before acquiring the new one. The
  // teardown resets the snapshot, so re-assign afterwards.
  destroyRootSocket();
  currentSnapshot = nextSnapshot;
  currentMatchId = nextMatchId;
  currentPlayerId = nextPlayerId;
  currentController = buildCredentialsController(gameSlug);
  const namespaceAlreadyExisted = manager.getState(gameSlug).status !== "idle";
  currentHandle = manager.acquire(gameSlug, { credentials: currentController });
  currentSlug = gameSlug;
  if (
    shouldForceCredentialHandshake(currentHandle, nextSnapshot, {
      includeConnecting: namespaceAlreadyExisted,
    })
  ) {
    currentHandle.reconnect();
  }
}

/**
 * Acquire the shared namespace using the root-installed credentials controller
 * when it exists. Live-match pages should use this helper instead of calling
 * the manager directly so root and route consumers share one auth lifecycle.
 */
export function acquireRootGatewayHandle(gameSlug: PlayableGameSlug): GatewayHandle {
  const manager = getGatewayManager();
  const credentials =
    currentSlug === gameSlug && currentController ? { credentials: currentController } : undefined;
  return manager.acquire(gameSlug, credentials);
}

function shouldReconnectAfterCredentialUpdate({
  previousSnapshot,
  nextSnapshot,
  status,
  authenticated,
}: {
  previousSnapshot: GatewayCredentials;
  nextSnapshot: GatewayCredentials;
  status: ReturnType<GatewayHandle["getState"]>["status"];
  authenticated: boolean;
}): boolean {
  if (nextSnapshot.requireAuth === true && authenticated !== true) {
    const hasCredentials = Boolean(nextSnapshot.ticket || nextSnapshot.token);
    return status !== "connecting" && (status === "connected" || hasCredentials);
  }
  if (status !== "connected") {
    return false;
  }
  return (
    previousSnapshot.ticket !== nextSnapshot.ticket ||
    previousSnapshot.token !== nextSnapshot.token ||
    previousSnapshot.requireAuth !== nextSnapshot.requireAuth
  );
}

/** Tears down the root handle (releases its ref + listeners). */
export function destroyRootSocket(): void {
  if (currentHandle) {
    currentHandle.release();
    currentHandle = null;
  }
  currentSlug = null;
  currentController = null;
  currentSnapshot = {};
  currentMatchId = undefined;
  currentPlayerId = undefined;
}

/** Internal accessor used by tests. */
export function getRootSocketHandleForTests(): GatewayHandle | null {
  return currentHandle;
}

/** Internal accessor used by tests. */
export function getRootSocketControllerForTests(): CredentialsController | null {
  return currentController;
}
