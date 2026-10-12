import { Check } from "lucide-react";
import { arenaAssets } from "./assets";
import styles from "./arena-indicator.module.css";
export type ArenaIndicatorKind = "health" | "deck" | "oblivion" | "banished";
/** Original silhouettes share the phase glyphs' light face and dark bevel. */
function ZoneGlyph({ kind }: { kind: "oblivion" | "banished" }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={styles.glyph}>
      {kind === "oblivion" ? (
        <>
          <path
            fill="currentColor"
            d="M21 3C9 2 1 14 5 25l7-6C9 12 14 6 21 3Zm15 13C32 4 18 1 10 9l9 3c6-4 13-1 17 4ZM28 36c11-5 14-19 6-27l-3 9c4 6 1 13-3 18ZM4 25c4 12 18 15 26 7l-9-3c-6 4-13 1-17-4Z"
          />
          <path fill="#7898a8" d="m13 20 7-7 7 7-7 7Z" />
          <circle cx="20" cy="20" r="4" fill="#08131e" />
        </>
      ) : (
        <>
          <path fill="currentColor" d="M8 5h17l-7 10 5 7-12 13H8V5Zm21 2h4v28H17l12-14-6-6 6-8Z" />
          <path fill="#7898a8" d="M11 8h9l-6 8 5 6-8 9V8Zm19 8-4 3 5 4-8 9h7V16Z" />
          <path fill="#edfaff" d="m3 15 3-3v6Zm32 12 4-2-2 5Z" />
        </>
      )}
    </svg>
  );
}

/** Shared catalog and live-board artwork. The parent owns input and accessible labels. */
export function ArenaIndicator({
  kind,
  value,
  hovered = false,
  selectable = false,
  selected = false,
}: {
  kind: ArenaIndicatorKind;
  value: number;
  hovered?: boolean;
  selectable?: boolean;
  selected?: boolean;
}) {
  return (
    <span
      className={styles.indicator}
      data-kind={kind}
      data-empty={value === 0 || undefined}
      data-hover={hovered || undefined}
      data-selectable={selectable || selected || undefined}
      data-selected={selected || undefined}
      aria-hidden="true"
    >
      <span className={styles.visual} aria-hidden="true">
        {kind === "deck" ? (
          <span className={styles.stack}>
            {value > 0 ? (
              <>
                <img src={arenaAssets.back} alt="" />
                <img src={arenaAssets.back} alt="" />
                <img src={arenaAssets.back} alt="" />
              </>
            ) : (
              <span className={styles.emptyDeck} />
            )}
          </span>
        ) : (
          <span className={styles.socket}>
            {kind === "health" ? (
              <b className={styles.healthValue}>{value}</b>
            ) : (
              <ZoneGlyph kind={kind} />
            )}
          </span>
        )}
        {kind !== "health" && <b className={styles.count}>{value}</b>}
        {selected && (
          <span className={styles.selectedMark}>
            <Check size={12} strokeWidth={3} />
          </span>
        )}
      </span>
    </span>
  );
}
