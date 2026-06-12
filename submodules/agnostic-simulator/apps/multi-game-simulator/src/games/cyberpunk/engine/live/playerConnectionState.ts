import type {
  PlayerConnectionBySide,
  PlayerConnectionInfo,
  PlayerConnectionStatus,
  Side,
} from "../sides";

export type PlayerConnectionUiStatus = PlayerConnectionStatus | "checking";

export interface ActorIdsBySide {
  player?: string;
  opponent?: string;
}

interface PresencePlayer {
  id: string;
  connected: boolean;
  disconnectedAt?: string;
}

const INTERRUPTED_STATUSES = new Set<PlayerConnectionUiStatus>(["reconnecting", "disconnected"]);

export function connectionUiStatus(
  connection: PlayerConnectionInfo | undefined,
): PlayerConnectionUiStatus {
  if (connection?.status) {
    return connection.status;
  }
  if (connection?.connected === true) {
    return "connected";
  }
  if (connection?.connected === false) {
    return "disconnected";
  }
  return "checking";
}

export function connectionStatusLabel(status: PlayerConnectionUiStatus): string {
  switch (status) {
    case "connected":
      return "Connected";
    case "reconnecting":
      return "Reconnecting";
    case "disconnected":
      return "Disconnected";
    case "checking":
      return "Checking";
  }
}

export function connectionStatusMessage({
  label,
  self,
  status,
}: {
  label: string;
  self: boolean;
  status: PlayerConnectionUiStatus;
}): string {
  if (status === "reconnecting") {
    return self ? "You are reconnecting to the match server" : `${label} is reconnecting`;
  }
  if (status === "disconnected") {
    return self ? "You have disconnected" : "Opponent disconnected";
  }
  if (status === "checking") {
    return "Presence check pending";
  }
  return self ? "You are connected to the match server" : `${label} is connected`;
}

export function isConnectionDisconnected(connection: PlayerConnectionInfo | undefined): boolean {
  return connectionUiStatus(connection) === "disconnected";
}

export function markLocalConnectionStatus(
  current: PlayerConnectionBySide,
  side: Side | null,
  status: PlayerConnectionStatus,
  nowIso = new Date().toISOString(),
): PlayerConnectionBySide {
  if (!side) {
    return current;
  }
  const previous = current[side];
  const previousStatus = connectionUiStatus(previous);
  const interrupted = status !== "connected";
  const wasInterrupted = INTERRUPTED_STATUSES.has(previousStatus);
  return {
    ...current,
    [side]: {
      ...previous,
      status,
      connected: status === "connected",
      disconnectedAt: interrupted ? (previous?.disconnectedAt ?? nowIso) : undefined,
      disconnectCount:
        interrupted && !wasInterrupted
          ? (previous?.disconnectCount ?? 0) + 1
          : (previous?.disconnectCount ?? 0),
    },
  };
}

export function recordLocalConnectionHeartbeat(
  current: PlayerConnectionBySide,
  side: Side | null,
  receivedAt: number,
  latencyMs: number | undefined,
): PlayerConnectionBySide {
  if (!side) {
    return current;
  }
  const previous = current[side];
  return {
    ...current,
    [side]: {
      ...previous,
      status: "connected",
      connected: true,
      disconnectedAt: undefined,
      disconnectCount: previous?.disconnectCount ?? 0,
      lastPingAt: receivedAt,
      latencyMs: typeof latencyMs === "number" ? latencyMs : previous?.latencyMs,
    },
  };
}

export function applyPresencePlayers(
  current: PlayerConnectionBySide,
  actorIds: ActorIdsBySide | undefined,
  players: PresencePlayer[],
): PlayerConnectionBySide {
  if (!actorIds) {
    return current;
  }
  let next: PlayerConnectionBySide = current;
  for (const player of players) {
    const side = sideForActorId(actorIds, player.id);
    if (!side) {
      continue;
    }
    next = applyPresenceForSide(next, side, player.connected, player.disconnectedAt);
  }
  return next;
}

export function applyPresenceChange(
  current: PlayerConnectionBySide,
  actorIds: ActorIdsBySide | undefined,
  payload: unknown,
): PlayerConnectionBySide {
  if (!actorIds || !payload || typeof payload !== "object") {
    return current;
  }
  const record = payload as Record<string, unknown>;
  if (
    typeof record.playerId !== "string" ||
    (record.status !== "connected" && record.status !== "disconnected")
  ) {
    return current;
  }
  const side = sideForActorId(actorIds, record.playerId);
  if (!side) {
    return current;
  }
  const disconnectedAt =
    typeof record.disconnectedAt === "string" ? record.disconnectedAt : undefined;
  return applyPresenceForSide(current, side, record.status === "connected", disconnectedAt);
}

function applyPresenceForSide(
  current: PlayerConnectionBySide,
  side: Side,
  connected: boolean,
  disconnectedAt: string | undefined,
): PlayerConnectionBySide {
  const previous = current[side];
  const wasDisconnected = connectionUiStatus(previous) === "disconnected";
  return {
    ...current,
    [side]: {
      ...previous,
      status: connected ? "connected" : "disconnected",
      connected,
      disconnectedAt: connected ? undefined : (disconnectedAt ?? previous?.disconnectedAt),
      disconnectCount:
        !connected && !wasDisconnected
          ? (previous?.disconnectCount ?? 0) + 1
          : (previous?.disconnectCount ?? 0),
    },
  };
}

function sideForActorId(actorIds: ActorIdsBySide, actorId: string): Side | null {
  if (!actorId) {
    return null;
  }
  if (actorIds.player === actorId) {
    return "player";
  }
  if (actorIds.opponent === actorId) {
    return "opponent";
  }
  return null;
}
