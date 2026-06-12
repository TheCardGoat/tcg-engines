import { useMemo, useState } from "react";
import { Popover } from "@mantine/core";
import {
  buildSimulatorConnectionDiagnostic,
  type PlayerPresenceDiagnostic,
  type SimulatorConnectionDiagnostic,
  type SimulatorConnectionDiagnosticInput,
} from "@tcg/game-page-contract/connection-diagnostic";

import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import type { PlayerConnectionBySide, PlayerConnectionInfo, Side } from "../../engine/sides";
import {
  connectionStatusLabel,
  connectionStatusMessage,
  connectionUiStatus,
  isConnectionDisconnected,
} from "../../engine/live/playerConnectionState";
import classes from "./ConnectionDiagnosticPopover.module.css";

export interface ConnectionDiagnosticPopoverProps {
  className: string;
  connection?: PlayerConnectionInfo;
  allConnections?: PlayerConnectionBySide;
  diagnostic?: SimulatorConnectionDiagnosticInput;
  label: string;
  side: Side;
  playerId?: string;
  onClaimDrop?: () => void;
  claimAvailable?: boolean;
  self?: boolean;
}

export function ConnectionDiagnosticPopover({
  className,
  connection,
  allConnections,
  diagnostic,
  label,
  side,
  playerId,
  onClaimDrop,
  claimAvailable = isConnectionDisconnected(connection),
  self = false,
}: ConnectionDiagnosticPopoverProps) {
  const [copyFeedback, setCopyFeedback] = useState<"copied" | "failed" | null>(null);
  const status = connectionUiStatus(connection);
  const statusLabel = connectionStatusLabel(status);
  const statusMessage = connectionStatusMessage({ label, self, status });
  const latencyTone = latencyQuality(connection?.latencyMs ?? diagnostic?.connection.latencyMs);
  const diagnosticPayload = useMemo(
    () =>
      createDiagnosticPayload({
        allConnections,
        connection,
        diagnostic,
        label,
        playerId,
        self,
        side,
      }),
    [allConnections, connection, diagnostic, label, playerId, self, side],
  );
  const connectionId =
    diagnosticPayload.connection.connectionId ?? diagnosticPayload.connection.socketId ?? "None";
  const authLabel = diagnosticPayload.connection.authModeLabel ?? "Unknown";
  const reconnects =
    diagnosticPayload.connection.reconnectAttempts ?? connection?.disconnectCount ?? 0;
  const disconnects =
    diagnosticPayload.connection.disconnectCount ??
    sumDisconnects(diagnosticPayload.presence) ??
    connection?.disconnectCount ??
    0;

  async function handleCopyDiagnostic(): Promise<void> {
    const ok = await copyTextToClipboard(safeStringify(diagnosticPayload));
    setCopyFeedback(ok ? "copied" : "failed");
  }

  return (
    <Popover width={360} position="bottom-start" withArrow shadow="md">
      <Popover.Target>
        <button
          type="button"
          className={`${classes.trigger} ${className}`}
          data-status={status}
          aria-label={`${label} connection status: ${statusLabel}`}
        />
      </Popover.Target>
      <Popover.Dropdown className={classes.popover}>
        <div className={classes.body} data-status={status}>
          <div className={classes.header}>
            <div className={classes.headlineGroup}>
              <p className={classes.eyebrow}>Connection health</p>
              <h3 className={classes.title}>{headlineForStatus(status, self)}</h3>
            </div>
            <span className={classes.statusBadge} data-status={status}>
              {statusLabel}
            </span>
          </div>

          <p className={classes.message}>{statusMessage}</p>

          <dl className={classes.metrics}>
            <div className={classes.metric}>
              <dt>Latency</dt>
              <dd>
                {formatLatency(connection?.latencyMs ?? diagnosticPayload.connection.latencyMs)}
                <span className={classes.metricTone}> · {latencyTone}</span>
              </dd>
            </div>
            <div className={classes.metric}>
              <dt>Mode</dt>
              <dd title={authLabel}>{authLabel}</dd>
            </div>
            <div className={classes.metric}>
              <dt>Reconnects</dt>
              <dd>{reconnects}</dd>
            </div>
            <div className={classes.metric}>
              <dt>Disconnects</dt>
              <dd>{disconnects}</dd>
            </div>
          </dl>

          <details className={classes.details}>
            <summary className={classes.summary}>
              Technical details
              <span>Show</span>
            </summary>
            <dl className={classes.detailGrid}>
              <dt>Gateway</dt>
              <dd title={endpointLabel(diagnosticPayload)}>{endpointLabel(diagnosticPayload)}</dd>
              <dt>Socket</dt>
              <dd title={connectionId}>{connectionId}</dd>
              <dt>Last ping</dt>
              <dd>{formatConnectionTime(connection?.lastPingAt)}</dd>
              <dt>Last pong</dt>
              <dd>{formatDateTime(diagnosticPayload.connection.lastPongAt)}</dd>
              {diagnosticPayload.connection.lastError ? (
                <>
                  <dt>Error</dt>
                  <dd title={diagnosticPayload.connection.lastError}>
                    {diagnosticPayload.connection.lastError}
                  </dd>
                </>
              ) : null}
            </dl>
          </details>

          <div className={classes.actions}>
            <button
              type="button"
              className={`${classes.action} ${classes.secondaryAction}`}
              onClick={handleCopyDiagnostic}
            >
              Copy diagnostic JSON
            </button>
            {claimAvailable && onClaimDrop ? (
              <button type="button" className={classes.action} onClick={onClaimDrop}>
                Claim match
              </button>
            ) : null}
          </div>
          {copyFeedback ? (
            <p
              className={`${classes.feedback} ${
                copyFeedback === "failed" ? classes.feedbackError : ""
              }`}
            >
              {copyFeedback === "copied" ? "Copied JSON to clipboard." : "Clipboard unavailable."}
            </p>
          ) : null}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

function createDiagnosticPayload({
  allConnections,
  connection,
  diagnostic,
  label,
  playerId,
  self,
  side,
}: {
  allConnections?: PlayerConnectionBySide;
  connection?: PlayerConnectionInfo;
  diagnostic?: SimulatorConnectionDiagnosticInput;
  label: string;
  playerId?: string;
  self: boolean;
  side: Side;
}): SimulatorConnectionDiagnostic {
  const existingPresence = diagnostic?.presence ?? [];
  const currentPresence = presenceForConnections(
    allConnections,
    side,
    connection,
    label,
    playerId,
    self,
  );
  return buildSimulatorConnectionDiagnostic({
    gameSlug: "cyberpunk",
    route:
      typeof window === "undefined" ? "" : `${window.location.pathname}${window.location.search}`,
    endpoint: { realtimeConfigured: false },
    connection: { status: connectionUiStatus(connection) },
    ...diagnostic,
    playerId: playerId ?? diagnostic?.playerId,
    playerSide: side,
    presence: mergePresence(existingPresence, currentPresence),
  });
}

function presenceForConnections(
  allConnections: PlayerConnectionBySide | undefined,
  side: Side,
  fallbackConnection: PlayerConnectionInfo | undefined,
  label: string,
  playerId: string | undefined,
  self: boolean,
): PlayerPresenceDiagnostic[] {
  const source = allConnections ?? { [side]: fallbackConnection };
  return (Object.entries(source) as Array<[Side, PlayerConnectionInfo | undefined]>).map(
    ([entrySide, info]) => ({
      side: entrySide,
      playerId: entrySide === side ? playerId : undefined,
      label: entrySide === side ? label : entrySide,
      status: connectionUiStatus(info),
      connected: info?.connected,
      disconnectedAt: info?.disconnectedAt,
      lastPingAt: formatConnectionIso(info?.lastPingAt),
      latencyMs: info?.latencyMs,
      disconnectCount: info?.disconnectCount,
      self: entrySide === side ? self : undefined,
    }),
  );
}

function mergePresence(
  existing: PlayerPresenceDiagnostic[],
  current: PlayerPresenceDiagnostic[],
): PlayerPresenceDiagnostic[] {
  const merged = new Map<string, PlayerPresenceDiagnostic>();
  for (const entry of existing) {
    merged.set(entry.side ?? entry.playerId ?? String(merged.size), entry);
  }
  for (const entry of current) {
    merged.set(entry.side ?? entry.playerId ?? String(merged.size), {
      ...merged.get(entry.side ?? entry.playerId ?? ""),
      ...entry,
    });
  }
  return [...merged.values()];
}

function headlineForStatus(status: ReturnType<typeof connectionUiStatus>, self: boolean): string {
  if (status === "connected") return self ? "Match server is live" : "Rival presence is live";
  if (status === "reconnecting") return self ? "Rejoining match server" : "Rival is reconnecting";
  if (status === "disconnected") return self ? "Match server disconnected" : "Rival disconnected";
  return "Presence check pending";
}

function latencyQuality(latencyMs: number | undefined): string {
  if (latencyMs == null) return "Waiting";
  if (latencyMs <= 150) return "Fast";
  if (latencyMs <= 400) return "Stable";
  return "Slow";
}

function formatLatency(latencyMs: number | undefined): string {
  return typeof latencyMs === "number" ? `${latencyMs}ms` : "Measuring";
}

function formatConnectionTime(value: number | undefined): string {
  if (!value) return "None";
  return new Date(value).toLocaleTimeString();
}

function formatConnectionIso(value: number | undefined): string | undefined {
  return value ? new Date(value).toISOString() : undefined;
}

function formatDateTime(value: string | undefined): string {
  if (!value) return "None";
  return new Date(value).toLocaleTimeString();
}

function endpointLabel(diagnostic: SimulatorConnectionDiagnostic): string {
  const endpoint = diagnostic.endpoint;
  if (!endpoint.realtimeConfigured) return "Not configured";
  return [endpoint.origin, endpoint.namespace].filter(Boolean).join("") || "Configured";
}

function sumDisconnects(presence: PlayerPresenceDiagnostic[] | undefined): number | undefined {
  if (!presence?.length) return undefined;
  return presence.reduce((sum, entry) => sum + (entry.disconnectCount ?? 0), 0);
}
