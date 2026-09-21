import { type MulliganHandStats } from "./mulliganStats";
import classes from "./MulliganStatsStrip.module.css";

interface MulliganStatsStripProps {
  stats: MulliganHandStats;
  compact?: boolean;
  mobile?: boolean;
}

interface StatChip {
  id: string;
  label: string;
  value: string;
  ariaLabel: string;
  title: string;
  tone: "neutral" | "good" | "warn";
}

function buildChips(stats: MulliganHandStats): StatChip[] {
  return [
    {
      id: "low",
      label: "1–2",
      value: `${stats.lowCost}`,
      ariaLabel: `${stats.lowCost} cards cost 1 to 2 Eddies`,
      title: "Cheap plays for your first turns. A smooth curve usually has 2 or more.",
      tone: stats.lowCost >= 2 ? "good" : "neutral",
    },
    {
      id: "mid",
      label: "3–5",
      value: `${stats.midCost}`,
      ariaLabel: `${stats.midCost} cards cost 3 to 5 Eddies`,
      title: "Mid-cost cards usually need the Sell ramp first.",
      tone: "neutral",
    },
    {
      id: "high",
      label: "6+",
      value: `${stats.highCost}`,
      ariaLabel: `${stats.highCost} cards cost 6 or more Eddies`,
      title: "Late-game payoffs — they sit in hand until the Eddies flow.",
      tone: "neutral",
    },
    {
      id: "units",
      label: "Units",
      value: `${stats.units}/${stats.counted}`,
      ariaLabel: `${stats.units} of ${stats.counted} cards are Units`,
      title: "Units fight and steal; Gear and Programs support them.",
      tone: "neutral",
    },
    {
      id: "sellable",
      label: "€$ Sell",
      value: `${stats.sellable}`,
      ariaLabel: `${stats.sellable} cards can be sold for an Eddie`,
      title: "Sell Tag cards become Eddies. The Sell action is once per turn.",
      tone: stats.sellable >= 1 ? "good" : "warn",
    },
  ];
}

/**
 * Opening-hand summary chips for the mulligan prompt: Eddie-cost curve,
 * unit share, and sellable count. Purely informational — the Keep / Mulligan
 * decision stays with the player.
 */
export function MulliganStatsStrip({
  stats,
  compact = false,
  mobile = false,
}: MulliganStatsStripProps) {
  const chips = buildChips(stats);
  const summary = `Opening hand: ${stats.lowCost} of ${stats.counted} cards cost 1–2, ${stats.midCost} cost 3–5, ${stats.highCost} cost 6 or more, ${stats.units} are Units, ${stats.sellable} can be sold.`;
  return (
    <div
      className={[classes.strip, compact ? classes.compact : "", mobile ? classes.mobile : ""]
        .filter(Boolean)
        .join(" ")}
      data-testid="prompt-mulligan-stats"
      role="group"
      aria-label={summary}
      data-counted={stats.counted}
      data-hidden={stats.hidden}
      data-low={stats.lowCost}
      data-mid={stats.midCost}
      data-high={stats.highCost}
      data-units={stats.units}
      data-sellable={stats.sellable}
    >
      {chips.map((chip) => (
        <span
          key={chip.id}
          className={`${classes.chip} ${
            chip.tone === "good" ? classes.chipGood : chip.tone === "warn" ? classes.chipWarn : ""
          }`}
          data-testid={`prompt-mulligan-${chip.id}`}
          title={chip.title}
          aria-label={chip.ariaLabel}
        >
          <span className={classes.chipLabel}>{chip.label}</span>
          <span className={classes.chipValue}>{chip.value}</span>
        </span>
      ))}
    </div>
  );
}
