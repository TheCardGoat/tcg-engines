import { IconBolt, IconRefresh, IconRobot } from "@tabler/icons-react";
import { useState } from "react";
import {
  AI_STRATEGIES,
  findStrategyDescriptor,
  getStrategyById,
  otherSide,
  resolveAiStatus,
  useEngine,
  useEngineInteractionView,
  type AiLogEntry,
  type AiMode,
  type AiSpeed,
  type AiStatus,
  type Side,
} from "../../engine";
import { useSideZones } from "../../engine/zoneViews";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import classes from "./AiControlPanel.module.css";

const SPEED_OPTIONS: ReadonlyArray<{ value: AiSpeed; label: string }> = [
  { value: "fast", label: "Fast" },
  { value: "balanced", label: "Balanced" },
  { value: "slow", label: "Slow" },
];

const MODE_OPTIONS: ReadonlyArray<{ value: AiMode; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "step", label: "Step" },
];

const STATUS_LABELS: Readonly<Record<AiStatus, string>> = {
  thinking: "Thinking…",
  paused: "Paused",
  waiting: "Waiting",
  "you-control": "You control",
  done: "Done",
  error: "Error",
};

const STATUS_PILL_CLASS: Readonly<Record<AiStatus, string>> = {
  thinking: classes.pillThinking ?? "",
  paused: classes.pillPaused ?? "",
  waiting: classes.pillWaiting ?? "",
  "you-control": classes.pillYouControl ?? "",
  done: classes.pillDone ?? "",
  error: classes.pillError ?? "",
};

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function entrySummary(entry: AiLogEntry): string {
  const r = entry.result;
  switch (r.kind) {
    case "acted":
      return r.decision.kind === "command" ? r.decision.move : "command";
    case "idle":
      return `idle (${r.reason})`;
    case "stuck":
      return `stuck: ${r.reason}`;
    case "illegal":
      return `illegal: ${r.error}`;
  }
}

function entryKindClass(entry: AiLogEntry): string {
  switch (entry.result.kind) {
    case "acted":
      return classes.logKindActed ?? "";
    case "idle":
      return classes.logKindIdle ?? "";
    case "stuck":
      return classes.logKindStuck ?? "";
    case "illegal":
      return classes.logKindIllegal ?? "";
  }
}

