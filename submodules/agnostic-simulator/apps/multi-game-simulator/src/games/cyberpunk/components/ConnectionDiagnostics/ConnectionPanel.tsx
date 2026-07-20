import type { ReactNode } from "react";
import {
  buildSimulatorConnectionDiagnostic,
  type SimulatorConnectionDiagnosticInput,
} from "@tcg/game-page-contract/connection-diagnostic";

import {
  ConnectionPanel as SharedConnectionPanel,
  type ConnectionPanelProps as SharedConnectionPanelProps,
} from "@tcg/simulator-ui";
import { projectConnectionPanelDiagnostic } from "../../../../simulator/connection-panel-projection";
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

  const diagnostic = projectConnectionPanelDiagnostic(connectionDiagnostic);

  return (
    <SharedConnectionPanel
      sides={sides}
      diagnostic={diagnostic}
      copyPayload={
        connectionDiagnostic ? buildSimulatorConnectionDiagnostic(connectionDiagnostic) : undefined
      }
      embedded={embedded}
    />
  );
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

  return {
    side,
    label,
    playerId,
    connection: {
      status: uiStatus === "checking" ? "unknown" : uiStatus,
      latencyMs: connection?.latencyMs,
      disconnectCount: connection?.disconnectCount,
    },
    self,
    claimAvailable,
    onClaimDrop: claimAvailable ? onClaimDrop : undefined,
  };
}
