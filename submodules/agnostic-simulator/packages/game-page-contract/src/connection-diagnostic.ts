export const SIMULATOR_CONNECTION_DIAGNOSTIC_VERSION = 1 as const;

export type SimulatorConnectionStatus =
  | "idle"
  | "checking"
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting"
  | "unavailable";

export interface ConnectionEndpointDiagnostic {
  realtimeConfigured: boolean;
  origin?: string;
  namespace?: string;
  path?: string;
  transport?: string;
}

export interface PlayerPresenceDiagnostic {
  side?: string;
  playerId?: string;
  label?: string;
  status: "connected" | "reconnecting" | "disconnected" | "checking" | "unknown";
  connected?: boolean;
  disconnectedAt?: string;
  lastPingAt?: string;
  latencyMs?: number;
  disconnectCount?: number;
  self?: boolean;
}

export interface ConnectionDiagnosticEvent {
  at: string;
  type: string;
  message?: string;
  details?: unknown;
}

export interface SimulatorConnectionDiagnostic {
  schemaVersion: typeof SIMULATOR_CONNECTION_DIAGNOSTIC_VERSION;
  generatedAt: string;
  gameSlug: string;
  route: string;
  matchId?: string;
  gameId?: string;
  playerId?: string;
  playerSide?: string;
  endpoint: ConnectionEndpointDiagnostic;
  connection: {
    status: SimulatorConnectionStatus;
    connectionId?: string;
    socketId?: string;
    authModeLabel?: string;
    authenticated?: boolean;
    latencyMs?: number;
    lastPongAt?: string;
    lastPingAt?: string;
    reconnectAttempts?: number;
    disconnectCount?: number;
    lastError?: string;
    serverInitiatedClose?: boolean;
  };
  presence?: PlayerPresenceDiagnostic[];
  events?: ConnectionDiagnosticEvent[];
}

export type SimulatorConnectionDiagnosticInput = Omit<
  SimulatorConnectionDiagnostic,
  "schemaVersion" | "generatedAt" | "events"
> & {
  generatedAt?: string | number | Date;
  events?: ConnectionDiagnosticEvent[];
};

const SECRET_KEY_PATTERN = /(cookie|jwt|secret|session|ticket|token)/i;
const MAX_EVENTS = 20;

export function buildSimulatorConnectionDiagnostic(
  input: SimulatorConnectionDiagnosticInput,
): SimulatorConnectionDiagnostic {
  return pruneUndefined({
    schemaVersion: SIMULATOR_CONNECTION_DIAGNOSTIC_VERSION,
    generatedAt: toIsoString(input.generatedAt ?? new Date()),
    gameSlug: input.gameSlug,
    route: sanitizeRoute(input.route),
    matchId: input.matchId,
    gameId: input.gameId,
    playerId: input.playerId,
    playerSide: input.playerSide,
    endpoint: sanitizeEndpoint(input.endpoint),
    connection: sanitizeConnection(input.connection),
    presence: input.presence?.map(sanitizePresence),
    events: input.events?.slice(-MAX_EVENTS).map(sanitizeEvent),
  });
}

export function stringifySimulatorConnectionDiagnostic(
  input: SimulatorConnectionDiagnosticInput | SimulatorConnectionDiagnostic,
): string {
  const diagnostic =
    "schemaVersion" in input && input.schemaVersion === SIMULATOR_CONNECTION_DIAGNOSTIC_VERSION
      ? input
      : buildSimulatorConnectionDiagnostic(input);
  return JSON.stringify(diagnostic, null, 2);
}

export function redactsSimulatorConnectionDiagnostic(value: unknown): unknown {
  return sanitizeUnknown(value);
}

function sanitizeEndpoint(endpoint: ConnectionEndpointDiagnostic): ConnectionEndpointDiagnostic {
  return pruneUndefined({
    realtimeConfigured: Boolean(endpoint.realtimeConfigured),
    origin: endpoint.origin,
    namespace: endpoint.namespace,
    path: endpoint.path,
    transport: endpoint.transport,
  });
}

function sanitizeConnection(
  connection: SimulatorConnectionDiagnostic["connection"],
): SimulatorConnectionDiagnostic["connection"] {
  return pruneUndefined({
    status: connection.status,
    connectionId: connection.connectionId,
    socketId: connection.socketId,
    authModeLabel: connection.authModeLabel,
    authenticated: connection.authenticated,
    latencyMs: connection.latencyMs,
    lastPongAt: connection.lastPongAt,
    lastPingAt: connection.lastPingAt,
    reconnectAttempts: connection.reconnectAttempts,
    disconnectCount: connection.disconnectCount,
    lastError: connection.lastError,
    serverInitiatedClose: connection.serverInitiatedClose,
  });
}

function sanitizePresence(presence: PlayerPresenceDiagnostic): PlayerPresenceDiagnostic {
  return pruneUndefined({
    side: presence.side,
    playerId: presence.playerId,
    label: presence.label,
    status: presence.status,
    connected: presence.connected,
    disconnectedAt: presence.disconnectedAt,
    lastPingAt: presence.lastPingAt,
    latencyMs: presence.latencyMs,
    disconnectCount: presence.disconnectCount,
    self: presence.self,
  });
}

function sanitizeEvent(event: ConnectionDiagnosticEvent): ConnectionDiagnosticEvent {
  return pruneUndefined({
    at: event.at,
    type: event.type,
    message: event.message,
    details: sanitizeUnknown(event.details),
  });
}

function sanitizeUnknown(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeUnknown);
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  const output: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (SECRET_KEY_PATTERN.test(key)) {
      output[key] = "[redacted]";
      continue;
    }
    output[key] = sanitizeUnknown(child);
  }
  return output;
}

function sanitizeRoute(route: string): string {
  try {
    const parsed = new URL(route, "https://diagnostic.local");
    for (const key of parsed.searchParams.keys()) {
      if (SECRET_KEY_PATTERN.test(key)) {
        parsed.searchParams.set(key, "[redacted]");
      }
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return route.replace(
      /([?&][^=]*(?:auth(?:token)?|cookie|jwt|secret|session|ticket|token)[^=]*=)[^&]*/gi,
      "$1[redacted]",
    );
  }
}

function toIsoString(value: string | number | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "number") {
    return new Date(value).toISOString();
  }
  return value;
}

function pruneUndefined<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}
