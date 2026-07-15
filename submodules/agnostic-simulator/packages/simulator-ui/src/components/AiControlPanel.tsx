import { IconBolt, IconRobot } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import classes from "./AiControlPanel.module.css";

export interface AiControlPanelProps {
  mode: "auto" | "step";
  speed: "fast" | "balanced" | "slow";
  status: "thinking" | "paused" | "waiting" | "you-control" | "done" | "error";
  side?: "player" | "opponent";
  nextAiSide?: "player" | "opponent" | null;
  strategies: ReadonlyArray<{ id: string; label: string }>;
  selectedStrategyId?: string | null;
  isTakeover?: boolean;
  canStep?: boolean;
  isRemoteControlled?: boolean;
  canTakeRemoteControl?: boolean;
  decisionLog?: ReadonlyArray<{
    id: string;
    side: "player" | "opponent" | "system";
    timestamp: string;
    summary: string;
    kind: "acted" | "idle" | "stuck" | "illegal" | "unknown";
  }>;
  onChangeMode?: (mode: "auto" | "step") => void;
  onChangeSpeed?: (speed: "fast" | "balanced" | "slow") => void;
  onChangeStrategy?: (strategyId: string | null) => void;
  onStep?: () => void;
  onTakeControl?: () => void;
  onReleaseControl?: () => void;
  onCopyDecisionLog?: () => void;
  compact?: boolean;
  hideDecisionLog?: boolean;
  embedded?: boolean;
}

const SPEED_OPTIONS: ReadonlyArray<{ value: "fast" | "balanced" | "slow"; label: string }> = [
  { value: "fast", label: "Fast" },
  { value: "balanced", label: "Normal" },
  { value: "slow", label: "Slow" },
];

const MODE_OPTIONS: ReadonlyArray<{ value: "auto" | "step"; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "step", label: "Step" },
];

const STATUS_LABELS: Readonly<
  Record<"thinking" | "paused" | "waiting" | "you-control" | "done" | "error", string>
> = {
  thinking: "Thinking…",
  paused: "Paused",
  waiting: "Waiting",
  "you-control": "You control",
  done: "Done",
  error: "Error",
};

const STATUS_PILL_CLASS: Readonly<
  Record<"thinking" | "paused" | "waiting" | "you-control" | "done" | "error", string>
> = {
  thinking: classes.pillThinking ?? "",
  paused: classes.pillPaused ?? "",
  waiting: classes.pillWaiting ?? "",
  "you-control": classes.pillYouControl ?? "",
  done: classes.pillDone ?? "",
  error: classes.pillError ?? "",
};

const SIDE_LABEL: Readonly<Record<"player" | "opponent", string>> = {
  player: "P1",
  opponent: "P2",
};

const LOG_KIND_CLASS: Readonly<Record<"acted" | "idle" | "stuck" | "illegal" | "unknown", string>> =
  {
    acted: classes.logKindActed ?? "",
    idle: classes.logKindIdle ?? "",
    stuck: classes.logKindStuck ?? "",
    illegal: classes.logKindIllegal ?? "",
    unknown: classes.logKindUnknown ?? "",
  };

function inferSide(
  decisionLog: ReadonlyArray<{ side: "player" | "opponent" | "system" }>,
): "player" | "opponent" {
  for (const entry of decisionLog) {
    if (entry.side === "player" || entry.side === "opponent") {
      return entry.side;
    }
  }
  return "opponent";
}

