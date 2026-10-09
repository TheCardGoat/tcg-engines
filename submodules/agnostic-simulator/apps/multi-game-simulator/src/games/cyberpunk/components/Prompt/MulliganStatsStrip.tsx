import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Code2, Cog, Tag, UserRound } from "lucide-react";
import { type MulliganHandStats } from "./mulliganStats";
import classes from "./MulliganStatsStrip.module.css";

interface MulliganStatsStripProps {
  stats: MulliganHandStats;
  compact?: boolean;
  mobile?: boolean;
}

const costBands = [
  { key: "low", label: "0–2", count: (stats: MulliganHandStats) => stats.lowCost },
  { key: "mid", label: "3–5", count: (stats: MulliganHandStats) => stats.midCost },
  { key: "high", label: "6+", count: (stats: MulliganHandStats) => stats.highCost },
  { key: "uncosted", label: "NO COST", count: (stats: MulliganHandStats) => stats.uncosted },
] as const;

/** Visible-hand information only. Both board versions use this same prompt. */
export function MulliganStatsStrip({
  stats,
  compact = false,
  mobile = false,
}: MulliganStatsStripProps) {
  // Hover reveals the legends; touch surfaces keep them inline because tap-tooltips are unreliable.
  const [tip, setTip] = useState<"cost" | "mix" | null>(null);
  const [anchor, setAnchor] = useState<{ left: number; bottom: number; width: number } | null>(
    null,
  );
  const wrapRef = useRef<HTMLDivElement>(null);
  const showTips = !mobile;
  const summary = `Opening hand: ${stats.counted} visible cards${stats.hidden ? `, ${stats.hidden} hidden cards` : ""}. Cost: ${stats.lowCost} at 0–2 Eddies, ${stats.midCost} at 3–5, ${stats.highCost} at 6 or more${stats.uncosted ? `, ${stats.uncosted} without cost` : ""}. Types: ${stats.units} Unit cards, ${stats.gear} Gear cards, ${stats.programs} Program cards${stats.otherTypes ? `, ${stats.otherTypes} other cards` : ""}. ${stats.sellable} visible cards with the Sell Tag.`;
  const openTip = (key: "cost" | "mix") => () => {
    const el = wrapRef.current;
    if (el) {
      const box = el.getBoundingClientRect();
      // Fixed-position anchor just above the strip; the prompt housing clips
      // absolutely-positioned children, so the panel portals to document.body.
      setAnchor({ left: box.left, bottom: window.innerHeight - box.top + 5, width: box.width });
    }
    setTip(key);
  };
  const closeTip = () => setTip(null);

  return (
    <div className={classes.stripWrap} ref={wrapRef}>
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
        data-uncosted={stats.uncosted}
        data-units={stats.units}
        data-gear={stats.gear}
        data-programs={stats.programs}
        data-other-types={stats.otherTypes}
        data-sellable={stats.sellable}
      >
        <div
          className={`${classes.row} ${showTips ? classes.tipRow : ""}`}
          onMouseEnter={showTips ? openTip("cost") : undefined}
          onMouseLeave={closeTip}
        >
          <span className={classes.rowLabel}>COST €$</span>
          <div className={classes.costContent}>
            <div className={classes.costBar} aria-hidden="true">
              {costBands.flatMap((band) =>
                Array.from({ length: band.count(stats) }, (_, index) => (
                  <span key={`${band.key}-${index}`} className={classes[band.key]} />
                )),
              )}
            </div>
            {mobile ? (
              <div className={classes.costLegend}>
                {costBands
                  .filter((band) => band.key !== "uncosted" || stats.uncosted > 0)
                  .map((band) => (
                    <span key={band.key} data-testid={`prompt-mulligan-${band.key}`}>
                      <span className={classes[band.key]}>€$ {band.label}</span>
                      <b>{band.count(stats)}</b>
                    </span>
                  ))}
              </div>
            ) : null}
          </div>
        </div>
        <div
          className={`${classes.row} ${showTips ? classes.tipRow : ""}`}
          onMouseEnter={showTips ? openTip("mix") : undefined}
          onMouseLeave={closeTip}
        >
          <span className={classes.rowLabel}>CARD MIX</span>
          <div className={classes.mixContent}>
            <div className={classes.typeList}>
              <span data-testid="prompt-mulligan-units">
                {mobile ? (
                  <span>UNIT</span>
                ) : (
                  <UserRound size={13} aria-hidden="true" className={classes.iconUnit} />
                )}
                <b>{stats.units}</b>
              </span>
              <span>
                {mobile ? (
                  <span>GEAR</span>
                ) : (
                  <Cog size={13} aria-hidden="true" className={classes.iconGear} />
                )}
                <b>{stats.gear}</b>
              </span>
              <span>
                {mobile ? (
                  <span>PROGRAM</span>
                ) : (
                  <Code2 size={13} aria-hidden="true" className={classes.iconProgram} />
                )}
                <b>{stats.programs}</b>
              </span>
              {stats.otherTypes > 0 ? (
                <span>
                  <span>OTHER</span>
                  <b>{stats.otherTypes}</b>
                </span>
              ) : null}
            </div>
            <span className={classes.sellCount} data-testid="prompt-mulligan-sellable">
              {mobile ? (
                <span>€$ SELL</span>
              ) : (
                <Tag size={13} aria-hidden="true" className={classes.iconSell} />
              )}
              <b>{stats.sellable}</b>
            </span>
          </div>
        </div>
      </div>
      {showTips && tip && anchor
        ? createPortal(
            <div
              className={classes.tip}
              role="tooltip"
              style={{ left: anchor.left, bottom: anchor.bottom, width: anchor.width }}
            >
              {tip === "cost" ? (
                <div className={classes.tipBody}>
                  <div className={classes.tipLegend}>
                    {costBands
                      .filter((band) => band.key !== "uncosted" || stats.uncosted > 0)
                      .map((band) => (
                        <span key={band.key} data-testid={`prompt-mulligan-${band.key}`}>
                          <span className={classes[band.key]}>€$ {band.label}</span>
                          <b>{band.count(stats)}</b>
                        </span>
                      ))}
                  </div>
                  <p className={classes.tipNote}>
                    Eddie-cost spread of the visible hand — cheap plays keep the first turns moving.
                  </p>
                </div>
              ) : (
                <div className={classes.tipBody}>
                  <span className={classes.tipEntry}>
                    <UserRound size={12} aria-hidden="true" className={classes.iconUnit} />
                    Unit — fighters on the field
                  </span>
                  <span className={classes.tipEntry}>
                    <Cog size={12} aria-hidden="true" className={classes.iconGear} />
                    Gear — equipment attached to Units
                  </span>
                  <span className={classes.tipEntry}>
                    <Code2 size={12} aria-hidden="true" className={classes.iconProgram} />
                    Program — one-shot tactics
                  </span>
                  <span className={classes.tipEntry}>
                    <Tag size={12} aria-hidden="true" className={classes.iconSell} />
                    Sell Tag — each sells for 1 €$
                  </span>
                  <p className={classes.tipNote}>
                    Sell-Tag cards are also included in the cost and card-type counts.
                  </p>
                </div>
              )}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
