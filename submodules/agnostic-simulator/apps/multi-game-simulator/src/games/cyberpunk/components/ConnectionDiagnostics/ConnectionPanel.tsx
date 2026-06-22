import type { ReactNode } from "react";
import type { SimulatorConnectionDiagnosticInput } from "@tcg/game-page-contract/connection-diagnostic";

import {
  ConnectionPanel as SharedConnectionPanel,
  type ConnectionPanelProps as SharedConnectionPanelProps,
} from "@tcg/simulator-ui";
import { useEngineOptional } from "../../engine/engineContext";
import {
  isConnectionDisconnected,
  connectionUiStatus,
} from "../../engine/live/playerConnectionState";
import {
  otherSide,
  type PlayerConnectionBySide,
  type PlayerIdentityBySide,
} from "../../engine/sides";

export interface ConnectionPanelProps {
  playerIdentities?: PlayerIdentityBySide;
  playerConnections?: PlayerConnectionBySide;
  connectionDiagnostic?: SimulatorConnectionDiagnosticInput;
  onClaimRivalDrop?: () => void;
  embedded?: boolean;
}

export function ConnectionPanel({
  playerIdentities,
  playerConnections,
  connectionDiagnostic,
  onClaimRivalDrop,
  embedded = false,
}: ConnectionPanelProps): ReactNode {
  const engine = useEngineOptional();
  const humanSide = engine?.humanSide ?? "player";
  const rivalSide = otherSide(humanSide);

  const sides: SharedConnectionPanelProps["sides"] = [
    buildSide({
      side: humanSide,
      label: playerIdentities?.[humanSide]?.displayName ?? "You",
      playerId: playerIdentities?.[humanSide]?.id,
      connection: playerConnections?.[humanSide],
      self: true,
    }),
    buildSide({
      side: rivalSide,
      label: playerIdentities?.[rivalSide]?.displayName ?? "Rival",
      playerId: playerIdentities?.[rivalSide]?.id,
      connection: playerConnections?.[rivalSide],
      claimAvailable: isConnectionDisconnected(playerConnections?.[rivalSide]),
      onClaimDrop: onClaimRivalDrop,
    }),
  ];

  const diagnosticConnection = connectionDiagnostic?.connection;
  const diagnostic: SharedConnectionPanelProps["diagnostic"] = connectionDiagnostic
    ? {
        connection: diagnosticConnection
          ? {
              connectionId: diagnosticConnection.connectionId,
              socketId: diagnosticConnection.socketId,
              authModeLabel: diagnosticConnection.authModeLabel,
              reconnectAttempts: diagnosticConnection.reconnectAttempts,
              disconnectCount: diagnosticConnection.disconnectCount,
              latencyMs: diagnosticConnection.latencyMs,
            }
          : undefined,
        presence: connectionDiagnostic.presence
          ?.filter(
            (p): p is typeof p & { side: "player" | "opponent" } =>
              p.side === "player" || p.side === "opponent",
          )
          .map((p) => ({
            side: p.side,
            status: p.status,
            latencyMs: p.latencyMs,
          })),
        events: connectionDiagnostic.events
          ?.filter((e): e is typeof e & { message: string } => typeof e.message === "string")
          .map((e) => ({
            at: e.at,
            message: e.message,
          })),
      }
    : undefined;

  return <SharedConnectionPanel sides={sides} diagnostic={diagnostic} embedded={embedded} />;
}

function buildSide({
  side,
  label,
  playerId,
  connection,
  self = false,
  claimAvailable = false,
  onClaimDrop,
}: {
  side: "player" | "opponent";
  label: string;
  playerId?: string;
  connection?: PlayerConnectionBySide[typeof side];
  self?: boolean;
  claimAvailable?: boolean;
  onClaimDrop?: () => void;
}): SharedConnectionPanelProps["sides"][number] {
  const uiStatus = connectionUiStatus(connection);
  const status: "connected" | "reconnecting" | "disconnected" =
    uiStatus === "connected" || uiStatus === "reconnecting" ? uiStatus : "disconnected";

  return {
    side,
    label,
    playerId,
    connection: {
      status,
      latencyMs: connection?.latencyMs,
      disconnectCount: connection?.disconnectCount,
    },
    self,
    claimAvailable,
    onClaimDrop: claimAvailable ? onClaimDrop : undefined,
  };
}
