import {
  AI_STRATEGIES,
  findStrategyDescriptor,
  getStrategyById,
  otherSide,
  resolveAiStatus,
  useEngine,
  useEngineInteractionView,
  type AiLogEntry,
  type Side,
} from "../../engine";
import { useSideZones } from "../../engine/zoneViews";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import {
  AiControlPanel as SharedAiControlPanel,
  type AiControlPanelProps as SharedAiControlPanelProps,
} from "@tcg/simulator-ui";
import classes from "./AiControlPanel.module.css";

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
    default:
      return `unknown: ${(r as { kind?: string }).kind ?? "?"}`;
  }
}

function entryKind(entry: AiLogEntry): "acted" | "idle" | "stuck" | "illegal" | "unknown" {
  const kind = entry.result.kind;
  if (kind === "acted" || kind === "idle" || kind === "stuck" || kind === "illegal") {
    return kind;
  }
  return "unknown";
}

export function AiControlPanel({
  compact = false,
  embedded: embeddedProp = false,
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
  const defaultAiSide: Side = otherSide(engine.humanSide);
  const isTakeover = engine.aiTakeover !== null;
  const nextAiSide =
    (["player", "opponent"] as const).find((side) => {
      if (!engine.aiStrategies[side]) {
        return false;
      }
      const view = engine.interactionViews[side];
      return (
        view.status === "choosing" ||
        (view.status === "ready" && view.actions.some((action) => action.enabled))
      );
    }) ?? null;
  const aiSide: Side = nextAiSide ?? defaultAiSide;
  const controlledSide = engine.aiTakeover?.side ?? aiSide;
  const aiInteractionView = useEngineInteractionView(controlledSide);
  const aiStrategy = engine.aiTakeover?.strategy ?? engine.aiStrategies[controlledSide];
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

  const takeOrRelease = () => {
    if (isTerminal) {
      return;
    }
    if (isTakeover) {
      engine.releaseAiTakeover();
      return;
    }
    if (engine.aiStrategies[controlledSide]) {
      engine.takeOverAiSide(controlledSide);
      return;
    }
    engine.toggleHumanSide();
  };

  const onStrategyChange = (id: string | null) => {
    if (id === null) {
      engine.setStrategy(controlledSide, null);
      return;
    }
    const desc = getStrategyById(id);
    if (!desc) {
      return;
    }
    engine.setStrategy(controlledSide, desc.strategy);
  };

  const copyAiDecisions = async () => {
    await copyTextToClipboard(safeStringify(engine.eventLog));
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
    await copyTextToClipboard(safeStringify(payload));
  };

  const decisionLog: SharedAiControlPanelProps["decisionLog"] = engine.eventLog.map((entry) => ({
    id: String(entry.id),
    side: entry.side,
    timestamp: formatTime(entry.timestamp),
    summary: entrySummary(entry),
    kind: entryKind(entry),
  }));

  return (
    <div className={classes.wrapper} data-embedded={embeddedProp ? "true" : "false"}>
      <SharedAiControlPanel
        mode={engine.aiMode}
        speed={engine.aiSpeed}
        status={status}
        side={controlledSide}
        nextAiSide={nextAiSide}
        strategies={AI_STRATEGIES}
        selectedStrategyId={aiDescriptor?.id ?? null}
        isTakeover={isTakeover}
        canStep={canStep}
        isRemoteControlled={remoteServerControlled}
        canTakeRemoteControl={canTakeRemoteControl}
        decisionLog={decisionLog}
        onChangeMode={engine.setAiMode}
        onChangeSpeed={engine.setAiSpeed}
        onChangeStrategy={onStrategyChange}
        onStep={engine.stepOnce}
        onTakeControl={takeOrRelease}
        onReleaseControl={takeOrRelease}
        onCopyDecisionLog={copyAiDecisions}
        compact={compact}
        hideDecisionLog={hideDecisionLog}
        embedded={embeddedProp}
      />
      {!hideScenarioActions ? (
        <div className={classes.wrapperActions}>
          <button
            type="button"
            data-testid="ai-log-snapshot"
            className={classes.wrapperBtn}
            onClick={() => void copySnapshot()}
            title="Copy board projection, game state, logs, decisions, and engine events"
          >
            Snapshot
          </button>
          <button
            type="button"
            data-testid="ai-log-clear"
            className={classes.wrapperBtn}
            onClick={engine.clearLog}
            disabled={engine.eventLog.length === 0}
          >
            Clear
          </button>
          <button
            type="button"
            data-testid="ai-reset-scenario"
            className={classes.wrapperBtn}
            onClick={engine.resetScenario}
            aria-label="Restart scenario"
            disabled={!engine.canResetScenario}
          >
            Restart scenario
          </button>
        </div>
      ) : null}
    </div>
  );
}
