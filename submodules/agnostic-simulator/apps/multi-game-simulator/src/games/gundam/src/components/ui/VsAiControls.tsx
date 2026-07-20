import { useSyncExternalStore, type CSSProperties } from "react";
import { AiControlPanel } from "@tcg/simulator-ui";

import { useVsAi, useVsAiDiagnostics } from "../../game/bot/bot-context.tsx";

const subscribeToNothing = () => () => {};
const getNoDecisions = () => 0;

/**
 * vs-AI control panel — tri-state play mode (Auto / Step / Pause),
 * speed dropdown, and a "Step" button that fires exactly one bot
 * action. Surfaces only on pages that mounted a {@link VsAiProvider},
 * so main-phase / setup pages see nothing.
 *
 * Layout-agnostic: renders in normal flow so the parent decides
 * positioning. Currently mounted inside the MatchSidebar above the
 * EventLog section so it reads as part of the
 * sidebar chrome rather than a floating widget.
 *
 * Persistence is intentionally omitted in the MVP — refreshing drops
 * back to the fixture's defaults. A follow-up can round-trip
 * mode/speed through `localStorage` once mode-swap UX settles.
 */
export function VsAiControls() {
  const ctx = useVsAi();
  if (!ctx) return null;

  const strategyId = ctx.strategyName.trim() || null;
  const isPaused = ctx.mode === "paused";

  return (
    <div
      className="gundam-ai-control-panel pt-2.5 pb-3 pr-hud-sm pl-hud-md border-b border-hud-border"
      role="region"
      aria-label="AI opponent controls"
      style={
        {
          "--simulator-accent-rgb": "45 107 255",
          "--simulator-magenta-rgb": "255 45 122",
          "--simulator-neutral-rgb": "60 74 107",
          "--simulator-success-rgb": "46 166 90",
          "--simulator-error-rgb": "215 38 61",
          "--simulator-surface-strong": "oklch(0.26 0.035 260 / .94)",
        } as CSSProperties
      }
    >
      <AiControlPanel
        compact
        embedded
        hideDecisionLog
        mode={ctx.mode === "auto" ? "auto" : "step"}
        speed={ctx.speed}
        status={isPaused ? "paused" : ctx.mode === "step" ? "you-control" : "thinking"}
        side="opponent"
        strategies={strategyId ? [{ id: strategyId, label: ctx.strategyName }] : []}
        selectedStrategyId={strategyId}
        isTakeover={isPaused}
        canStep={ctx.mode === "step"}
        onChangeMode={(mode) => ctx.setMode(mode)}
        onChangeSpeed={(speed) => ctx.setSpeed(speed)}
        onStep={ctx.stepOnce}
        onTakeControl={() => ctx.setMode("paused")}
        onReleaseControl={() => ctx.setMode("auto")}
      />
      <VsAiDiagnosticTools />
    </div>
  );
}

function VsAiDiagnosticTools() {
  const diagnostics = useVsAiDiagnostics();
  const decisionCount = useSyncExternalStore(
    diagnostics?.subscribe ?? subscribeToNothing,
    diagnostics?.getDecisionCount ?? getNoDecisions,
    diagnostics?.getDecisionCount ?? getNoDecisions,
  );
  if (!diagnostics) return null;

  return (
    <details className="group mt-2 border border-hud-border bg-white/45" data-testid="ai-tools">
      <summary className="flex min-h-7 cursor-pointer list-none items-center justify-between px-2 font-mono text-hud-2xs font-bold tracking-hud-label text-hud-text-muted marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-hud-accent focus-visible:outline-offset-[-2px] [&::-webkit-details-marker]:hidden">
        <span>Tools</span>
        <span aria-hidden="true">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="grid grid-cols-[1fr_0.76fr_1.25fr] gap-1 border-t border-hud-border p-1.5">
        <button
          type="button"
          data-testid="ai-log-snapshot"
          className="min-h-8 border border-hud-accent/35 px-1 font-mono text-[8px] leading-3 font-bold uppercase tracking-[0.04em] text-hud-accent transition-colors hover:bg-hud-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-hud-accent focus-visible:outline-offset-2"
          onClick={() => void diagnostics.copySnapshot()}
          title="Copy the board, interaction state, logs, bot decisions, and engine state"
        >
          Snapshot
        </button>
        <button
          type="button"
          data-testid="ai-log-clear"
          className="min-h-8 border border-hud-accent/35 px-1 font-mono text-[8px] leading-3 font-bold uppercase tracking-[0.04em] text-hud-accent transition-colors hover:bg-hud-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-hud-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={diagnostics.clearDecisions}
          disabled={decisionCount === 0}
        >
          Clear
        </button>
        <button
          type="button"
          data-testid="ai-reset-scenario"
          className="flex min-h-8 flex-col items-center justify-center border border-hud-accent/35 px-1 font-mono text-[8px] leading-3 font-bold uppercase tracking-[0.04em] text-hud-accent transition-colors hover:bg-hud-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-hud-accent focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={diagnostics.restartScenario}
          aria-label="Restart scenario"
          disabled={!diagnostics.restartScenario}
        >
          <span>Restart</span>
          <span>scenario</span>
        </button>
      </div>
    </details>
  );
}
