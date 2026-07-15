import { DamageCounterOverlay } from "../card/DamageCounterOverlay.tsx";
import type { GameCardData } from "../types.ts";

interface ShieldPipsProps {
  readonly value?: number;
  readonly max?: number;
  readonly low: boolean;
  readonly listLabel: string;
  readonly shields?: readonly GameCardData[];
}

export function ShieldPips({ value = 0, max = 6, low, listLabel, shields = [] }: ShieldPipsProps) {
  return (
    <div role="list" aria-label={listLabel} className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const on = i < value;
        const color = on ? (low ? "#ff4d5e" : "#36ff8a") : "rgba(255,255,255,.08)";
        const glow = on ? (low ? "rgba(255,45,122,.7)" : "rgba(46,166,90,.6)") : "transparent";
        const damage = shields[i]?.damage ?? 0;
        return (
          <div
            key={i}
            {...(on ? { role: "listitem" } : { "aria-hidden": true })}
            className="relative w-[14px] h-[14px] transition-all duration-200"
          >
            <div
              className="absolute inset-0 clip-hud-3"
              style={{
                background: on
                  ? `linear-gradient(180deg, ${color} 0%, ${low ? "#c8155a" : "#0a4020"} 100%)`
                  : "rgba(255,255,255,.06)",
                border: on ? `1px solid ${color}` : "1px solid rgba(255,255,255,.12)",
                boxShadow: on ? `0 0 6px ${glow}, inset 0 0 3px rgba(255,255,255,.3)` : "none",
              }}
            />
            {on && <DamageCounterOverlay damage={damage} compact />}
          </div>
        );
      })}
    </div>
  );
}