export function AiControlPanel({
  compact = false,
  embedded = false,
  hideDecisionLog = false,
  hideScenarioActions = false,
}: {
  compact?: boolean;
  embedded?: boolean;
  hideDecisionLog?: boolean;
  hideScenarioActions?: boolean;
}) {
  const engine = useEngine();
  const playerProjection = useSideZones("player");
  const opponentProjection = useSideZones("opponent");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const aiSide: Side = otherSide(engine.humanSide);
  const isTakeover = engine.aiTakeover !== null;
  const controlledSide = engine.aiTakeover?.side ?? aiSide;
  const aiInteractionView = useEngineInteractionView(controlledSide);
  const aiStrategy = engine.aiTakeover?.strategy ?? engine.aiStrategies[aiSide];
  const aiDescriptor = findStrategyDescriptor(aiStrategy);
  const remoteServerControlled = engine.isRemote && !isTakeover;
  const canTakeRemoteControl = engine.isRemote && aiStrategy !== null;

  const status = resolveAiStatus({
    gameEnded: engine.matchState.G.gameEnded,
    lastError: engine.lastAiError,
    mode: engine.aiMode,
    humanSide: engine.humanSide,
    aiSide: controlledSide,
    hasStrategy: aiStrategy !== null && !isTakeover,
    aiInteractionView,
  });

  const canStep = engine.aiMode === "step" && (status === "paused" || status === "thinking");
  const isTerminal = status === "done";
  const sideLabel = (side: Side) => (side === "player" ? "P1" : "P2");

  // Take Control pauses the rival AI and moves the human seat to that side.
  // Release restores the exact suspended strategy and flips the board back.
  // With no AI configured, the same control acts as a plain hot-seat side swap.
  const takeOrRelease = () => {
    if (isTerminal) {
      return;
    }
    if (isTakeover) {
      engine.releaseAiTakeover();
      return;
    }
    if (engine.aiStrategies[aiSide]) {
      engine.takeOverAiSide(aiSide);
      return;
    }
    engine.toggleHumanSide();
  };

  const onStrategyChange = (id: string) => {
    const desc = getStrategyById(id);
    if (!desc) {
      return;
    }
    engine.setStrategy(aiSide, desc.strategy);
  };

  const copyAiDecisions = async () => {
    const ok = await copyTextToClipboard(safeStringify(engine.eventLog));
    setCopyStatus(ok ? "AI decisions copied." : "Clipboard unavailable.");
  };

  const copySnapshot = async () => {
    const payload = {
      copiedAt: new Date().toISOString(),
      context: {
        scenarioId: engine.scenarioId,
        humanSide: engine.humanSide,
        activeSide: engine.activeSide,
        aiMode: engine.aiMode,
        aiSpeed: engine.aiSpeed,
        lastAiError: engine.lastAiError,
      },
      boardProjection: {
        player: playerProjection,
        opponent: opponentProjection,
      },
      interactionViews: engine.interactionViews,
      matchLog: engine.moveLogs,
      aiDecisions: engine.eventLog,
      engineEvents: engine.rawEngineEvents,
      gameState: engine.matchState,
    };
    const ok = await copyTextToClipboard(safeStringify(payload));
    setCopyStatus(ok ? "Snapshot copied." : "Clipboard unavailable.");
  };

  return (
    <div
      className={`${classes.panel} ${compact ? classes.panelCompact : ""} ${
        embedded ? classes.panelEmbedded : ""
      }`}
      data-testid="ai-control-panel"
      data-side={aiSide}
      data-status={status}
      data-speed={engine.aiSpeed}
      data-mode={engine.aiMode}
      data-takeover={isTakeover ? "true" : "false"}
      data-strategy-id={aiDescriptor?.id ?? "none"}
    >
      {/* Status header */}
      <div className={classes.statusRow}>
        <span className={classes.statusIcon}>
          <IconRobot size={20} stroke={1.6} aria-hidden />
        </span>
        <div className={classes.statusBody}>
          <span className={classes.statusName}>
            {embedded
              ? `Bot: ${aiDescriptor?.label ?? (isTakeover ? "—" : "No strategy")}`
              : (aiDescriptor?.label ?? (isTakeover ? "—" : "No strategy"))}
          </span>
          {!embedded ? (
            <span className={classes.statusSub}>
              {isTakeover
                ? `You control ${sideLabel(controlledSide)}`
                : remoteServerControlled
                  ? `Server controls ${sideLabel(aiSide)}`
                  : aiStrategy
                    ? `AI controls ${sideLabel(aiSide)}`
                    : `Hot-seat vs. ${sideLabel(aiSide)}`}
            </span>
          ) : null}
        </div>
        <span
          className={`${classes.pill ?? ""} ${STATUS_PILL_CLASS[status]}`}
          aria-label={`AI status ${STATUS_LABELS[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {engine.lastAiError ? (
        <div className={classes.errorBox} role="alert">
          {engine.lastAiError}
        </div>
      ) : null}

      {/* Strategy */}
      <div className={classes.section}>
        <span className={classes.label}>Strategy</span>
        <select
          className={classes.select}
          data-testid="ai-strategy"
          value={aiDescriptor?.id ?? ""}
          onChange={(ev) => onStrategyChange(ev.target.value)}
          disabled={isTerminal || isTakeover}
          aria-label="AI strategy"
        >
          {!aiDescriptor ? (
            <option value="" disabled>
              — Select strategy —
            </option>
          ) : null}
          {AI_STRATEGIES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <span className={classes.help}>
          {aiDescriptor?.description ?? "Pick how the AI decides each turn."}
        </span>
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
              data-active={engine.aiSpeed === opt.value ? "true" : "false"}
              aria-checked={engine.aiSpeed === opt.value}
              className={`${classes.segmentBtn ?? ""} ${
                engine.aiSpeed === opt.value ? (classes.segmentActive ?? "") : ""
              }`}
              onClick={() => engine.setAiSpeed(opt.value)}
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
              data-active={engine.aiMode === opt.value ? "true" : "false"}
              aria-checked={engine.aiMode === opt.value}
              className={`${classes.segmentBtn ?? ""} ${
                engine.aiMode === opt.value ? (classes.segmentActive ?? "") : ""
              }`}
              onClick={() => engine.setAiMode(opt.value)}
              disabled={isTerminal || isTakeover}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={classes.actions}>
        {engine.aiMode === "step" ? (
          <button
            type="button"
            data-testid="ai-step"
            className={`${classes.btn ?? ""} ${classes.btnPrimary ?? ""}`}
            onClick={engine.stepOnce}
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
          onClick={takeOrRelease}
          disabled={isTerminal || (remoteServerControlled && !canTakeRemoteControl)}
        >
          {isTakeover ? "Release to AI" : aiStrategy ? "Take control" : "Switch side"}
        </button>

        {!hideScenarioActions ? (
          <button
            type="button"
            data-testid="ai-reset-scenario"
            className={classes.btn}
            onClick={engine.resetScenario}
            aria-label="Restart scenario"
            disabled={!engine.canResetScenario}
          >
            <IconRefresh size={14} stroke={2} style={{ verticalAlign: "-2px", marginRight: 4 }} />
            Restart scenario
          </button>
        ) : null}
      </div>

      {!hideDecisionLog ? (
        <div className={classes.section} style={{ flex: 1, minHeight: 0 }}>
          <div className={classes.logHeader}>
            <span className={classes.label}>AI decisions</span>
            <div className={classes.logTools}>
              <button
                type="button"
                data-testid="ai-log-snapshot"
                className={classes.logClear}
                onClick={copySnapshot}
                title="Copy board projection, game state, logs, decisions, and engine events"
              >
                Snapshot
              </button>
              <button
                type="button"
                data-testid="ai-log-copy"
                className={classes.logClear}
                onClick={copyAiDecisions}
                disabled={engine.eventLog.length === 0}
              >
                Copy
              </button>
              <button
                type="button"
                data-testid="ai-log-clear"
                className={classes.logClear}
                onClick={engine.clearLog}
                disabled={engine.eventLog.length === 0}
              >
                Clear
              </button>
            </div>
          </div>
          {copyStatus ? <div className={classes.copyStatus}>{copyStatus}</div> : null}
          <div className={classes.log}>
            {engine.eventLog.length === 0 ? (
              <div className={classes.logEmpty}>No AI decisions yet.</div>
            ) : (
              engine.eventLog
                .slice()
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id}
                    className={`${classes.logEntry ?? ""} ${entryKindClass(entry)}`}
                    data-testid="ai-log-entry"
                    data-log-kind={entry.result.kind}
                    data-log-side={entry.side}
                  >
                    <span
                      className={`${classes.logSide ?? ""} ${
                        entry.side === "player"
                          ? (classes.logSidePlayer ?? "")
                          : (classes.logSideOpponent ?? "")
                      }`}
                    >
                      {entry.side === "player" ? "P1" : "P2"}
                    </span>
                    <span className={classes.logMove} title={entrySummary(entry)}>
                      {entrySummary(entry)}
                    </span>
                    <span className={classes.logTime}>{formatTime(entry.timestamp)}</span>
                  </div>
                ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
