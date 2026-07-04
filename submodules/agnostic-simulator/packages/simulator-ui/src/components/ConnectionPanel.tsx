import { useEffect, useMemo, useRef, useState } from "react";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import classes from "./ConnectionPanel.module.css";

export interface ConnectionPanelProps {
  embedded?: boolean;
  sides: ReadonlyArray<{
    side: "player" | "opponent";
    label: string;
    playerId?: string;
    connection?: {
      status?: "connected" | "reconnecting" | "disconnected";
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
      reconnectAttempts?: number;
      disconnectCount?: number;
      latencyMs?: number;
    };
    presence?: ReadonlyArray<{
      side: "player" | "opponent";
      status?: string;
      latencyMs?: number;
    }>;
    events?: ReadonlyArray<{ at: string; message: string }>;
  };
}

export function ConnectionPanel({ sides, diagnostic, embedded = false }: ConnectionPanelProps) {
  return (
    <section
      className={`${classes.panel} ${embedded ? classes.panelEmbedded : ""}`}
      aria-label="Connection diagnostics"
    >
      {sides.map((side) => (
        <SideConnection key={side.side} side={side} diagnostic={diagnostic} />
      ))}
    </section>
  );
}

function SideConnection({
  side,
  diagnostic,
}: {
  side: ConnectionPanelProps["sides"][number];
  diagnostic?: ConnectionPanelProps["diagnostic"];
}) {
  const status = side.connection?.status ?? "disconnected";
  return (
    <div className={classes.row} data-side={side.side} data-connection-status={status}>
      <ConnectionPopover side={side} diagnostic={diagnostic} />
      <span className={classes.label}>{side.label}</span>
    </div>
  );
}

function ConnectionPopover({
  side,
  diagnostic,
}: {
  side: ConnectionPanelProps["sides"][number];
  diagnostic?: ConnectionPanelProps["diagnostic"];
}) {
  const [open, setOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<"copied" | "failed" | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const status = side.connection?.status ?? "disconnected";
  const latencyMs = side.connection?.latencyMs ?? diagnostic?.connection?.latencyMs;

  const payload = useMemo(
    () => ({
      connection: {
        connectionId: diagnostic?.connection?.connectionId,
        socketId: diagnostic?.connection?.socketId,
        authModeLabel: diagnostic?.connection?.authModeLabel,
        reconnectAttempts:
          diagnostic?.connection?.reconnectAttempts ?? side.connection?.disconnectCount ?? 0,
        disconnectCount:
          diagnostic?.connection?.disconnectCount ?? side.connection?.disconnectCount ?? 0,
        latencyMs,
      },
      presence: diagnostic?.presence ?? [],
      events: diagnostic?.events ?? [],
    }),
    [diagnostic, side.connection, latencyMs],
  );

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popoverRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
        className={`${classes.dot} ${classes[status]}`}
        data-status={status}
        aria-label={`${side.label} connection status: ${statusLabel(status)}`}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open ? (
        <div ref={popoverRef} className={classes.popover} data-status={status}>
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
              <dt>Reconnects</dt>
              <dd>{payload.connection.reconnectAttempts}</dd>
            </div>
            <div className={classes.metric}>
              <dt>Disconnects</dt>
              <dd>{payload.connection.disconnectCount}</dd>
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

function statusLabel(status: "connected" | "reconnecting" | "disconnected"): string {
  if (status === "connected") return "Connected";
  if (status === "reconnecting") return "Reconnecting";
  return "Disconnected";
}

function headlineForStatus(
  status: "connected" | "reconnecting" | "disconnected",
  self?: boolean,
): string {
  if (status === "connected") return self ? "Match server is live" : "Rival presence is live";
  if (status === "reconnecting") return self ? "Rejoining match server" : "Rival is reconnecting";
  if (status === "disconnected") return self ? "Match server disconnected" : "Rival disconnected";
  return "Presence check pending";
}

function statusMessage(
  status: "connected" | "reconnecting" | "disconnected",
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
  return self
    ? "You are disconnected from the match server."
    : `${label} is disconnected from the match.`;
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
