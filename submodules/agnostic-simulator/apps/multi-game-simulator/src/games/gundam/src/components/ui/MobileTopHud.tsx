import { phaseLabel } from "../../game/labels.ts";
import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";
import type { MatchInfo } from "./types.ts";

export interface MobileTopHudProps {
  readonly matchInfo: MatchInfo;
  readonly isSelfTurn: boolean;
  readonly onOpenDrawer: () => void;
}

/**
 * Compact top bar for mobile portrait. Replaces the left sidebar's header +
 * match-meta block with a single 44px row. The full log / player cards move
 * into a slide-over drawer (Phase 3).
 */
export function MobileTopHud({ matchInfo, isSelfTurn, onOpenDrawer }: MobileTopHudProps) {
  const turnColor = isSelfTurn ? "#2d6bff" : "#ff2d7a";
  return (
    <header
      className="flex items-center gap-2 px-3 border-b border-hud-border flex-shrink-0 min-w-0 overflow-hidden"
      style={{
        // Real rendered height must include the notch inset so content
        // isn't squeezed into `topHudHeight - safeTop`. PendingEffects and
        // the bottom-sheet both assume this same sum when positioning.
        height: "calc(var(--mobile-top-hud-height) + var(--safe-top))",
        paddingTop: "var(--safe-top)",
        background: "linear-gradient(180deg, #ffffff, #fbfcfe)",
      }}
    >
      <Button
        onClick={onOpenDrawer}
        variant="outline"
        size="icon"
        className="clip-hud-5 w-[30px] h-[30px] text-hud-accent border-hud-accent/40 bg-hud-accent/10 flex-shrink-0"
        aria-label={m["sim.sidebar.log.regionLabel"]()}
      >
        ☰
      </Button>

      <div className="flex items-center gap-1.5 font-mono text-hud-xs tracking-hud-label">
        <span className="text-hud-text-faint">{m["sim.sidebar.meta.turn"]()}</span>
        <span
          className="font-display text-hud-lg font-extrabold tracking-hud-display"
          style={{ color: turnColor, textShadow: `0 0 6px ${turnColor}66` }}
        >
          #{matchInfo.turn}
        </span>
      </div>

      {/* Phase label dropped on mobile — the value carries the meaning,
       * and we need the row real estate for the turn pill below. */}
      <div className="flex items-center font-mono text-hud-xs tracking-hud-label min-w-0">
        <span className="text-hud-info font-bold truncate [text-shadow:0_0_6px_rgba(76,195,255,.35)]">
          {phaseLabel(matchInfo.phase)}
        </span>
      </div>

      <div className="flex-1" />

      <span
        className="font-display text-hud-2xs font-extrabold tracking-hud-label px-2 py-0.5 text-white whitespace-nowrap flex-shrink-0"
        style={{
          background: `linear-gradient(180deg, ${turnColor}, ${
            isSelfTurn ? "#1c4cd1" : "#c8155a"
          })`,
          clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
          boxShadow: `0 0 10px ${turnColor}66`,
        }}
      >
        {isSelfTurn ? m["sim.player.turn.yourTurn"]() : m["sim.player.turn.opponentTurn"]()}
      </span>
    </header>
  );
}
