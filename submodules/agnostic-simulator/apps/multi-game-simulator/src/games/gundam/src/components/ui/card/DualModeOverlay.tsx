import type { MouseEvent } from "react";

/**
 * Overlay rendered on top of a `CardFace` when the card is in
 * dual-mode lifted state (rule 3-4-6 — Command card with 【Pilot】
 * keyword). Splits the card visually into two clickable halves:
 *
 *   - Top ~72%: command-effect zone (where the command effect text
 *     prints on the actual card).
 *   - Bottom ~28%: pilot-effect zone (the strip that prints the
 *     pilot's name and AP/HP modifiers).
 *
 * Each half glows cyan (matching the existing inline-targeting glow)
 * and surfaces a label pill so the player can read the choice without
 * memorizing where each half maps. Clicking a half commits the
 * decision and the parent flow takes over (engine starts the chosen
 * move; existing inline-targeting handles target selection).
 *
 * Pure visual + click delegation — all state lives in
 * `dual-mode-context.tsx`.
 */
export interface DualModeOverlayProps {
  readonly scale: number;
  readonly onPickCmd: () => void;
  readonly onPickPilot: () => void;
}

const CMD_HEIGHT_FRACTION = 0.72;
const PILOT_HEIGHT_FRACTION = 1 - CMD_HEIGHT_FRACTION;

export function DualModeOverlay({ scale, onPickCmd, onPickPilot }: DualModeOverlayProps) {
  // Stop propagation on the half clicks so the parent CardFace's
  // onClick (the dispatcher) doesn't also fire — only the half-click
  // should trigger the commit.
  const stopAnd = (cb: () => void) => (e: MouseEvent) => {
    e.stopPropagation();
    cb();
  };

  const fontPx = Math.max(8, Math.round(11 * scale));
  const padPx = Math.max(4, Math.round(7 * scale));

  return (
    <div className="absolute inset-0 z-10 pointer-events-none" data-testid="dual-mode-overlay">
      {/* Top half — command */}
      <button
        type="button"
        data-testid="dual-mode-command"
        onClick={stopAnd(onPickCmd)}
        className="absolute left-0 right-0 top-0 pointer-events-auto cursor-pointer transition-[box-shadow,background] duration-150"
        style={{
          height: `${CMD_HEIGHT_FRACTION * 100}%`,
          background: "linear-gradient(180deg, rgba(41,212,247,.15), rgba(41,212,247,.04))",
          border: 0,
          borderBottom: "1px solid rgba(41,212,247,.6)",
          boxShadow: "inset 0 0 0 2px rgba(41,212,247,.85), inset 0 0 22px rgba(41,212,247,.3)",
          animation: "gd-dual-mode-pulse 1.4s ease-in-out infinite",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 font-mono uppercase tracking-[.18em] text-white"
          style={{
            top: padPx,
            background: "rgba(15,32,80,.9)",
            border: "1px solid rgba(41,212,247,.95)",
            padding: `${Math.round(padPx * 0.5)}px ${padPx}px`,
            fontSize: fontPx,
            lineHeight: 1,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 10px -4px rgba(41,212,247,.7)",
          }}
        >
          ▸ Use Command
        </div>
      </button>

      {/* Bottom half — pilot pairing */}
      <button
        type="button"
        data-testid="dual-mode-pilot"
        onClick={stopAnd(onPickPilot)}
        className="absolute left-0 right-0 bottom-0 pointer-events-auto cursor-pointer transition-[box-shadow,background] duration-150"
        style={{
          height: `${PILOT_HEIGHT_FRACTION * 100}%`,
          background: "linear-gradient(0deg, rgba(41,212,247,.18), rgba(41,212,247,.04))",
          border: 0,
          borderTop: "1px solid rgba(41,212,247,.6)",
          boxShadow: "inset 0 0 0 2px rgba(41,212,247,.85), inset 0 0 22px rgba(41,212,247,.3)",
          animation: "gd-dual-mode-pulse 1.4s ease-in-out infinite",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 font-mono uppercase tracking-[.18em] text-white"
          style={{
            bottom: padPx,
            background: "rgba(15,32,80,.9)",
            border: "1px solid rgba(41,212,247,.95)",
            padding: `${Math.round(padPx * 0.5)}px ${padPx}px`,
            fontSize: fontPx,
            lineHeight: 1,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 10px -4px rgba(41,212,247,.7)",
          }}
        >
          ▸ Pair as Pilot
        </div>
      </button>
    </div>
  );
}
