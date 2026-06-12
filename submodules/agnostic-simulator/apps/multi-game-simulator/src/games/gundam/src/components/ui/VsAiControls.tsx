import { Button } from "../primitives/index.ts";
import { useVsAi } from "../../game/bot/bot-context.tsx";

const CLIP_TRIANGLE_DOWN = "polygon(50% 0, 100% 100%, 0 100%)";

/**
 * vs-AI control panel — tri-state play mode (Auto / Step / Pause),
 * speed dropdown, and a "Step" button that fires exactly one bot
 * action. Surfaces only on pages that mounted a {@link VsAiProvider},
 * so main-phase / setup pages see nothing.
 *
 * Layout-agnostic: renders in normal flow so the parent decides
 * positioning. Currently mounted inside the MatchSidebar above the
 * `BATTLE DATA` block — matches the styling of neighbouring
 * `MatchMetaBlock` / `EventLog` sections so it reads as part of the
 * sidebar chrome rather than a floating widget.
 *
 * Persistence is intentionally omitted in the MVP — refreshing drops
 * back to the fixture's defaults. A follow-up can round-trip
 * mode/speed through `localStorage` once mode-swap UX settles.
 */
export function VsAiControls() {
  const ctx = useVsAi();
  if (!ctx) return null;

  return (
    <div
      className="pt-2.5 pb-3 pr-hud-sm pl-hud-md border-b border-hud-border"
      role="region"
      aria-label="AI opponent controls"
    >
      {/* Matches the `MatchMetaBlock` heading row beneath us — same
          triangle glyph + accent colour + tracking — so the two blocks
          read as a single stacked set. */}
      <div className="font-mono text-hud-xs font-bold text-hud-info mb-2 flex items-center justify-between gap-1.5 tracking-hud-label">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-hud-info" style={{ clipPath: CLIP_TRIANGLE_DOWN }} />
          AI OPPONENT
        </span>
        <span className="font-mono text-hud-2xs text-hud-text-faint tracking-hud-label">
          {ctx.strategyName}
        </span>
      </div>

      <div className="flex items-stretch gap-1 mb-1.5">
        <Button
          onClick={() => ctx.setMode("auto")}
          variant={ctx.mode === "auto" ? "primary" : "outline"}
          size="sm"
          className="flex-1 text-hud-xs py-1 px-2 tracking-hud-label clip-hud-4"
        >
          AUTO
        </Button>
        <Button
          onClick={() => ctx.setMode("step")}
          variant={ctx.mode === "step" ? "primary" : "outline"}
          size="sm"
          className="flex-1 text-hud-xs py-1 px-2 tracking-hud-label clip-hud-4"
        >
          STEP
        </Button>
        <Button
          onClick={() => ctx.setMode("paused")}
          variant={ctx.mode === "paused" ? "danger" : "outline"}
          size="sm"
          className="flex-1 text-hud-xs py-1 px-2 tracking-hud-label clip-hud-4"
        >
          PAUSE
        </Button>
      </div>

      {ctx.mode === "step" && (
        <Button
          onClick={ctx.stepOnce}
          variant="cockpit"
          size="sm"
          className="w-full text-hud-xs py-1 px-2 tracking-hud-label clip-hud-4 mb-1.5"
          aria-label="Step bot once"
        >
          ▶ STEP ONCE
        </Button>
      )}

      <label
        className="flex items-center gap-1.5"
        title="How fast the bot executes actions while in Auto mode."
      >
        <span className="gd-mono text-hud-2xs text-hud-text-faint tracking-hud-label whitespace-nowrap">
          SPEED
        </span>
        <select
          value={ctx.speed}
          onChange={(event) =>
            ctx.setSpeed(event.currentTarget.value as "fast" | "balanced" | "slow")
          }
          className="flex-1 bg-hud-deep border border-[rgba(76,195,255,.3)] text-hud-text px-2 py-0.5 text-hud-xs font-mono tracking-hud-label outline-none"
          aria-label="Bot speed"
        >
          <option value="fast">fast</option>
          <option value="balanced">balanced</option>
          <option value="slow">slow</option>
        </select>
      </label>
    </div>
  );
}
