import type { CSSProperties } from "react";

/**
 * Top-right stack of effective AP/HP pills on a unit's card face. Replaces
 * the old delta-only badges (±N) so the absolute current value is visible
 * at a glance, while the tone still encodes whether the stat is buffed,
 * debuffed, or neutral. Lorcana parity — see
 * `packages/lorcana/.../CardFace.svelte` `statBadges`.
 *
 * Only renders when a delta exists (same trigger as the old component) so
 * unmodified units don't double up with the printed stat numbers on the
 * card art.
 */
export interface StatCurrentBadgesProps {
  readonly ap: number | null | undefined;
  readonly baseAp: number | null | undefined;
  readonly hp: number | null | undefined;
  readonly baseHp: number | null | undefined;
  readonly scale: number;
}

export function StatCurrentBadges({ ap, baseAp, hp, baseHp, scale }: StatCurrentBadgesProps) {
  const apDelta = ap != null && baseAp != null ? ap - baseAp : 0;
  const hpDelta = hp != null && baseHp != null ? hp - baseHp : 0;

  if (apDelta === 0 && hpDelta === 0) return null;

  const stats: Array<{ label: "AP" | "HP"; value: number; delta: number }> = [];
  if (ap != null && apDelta !== 0) stats.push({ label: "AP", value: ap, delta: apDelta });
  if (hp != null && hpDelta !== 0) stats.push({ label: "HP", value: hp, delta: hpDelta });

  return (
    <div
      className="absolute pointer-events-none flex flex-col gap-0.5"
      style={{
        top: 3 * scale,
        right: 3 * scale,
        zIndex: 4,
      }}
      data-testid="stat-current-badges"
    >
      {stats.map((s) => (
        <StatPill key={s.label} label={s.label} value={s.value} delta={s.delta} scale={scale} />
      ))}
    </div>
  );
}

interface StatPillProps {
  readonly label: "AP" | "HP";
  readonly value: number;
  readonly delta: number;
  readonly scale: number;
}

function StatPill({ label, value, delta, scale }: StatPillProps) {
  const positive = delta > 0;
  const fs = Math.max(scale, 0.55);
  const tone: CSSProperties = positive
    ? {
        background: "linear-gradient(180deg,rgba(54,255,138,.85),rgba(20,120,60,.85))",
        border: "1px solid rgba(140,255,193,.6)",
        boxShadow: "0 0 6px rgba(54,255,138,.5)",
      }
    : {
        background: "linear-gradient(180deg,rgba(255,77,94,.85),rgba(120,18,32,.85))",
        border: "1px solid rgba(255,176,184,.6)",
        boxShadow: "0 0 6px rgba(255,77,94,.5)",
      };

  const signed = `${delta > 0 ? "+" : ""}${delta}`;
  return (
    <div
      data-testid={`stat-current-badge-${label.toLowerCase()}`}
      className="font-display font-black tabular-nums grid place-items-center pointer-events-none"
      style={{
        minWidth: 26 * scale,
        height: 14 * scale,
        padding: `0 ${3 * scale}px`,
        ...tone,
        fontSize: 7 * fs,
        color: "#fff",
        textShadow: "0 1px 1px rgba(0,0,0,.7)",
        borderRadius: 2,
      }}
      title={`${label} ${value} (${signed})`}
    >
      {label} {value}
    </div>
  );
}
