import { m } from "../../../lib/i18n/messages.ts";

interface DamageCounterOverlayProps {
  readonly damage: number;
  readonly scale?: number;
  readonly className?: string;
  readonly compact?: boolean;
}

export function DamageCounterOverlay({
  damage,
  scale = 1,
  className = "",
  compact = false,
}: DamageCounterOverlayProps) {
  if (damage <= 0) return null;

  const badgeSize = Math.max(34, 34 * scale);
  const labelSize = Math.max(8, 8 * scale);
  const valueSize = Math.max(15, 15 * scale);
  const title = m["sim.card.tags.damage.tooltip"]({ count: damage });

  if (compact) {
    return (
      <span
        data-testid="damage-counter-overlay"
        aria-label={title}
        title={title}
        className={`absolute grid place-items-center font-display font-black text-white ${className}`}
        style={{
          minWidth: 14,
          height: 14,
          padding: "0 3px",
          right: -5,
          top: -7,
          background: "linear-gradient(180deg,#ff4d5e,#c8155a)",
          border: "1px solid #ffb0b8",
          boxShadow: "0 0 8px rgba(255,45,122,.7)",
          fontSize: 9,
          lineHeight: 1,
          textShadow: "0 1px 2px rgba(0,0,0,.8)",
          clipPath: "polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%)",
        }}
      >
        {damage}
      </span>
    );
  }

  return (
    <div
      data-testid="damage-counter-overlay"
      aria-label={title}
      title={title}
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none grid place-items-center ${className}`}
      style={{
        width: badgeSize,
        height: badgeSize,
        borderRadius: 9999,
        background: "linear-gradient(180deg,rgba(80,15,25,.98),rgba(18,7,11,.98))",
        border: "1px solid rgba(255,77,94,.7)",
        boxShadow:
          "0 0 10px rgba(255,77,94,.45), 0 2px 6px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.1)",
        color: "#ffd0d7",
        textShadow: "0 1px 2px rgba(0,0,0,.85)",
        zIndex: 3,
      }}
    >
      <div
        className="font-display font-bold uppercase"
        aria-hidden
        style={{
          fontSize: labelSize,
          lineHeight: 1,
          opacity: 0.78,
          letterSpacing: "0.03em",
        }}
      >
        DMG
      </div>
      <div
        className="font-display font-black tabular-nums"
        style={{
          fontSize: valueSize,
          lineHeight: 1,
        }}
      >
        {damage}
      </div>
    </div>
  );
}
