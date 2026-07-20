import { useEffect, useId, useMemo, useRef, useState } from "react";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import classes from "./ConnectionPanel.module.css";

export interface ConnectionPanelProps {
  embedded?: boolean;
  indicatorOnly?: boolean;
  popoverAlign?: "start" | "end";
  copyPayload?: unknown;
  sides: ReadonlyArray<{
    side: "player" | "opponent";
    label: string;
    playerId?: string;
    connection?: {
      status?: ConnectionPanelConnectionStatus;
      latencyMs?: number;
      disconnectCount?: number;
    };
    self?: boolean;
    claimAvailable?: boolean;
    onClaimDrop?: () => void;
  }>;
  diagnostic?: {
    connection?: {
      connectionId?: string;
      socketId?: string;
      authModeLabel?: string;
      authenticated?: boolean;
      authStatus?: "ok" | "refreshing" | "failed";
      authFailureReason?: string;
      reconnectAttempts?: number;
      disconnectCount?: number;
      latencyMs?: number;
      lastPingAt?: string;
      lastPongAt?: string;
      lastHeartbeatSentAt?: string;
      lastHeartbeatAckAt?: string;
    };
    presence?: ReadonlyArray<{
      side: "player" | "opponent";
      status?: string;
      latencyMs?: number;
    }>;
    events?: ReadonlyArray<{ at: string; message: string }>;
  };
}

export type ConnectionPanelDiagnostic = NonNullable<ConnectionPanelProps["diagnostic"]>;
export type ConnectionPanelConnectionStatus =
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "unknown";

export function ConnectionPanel({
  sides,
  diagnostic,
  embedded = false,
  indicatorOnly = false,
  popoverAlign = "start",
  copyPayload,
}: ConnectionPanelProps) {
  return (
    <section
      className={`${classes.panel} ${embedded ? classes.panelEmbedded : ""} ${
        popoverAlign === "end" ? classes.popoverEnd : ""
      }`}
      aria-label="Connection diagnostics"
    >
      {sides.map((side) => (
        <SideConnection
          key={side.side}
          side={side}
          diagnostic={diagnostic}
          indicatorOnly={indicatorOnly}
          copyPayload={copyPayload}
        />
      ))}
    </section>
  );
}

function SideConnection({
  side,
  diagnostic,
  indicatorOnly,
  copyPayload,
}: {
  side: ConnectionPanelProps["sides"][number];
  diagnostic?: ConnectionPanelProps["diagnostic"];
  indicatorOnly: boolean;
  copyPayload?: unknown;
}) {
  const status = side.connection?.status ?? "unknown";
  return (
    <div className={classes.row} data-side={side.side} data-connection-status={status}>
      <ConnectionPopover side={side} diagnostic={diagnostic} copyPayload={copyPayload} />
      {indicatorOnly ? null : <span className={classes.label}>{side.label}</span>}
    </div>
  );
}

