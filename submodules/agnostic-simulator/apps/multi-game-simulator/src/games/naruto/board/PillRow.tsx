/**
 * Contextual action pills rendered above a selected card. Disabled pills
 * carry the engine's *Block reason as a tooltip (title + aria-label).
 */

import type { ActionPill } from "../projection/interactions.ts";
import animations from "./animations.module.css";
import classes from "./cards.module.css";

export interface PillRowProps {
  readonly pills: readonly ActionPill[];
  readonly onPill: (pill: ActionPill) => void;
}

export function PillRow({ pills, onPill }: PillRowProps) {
  if (pills.length === 0) return null;
  return (
    <span className={`${classes.pillRow} ${animations.promptIn}`} data-testid="naruto-pill-row">
      {pills.map((pill) => (
        <button
          key={pill.id}
          type="button"
          className={classes.pill}
          data-testid={`naruto-pill-${pill.id}`}
          data-enabled={pill.enabled || undefined}
          disabled={!pill.enabled}
          title={pill.reason ?? undefined}
          aria-label={pill.reason ? `${pill.label} (${pill.reason})` : pill.label}
          onClick={(event) => {
            event.stopPropagation();
            onPill(pill);
          }}
        >
          {pill.label}
        </button>
      ))}
    </span>
  );
}
