import type { ReactNode } from "react";
import classes from "./MobileSideStrip.module.css";

interface MobileSideStripProps {
  hp: number;
  maxHp?: number;
  cd: number;
  maxCd?: number;
  deckCount: number;
  trashCount: number;
  opponent?: boolean;
  onOpenDice?: () => void;
  onOpenDeck?: () => void;
  onOpenTrash?: () => void;
  /** Open the AI control drawer (only meaningful on the human's strip). */
  onOpenAi?: () => void;
  /** Optional content to render at the very start of the strip. */
  leadingSlot?: ReactNode;
  /** Optional content to render at the very end of the strip, after chips. */
  trailingSlot?: ReactNode;
}

export function MobileSideStrip({
  hp: _hp,
  maxHp: _maxHp = 100,
  cd: _cd,
  deckCount,
  trashCount,
  opponent = false,
  onOpenDice,
  onOpenDeck,
  onOpenTrash,
  onOpenAi,
  leadingSlot,
  trailingSlot,
}: MobileSideStripProps) {
  return (
    <div
      className={`${classes.strip} ${opponent ? classes.opp : ""} ${trailingSlot ? classes.hasTrailing : ""}`}
    >
      {leadingSlot ? <div className={classes.leading}>{leadingSlot}</div> : <span />}
      <div className={classes.chips}>
        <button type="button" className={classes.chip} onClick={onOpenDeck}>
          <span className={classes.chipKey}>DECK</span>
          <span className={classes.chipVal}>{deckCount}</span>
        </button>
        <button type="button" className={classes.chip} onClick={onOpenTrash}>
          <span className={classes.chipKey}>TRSH</span>
          <span className={classes.chipVal}>{trashCount}</span>
        </button>
        <button type="button" className={`${classes.chip} ${classes.dice}`} onClick={onOpenDice}>
          <span className={classes.chipKey}>FIXER</span>
          <span className={classes.chipVal}>D6</span>
        </button>
        {onOpenAi ? (
          <button
            type="button"
            className={classes.chip}
            onClick={onOpenAi}
            aria-label="AI controls"
          >
            <span className={classes.chipKey}>AI</span>
            <span className={classes.chipVal}>⚙</span>
          </button>
        ) : null}
      </div>
      {trailingSlot ? <div className={classes.trailing}>{trailingSlot}</div> : null}
    </div>
  );
}
