import type {
  SimulatorConnectionDiagnostic,
  SimulatorConnectionDiagnosticInput,
} from "@tcg/game-page-contract/connection-diagnostic";
import type { ConnectionPanelDiagnostic } from "@tcg/simulator-ui";

type DiagnosticSource = SimulatorConnectionDiagnostic | SimulatorConnectionDiagnosticInput;

/**
 * Adapts the page-level support diagnostic into the smaller presentation
 * contract used by the shared simulator UI. The app integration owns this
 * mapping so simulator-ui stays independent from page and transport contracts.
 */
export function projectConnectionPanelDiagnostic(
  input: DiagnosticSource | undefined,
): ConnectionPanelDiagnostic | undefined {
  if (!input) return undefined;

  const connection = input.connection;
  return {
    connection: {
      connectionId: connection.connectionId,
      socketId: connection.socketId,
      authModeLabel: connection.authModeLabel,
      authenticated: connection.authenticated,
      authStatus: connection.authStatus,
      authFailureReason: connection.authFailureReason,
      reconnectAttempts: connection.reconnectAttempts,
      disconnectCount: connection.disconnectCount,
      latencyMs: connection.latencyMs,
      lastPingAt: connection.lastPingAt,
      lastPongAt: connection.lastPongAt,
      lastHeartbeatSentAt: connection.lastHeartbeatSentAt,
      lastHeartbeatAckAt: connection.lastHeartbeatAckAt,
    },
    presence: input.presence
      ?.filter(
        (presence): presence is typeof presence & { side: "player" | "opponent" } =>
          presence.side === "player" || presence.side === "opponent",
      )
      .map((presence) => ({
        side: presence.side,
        status: presence.status,
        latencyMs: presence.latencyMs,
      })),
    events: input.events
      ?.filter(
        (event): event is typeof event & { message: string } => typeof event.message === "string",
      )
      .map((event) => ({ at: event.at, message: event.message })),
  };
}