export function AiControlPanel({
  mode,
  speed,
  status,
  side: sideProp,
  nextAiSide = null,
  strategies,
  selectedStrategyId = null,
  isTakeover = false,
  canStep = false,
  isRemoteControlled = false,
  canTakeRemoteControl = false,
  decisionLog = [],
  onChangeMode,
  onChangeSpeed,
  onChangeStrategy,
  onStep,
  onTakeControl,
  onReleaseControl,
  onCopyDecisionLog,
  compact = false,
  hideDecisionLog = false,
  embedded = false,
}: AiControlPanelProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const selectedStrategy = useMemo(
    () => strategies.find((s) => s.id === selectedStrategyId),
    [strategies, selectedStrategyId],
  );
  const side = sideProp ?? inferSide(decisionLog);
  const isTerminal = status === "done";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStrategyChange = (id: string) => {
    const next = id === "" ? null : id;
    onChangeStrategy?.(next);
  };

  const handleTakeOrRelease = () => {
    if (isTerminal) return;
    if (isTakeover) {
      onReleaseControl?.();
      return;
    }
    onTakeControl?.();
  };

  const handleCopyDecisionLog = async () => {
    if (onCopyDecisionLog) {
      onCopyDecisionLog();
      setCopyStatus("AI decisions copied.");
      return;
    }
    const ok = await copyTextToClipboard(safeStringify(decisionLog));
    setCopyStatus(ok ? "AI decisions copied." : "Clipboard unavailable.");
  };

  return (
    <div
      className={`${classes.panel} ${compact ? classes.panelCompact : ""} ${
        embedded ? classes.panelEmbedded : ""
      }`}
      data-testid="ai-control-panel"
      data-side={side}
      data-next-ai-side={nextAiSide ?? "none"}
      data-status={status}
      data-speed={speed}
      data-mode={mode}
      data-takeover={isTakeover ? "true" : "false"}
      data-strategy-id={selectedStrategyId ?? "none"}
    >
      {/* Status header */}
      <div className={classes.statusRow}>
        <span className={classes.statusIcon}>
          <IconRobot size={20} stroke={1.6} aria-hidden />
        </span>
        <div className={classes.statusBody}>
          <span className={classes.statusKicker}>AI coach</span>
          <span className={classes.statusName}>
            {selectedStrategy?.label ?? (isTakeover ? "—" : "No strategy")}
          </span>
          <span className={classes.statusSub}>
            {isTakeover
              ? `You control ${SIDE_LABEL[side]}`
              : isRemoteControlled
                ? `Server controls ${SIDE_LABEL[side]}`
                : selectedStrategy
                  ? `AI controls ${SIDE_LABEL[side]}`
                  : `Hot-seat vs. ${SIDE_LABEL[side]}`}
          </span>
        </div>
        <span
          className={`${classes.pill ?? ""} ${STATUS_PILL_CLASS[status]}`}
          aria-label={`AI status ${STATUS_LABELS[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Strategy */}
      <div className={classes.section}>
        <span className={classes.label}>Strategy</span>
        <select
          className={classes.select}
          data-testid="ai-strategy"
          value={selectedStrategyId ?? ""}
          onChange={(ev) => handleStrategyChange(ev.target.value)}
          disabled={isTerminal || isTakeover}
          aria-label="AI strategy"
        >
          {!selectedStrategy ? (
            <option value="" disabled>
              — Select strategy —
            </option>
          ) : null}
          {strategies.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <span className={classes.help}>Pick how the AI decides each turn.</span>
      </div>

      {/* Speed */}
      <div className={classes.section}>
        <span className={classes.label}>Speed</span>
        <div
          className={classes.segmented}
          role="radiogroup"
          aria-label="AI speed"
          data-testid="ai-speed"
        >
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              data-testid={`ai-speed-${opt.value}`}
              data-active={speed === opt.value ? "true" : "false"}
              aria-checked={speed === opt.value}
              className={`${classes.segmentBtn ?? ""} ${
                speed === opt.value ? (classes.segmentActive ?? "") : ""
              }`}
              onClick={() => onChangeSpeed?.(opt.value)}
              disabled={isTerminal || isTakeover}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div className={classes.section}>
        <span className={classes.label}>Pacing</span>
        <div
          className={classes.segmented}
          role="radiogroup"
          aria-label="AI pacing"
          data-testid="ai-mode"
        >
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              data-testid={`ai-mode-${opt.value}`}
              data-active={mode === opt.value ? "true" : "false"}
              aria-checked={mode === opt.value}
              className={`${classes.segmentBtn ?? ""} ${
                mode === opt.value ? (classes.segmentActive ?? "") : ""
              }`}
              onClick={() => onChangeMode?.(opt.value)}
              disabled={isTerminal || isTakeover}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={classes.actions}>
        {mode === "step" ? (
          <button
            type="button"
            data-testid="ai-step"
            className={`${classes.btn ?? ""} ${classes.btnPrimary ?? ""}`}
            onClick={onStep}
            disabled={!canStep}
          >
            <IconBolt size={14} stroke={2} style={{ verticalAlign: "-2px", marginRight: 4 }} />
            Next AI move
          </button>
        ) : null}

        <button
          type="button"
          data-testid="ai-take-control"
          data-takeover={isTakeover ? "true" : "false"}
          className={`${classes.btn ?? ""} ${classes.btnTakeover ?? ""}`}
          onClick={handleTakeOrRelease}
          disabled={isTerminal || (isRemoteControlled && !canTakeRemoteControl)}
        >
          {isTakeover ? "Release to AI" : selectedStrategy ? "Take control" : "Switch side"}
        </button>
      </div>

      {!hideDecisionLog ? (
        <div className={classes.section} style={{ flex: 1, minHeight: 0 }}>
          <div className={classes.logHeader}>
            <span className={classes.label}>AI decisions</span>
            <div className={classes.logTools}>
              <button
                type="button"
                data-testid="ai-log-copy"
                className={classes.logClear}
                onClick={handleCopyDecisionLog}
                disabled={mounted && decisionLog.length === 0}
              >
                Copy
              </button>
            </div>
          </div>
          {copyStatus ? <div className={classes.copyStatus}>{copyStatus}</div> : null}
          <div className={classes.log}>
            {decisionLog.length === 0 ? (
              <div className={classes.logEmpty}>No AI decisions yet.</div>
            ) : (
              decisionLog
                .slice()
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id}
                    className={`${classes.logEntry ?? ""} ${LOG_KIND_CLASS[entry.kind]}`}
                    data-testid="ai-log-entry"
                    data-log-kind={entry.kind}
                    data-log-side={entry.side}
                  >
                    <span
                      className={`${classes.logSide ?? ""} ${
                        entry.side === "player"
                          ? (classes.logSidePlayer ?? "")
                          : entry.side === "opponent"
                            ? (classes.logSideOpponent ?? "")
                            : ""
                      }`}
                    >
                      {entry.side === "player" || entry.side === "opponent"
                        ? SIDE_LABEL[entry.side]
                        : "SYS"}
                    </span>
                    <span className={classes.logMove} title={entry.summary}>
                      {entry.summary}
                    </span>
                    <span className={classes.logTime}>{entry.timestamp}</span>
                  </div>
                ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
