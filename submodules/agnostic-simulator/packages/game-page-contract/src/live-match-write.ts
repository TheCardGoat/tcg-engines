import type { GatewayConnectionState, GatewayHandle } from "@tcg/gateway-client";
import type { LiveMatchCapabilities, ResolvedMatchViewer } from "./page-data.js";

export type LiveMatchWriteGateReason =
  | "not_connected"
  | "not_authenticated"
  | "emit_held"
  | "game_complete"
  | "spectator"
  | "cannot_act"
  | "game_mismatch";

export type LiveMatchWriteGate = { ok: true } | { ok: false; reason: LiveMatchWriteGateReason };

export const LIVE_MATCH_OLDER_BOARD_FEEDBACK = {
  title: "Older board",
  message: "This update was based on an older board.",
} as const;

export const LIVE_MATCH_SYNCING_BOARD_COPY = "Syncing live board" as const;

export function canEmitLiveMatchWrite(input: {
  connection: {
    status: GatewayConnectionState["status"];
    authenticated: boolean;
    authStatus: GatewayConnectionState["authStatus"];
    authFailureReason: GatewayConnectionState["authFailureReason"];
    wouldHoldEmit: boolean;
  };
  viewer: Pick<ResolvedMatchViewer, "role"> & { permissions: { act: boolean } };
  capabilities: Pick<LiveMatchCapabilities, "actions">;
  gameStatus: "in_progress" | "completed";
  bootstrapGameId: string;
  emitGameId: string;
}): LiveMatchWriteGate {
  if (input.emitGameId !== input.bootstrapGameId) {
    return { ok: false, reason: "game_mismatch" };
  }
  if (input.viewer.role === "spectator") {
    return { ok: false, reason: "spectator" };
  }
  if (input.gameStatus === "completed") {
    return { ok: false, reason: "game_complete" };
  }
  if (!input.viewer.permissions.act || !input.capabilities.actions) {
    return { ok: false, reason: "cannot_act" };
  }
  if (input.connection.status !== "connected") {
    return { ok: false, reason: "not_connected" };
  }
  if (!input.connection.authenticated || input.connection.authStatus !== "ok") {
    return { ok: false, reason: "not_authenticated" };
  }
  if (
    input.connection.wouldHoldEmit ||
    input.connection.authFailureReason === "viewer_scope_expired"
  ) {
    return { ok: false, reason: "emit_held" };
  }
  return { ok: true };
}

export function canEmitLiveMatchWriteFromHandle(input: {
  handle: Pick<GatewayHandle, "getState" | "wouldHoldEmit"> | null;
  viewer: Pick<ResolvedMatchViewer, "role"> & { permissions: { act: boolean } };
  capabilities: Pick<LiveMatchCapabilities, "actions">;
  gameStatus: "in_progress" | "completed";
  bootstrapGameId: string;
  emitGameId: string;
}): LiveMatchWriteGate {
  if (!input.handle) {
    return { ok: false, reason: "not_connected" };
  }
  const connection = input.handle.getState();
  return canEmitLiveMatchWrite({
    connection: {
      status: connection.status,
      authenticated: connection.authenticated,
      authStatus: connection.authStatus,
      authFailureReason: connection.authFailureReason,
      wouldHoldEmit:
        typeof input.handle.wouldHoldEmit === "function" ? input.handle.wouldHoldEmit() : false,
    },
    viewer: input.viewer,
    capabilities: input.capabilities,
    gameStatus: input.gameStatus,
    bootstrapGameId: input.bootstrapGameId,
    emitGameId: input.emitGameId,
  });
}

export function describeLiveMatchWriteGate(reason: LiveMatchWriteGateReason): {
  title: string;
  message: string;
} {
  switch (reason) {
    case "not_connected":
      return {
        title: "Action not sent",
        message: "The match server is reconnecting. Try the action again in a moment.",
      };
    case "not_authenticated":
      return {
        title: "Action not sent",
        message: "The match connection is authenticating. Try the action again in a moment.",
      };
    case "emit_held":
      return {
        title: "Match session is refreshing",
        message: "Try the action again in a moment.",
      };
    case "game_complete":
      return {
        title: "This game has ended",
        message:
          "The final result has been recorded. View the match summary or return to matchmaking.",
      };
    case "spectator":
      return {
        title: "You're spectating",
        message: "Spectators can watch this match but cannot play actions.",
      };
    case "cannot_act":
      return {
        title: "Actions unavailable",
        message: "This match session is read-only. Refresh the match or return to matchmaking.",
      };
    case "game_mismatch":
      return {
        title: "This is no longer the current game",
        message: "Open the current game from the match page before trying another action.",
      };
  }
}

/** Live-version catch-up. HTTP bootstrap does not seed knownServerVersion. */
export function shouldShowLiveBoardSyncing(input: {
  knownServerVersion: number | null;
  localVersion: number;
}): boolean {
  return input.knownServerVersion === null || input.knownServerVersion > input.localVersion;
}