function ConnectionPopover({
  side,
  diagnostic,
  copyPayload,
}: {
  side: ConnectionPanelProps["sides"][number];
  diagnostic?: ConnectionPanelProps["diagnostic"];
  copyPayload?: unknown;
}) {
  const [open, setOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<"copied" | "failed" | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const status = side.connection?.status ?? "unknown";
  const latencyMs = side.connection?.latencyMs ?? diagnostic?.connection?.latencyMs;
  const reconnectAttempts = diagnostic?.connection?.reconnectAttempts ?? 0;
  const disconnectCount =
    diagnostic?.connection?.disconnectCount ?? side.connection?.disconnectCount ?? 0;
  const lastHeartbeatAt =
    diagnostic?.connection?.lastHeartbeatAckAt ?? diagnostic?.connection?.lastHeartbeatSentAt;

  const payload = useMemo(
    () =>
      copyPayload ?? {
        connection: {
          connectionId: diagnostic?.connection?.connectionId,
          socketId: diagnostic?.connection?.socketId,
          authModeLabel: diagnostic?.connection?.authModeLabel,
          authenticated: diagnostic?.connection?.authenticated,
          authStatus: diagnostic?.connection?.authStatus,
          authFailureReason: diagnostic?.connection?.authFailureReason,
          reconnectAttempts,
          disconnectCount,
          latencyMs,
          lastPingAt: diagnostic?.connection?.lastPingAt,
          lastPongAt: diagnostic?.connection?.lastPongAt,
          lastHeartbeatSentAt: diagnostic?.connection?.lastHeartbeatSentAt,
          lastHeartbeatAckAt: diagnostic?.connection?.lastHeartbeatAckAt,
        },
        presence: diagnostic?.presence ?? [],
        events: diagnostic?.events ?? [],
      },
    [copyPayload, diagnostic, disconnectCount, latencyMs, reconnectAttempts],
  );

  useEffect(() => {
    if (!open) return;
    popoverRef.current?.focus();
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popoverRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(safeStringify(payload));
    setCopyFeedback(ok ? "copied" : "failed");
  };

  return (
    <div className={classes.popoverWrap}>
      <button
        ref={triggerRef}
        type="button"
        className={classes.dot}
        data-status={status}
        aria-label={`${side.label} connection status: ${statusLabel(status)}`}
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`${classes.dotVisual} ${classes[status]}`} aria-hidden="true" />
      </button>
      {open ? (
        <div
          ref={popoverRef}
          id={popoverId}
          className={classes.popover}
          data-status={status}
          role="dialog"
          aria-label={`${side.label} connection details`}
          tabIndex={-1}
        >
          <div className={classes.popoverHeader}>
            <div>
              <p className={classes.eyebrow}>Connection health</p>
              <h3 className={classes.title}>{headlineForStatus(status, side.self)}</h3>
            </div>
            <span className={`${classes.statusBadge} ${classes[status]}`} data-status={status}>
              {statusLabel(status)}
            </span>
          </div>

          <p className={classes.message}>{statusMessage(status, side.label, side.self)}</p>

          <dl className={classes.metrics}>
            <div className={classes.metric}>
              <dt>Latency</dt>
              <dd>
                {formatLatency(latencyMs)}
                <span className={classes.metricTone}> · {latencyQuality(latencyMs)}</span>
              </dd>
            </div>
            <div className={classes.metric}>
              <dt>Mode</dt>
              <dd title={diagnostic?.connection?.authModeLabel ?? "Unknown"}>
                {diagnostic?.connection?.authModeLabel ?? "Unknown"}
              </dd>
            </div>
            <div className={classes.metric}>
              <dt>Heartbeat</dt>
              <dd title={lastHeartbeatAt ?? "Waiting for heartbeat"}>
                {formatAge(lastHeartbeatAt)}
              </dd>
            </div>
            <div className={classes.metric}>
              <dt>Auth</dt>
              <dd title={formatAuthDetail(diagnostic?.connection)}>
                {formatAuthStatus(diagnostic?.connection)}
              </dd>
            </div>
            <div className={classes.metric}>
              <dt>Reconnects</dt>
              <dd>{reconnectAttempts}</dd>
            </div>
            <div className={classes.metric}>
              <dt>Disconnects</dt>
              <dd>{disconnectCount}</dd>
            </div>
          </dl>

          <details className={classes.details}>
            <summary className={classes.summary}>
              Technical details
              <span>Show</span>
            </summary>
            <dl className={classes.detailGrid}>
              <dt>Connection</dt>
              <dd title={diagnostic?.connection?.connectionId ?? "None"}>
                {diagnostic?.connection?.connectionId ?? "None"}
              </dd>
              <dt>Socket</dt>
              <dd title={diagnostic?.connection?.socketId ?? "None"}>
                {diagnostic?.connection?.socketId ?? "None"}
              </dd>
              <dt>Last heartbeat sent</dt>
              <dd title={diagnostic?.connection?.lastHeartbeatSentAt ?? "None"}>
                {formatTimestamp(diagnostic?.connection?.lastHeartbeatSentAt)}
              </dd>
              <dt>Last heartbeat ack</dt>
              <dd title={diagnostic?.connection?.lastHeartbeatAckAt ?? "None"}>
                {formatTimestamp(diagnostic?.connection?.lastHeartbeatAckAt)}
              </dd>
              <dt>Last ping</dt>
              <dd title={diagnostic?.connection?.lastPingAt ?? "None"}>
                {formatTimestamp(diagnostic?.connection?.lastPingAt)}
              </dd>
              <dt>Last pong</dt>
              <dd title={diagnostic?.connection?.lastPongAt ?? "None"}>
                {formatTimestamp(diagnostic?.connection?.lastPongAt)}
              </dd>
              <dt>Auth reason</dt>
              <dd title={diagnostic?.connection?.authFailureReason ?? "None"}>
                {diagnostic?.connection?.authFailureReason ?? "None"}
              </dd>
              {diagnostic?.events && diagnostic.events.length > 0 ? (
                <>
                  <dt>Events</dt>
                  <dd>
                    <ul className={classes.eventList}>
                      {diagnostic.events.slice(-5).map((event, i) => (
                        <li key={i}>
                          <time>{event.at}</time> {event.message}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </>
              ) : null}
            </dl>
          </details>

          <div className={classes.actions}>
            <button
              type="button"
              className={`${classes.action} ${classes.secondaryAction}`}
              onClick={handleCopy}
            >
              Copy diagnostic JSON
            </button>
            {side.claimAvailable && side.onClaimDrop ? (
              <button type="button" className={classes.action} onClick={side.onClaimDrop}>
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
      ) : null}
    </div>
  );
}

function statusLabel(status: ConnectionPanelConnectionStatus): string {
  if (status === "connected") return "Connected";
  if (status === "reconnecting") return "Reconnecting";
  if (status === "disconnected") return "Disconnected";
  return "Status unknown";
}

function headlineForStatus(status: ConnectionPanelConnectionStatus, self?: boolean): string {
  if (status === "connected") return self ? "Match server is live" : "Rival presence is live";
  if (status === "reconnecting") return self ? "Rejoining match server" : "Rival is reconnecting";
  if (status === "disconnected") return self ? "Match server disconnected" : "Rival disconnected";
  return "Presence check pending";
}

function statusMessage(
  status: ConnectionPanelConnectionStatus,
  label: string,
  self?: boolean,
): string {
  if (status === "connected") {
    return self
      ? "Your connection to the match server is stable."
      : `${label} is connected to the match.`;
  }
  if (status === "reconnecting") {
    return self
      ? "Trying to reconnect to the match server."
      : `${label} is reconnecting to the match.`;
  }
  if (status === "disconnected") {
    return self
      ? "You are disconnected from the match server."
      : `${label} is disconnected from the match.`;
  }
  return "Waiting for live presence data.";
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

function formatAge(value: string | undefined): string {
  if (!value) return "Waiting";
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Recorded";
  const ageMs = Math.max(0, Date.now() - timestamp);
  if (ageMs < 1_000) return "Now";
  if (ageMs < 60_000) return `${Math.round(ageMs / 1_000)}s ago`;
  return `${Math.round(ageMs / 60_000)}m ago`;
}

function formatTimestamp(value: string | undefined): string {
  return value ?? "None";
}

type DiagnosticConnection = NonNullable<ConnectionPanelProps["diagnostic"]>["connection"];

function formatAuthStatus(connection: DiagnosticConnection): string {
  if (!connection) return "Unknown";
  if (connection.authStatus === "failed") return "Failed";
  if (connection.authStatus === "refreshing") return "Refreshing";
  if (connection.authenticated === true) return "Authed";
  if (connection.authenticated === false) return "Anon";
  return "Unknown";
}

function formatAuthDetail(connection: DiagnosticConnection): string {
  if (!connection) return "Unknown";
  const status = connection.authStatus ?? "unknown";
  const mode = connection.authModeLabel ?? "unknown mode";
  const reason = connection.authFailureReason ? ` (${connection.authFailureReason})` : "";
  return `${status} · ${mode}${reason}`;
}
