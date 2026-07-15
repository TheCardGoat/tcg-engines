import type { CSSProperties } from "react";
import { AiControlPanel } from "@tcg/simulator-ui";

import { useVsAi } from "../../game/bot/bot-context.tsx";

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
          "--simulator-surface-strong": "rgba(255,255,255,.88)",
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
    </div>
  );
}
