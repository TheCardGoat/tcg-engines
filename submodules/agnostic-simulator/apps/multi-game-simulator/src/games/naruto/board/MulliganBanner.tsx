/**
 * Pre-game mulligan banner: opening hand preview + keep/redraw pills.
 */

import { cardImageUrl } from "../projection/labels.ts";
import animations from "./animations.module.css";
import classes from "./board.module.css";
import cards from "./cards.module.css";
import type { BoardKit } from "./types.ts";

export function MulliganBanner({ kit }: { readonly kit: BoardKit }) {
  const { projection } = kit;
  const hand = projection.bottom.hand;
  return (
    <div className={`${classes.backdrop} ${animations.fadeIn}`} data-testid="naruto-mulligan">
      <div className={classes.dialog} role="dialog" aria-label="Opening hand">
        <h2 className={classes.dialogTitle}>Opening hand</h2>
        <p className={classes.dialogPrompt}>Keep this hand, or shuffle it back and redraw?</p>
        <div className={classes.choiceGrid}>
          {hand.map((card) => (
            <span key={card.uid} className={cards.card} style={{ cursor: "default" }}>
              <img
                className={cards.cardArt}
                src={cardImageUrl(card.cardId)}
                alt={card.name}
                draggable={false}
              />
              <span className={cards.cardName}>{card.name}</span>
            </span>
          ))}
        </div>
        <div className={classes.dialogActions}>
          {projection.mulliganPills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              className={pill.id === "mulligan-keep" ? classes.endTurnButton : classes.cancelChip}
              data-testid={`naruto-${pill.id}`}
              disabled={!pill.enabled}
              onClick={() => kit.onPill(pill)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
