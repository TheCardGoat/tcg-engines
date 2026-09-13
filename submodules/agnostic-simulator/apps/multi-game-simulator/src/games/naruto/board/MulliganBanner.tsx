/**
 * Pre-game mulligan banner: opening hand preview + keep/redraw pills.
 */

import * as Dialog from "@radix-ui/react-dialog";

import { cardImageUrl } from "../projection/labels.ts";
import animations from "./animations.module.css";
import classes from "./board.module.css";
import cards from "./cards.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import type { BoardKit } from "./types.ts";

export function MulliganBanner({ kit }: { readonly kit: BoardKit }) {
  const { projection } = kit;
  const hand = projection.bottom.hand;
  const preventDismissal = (event: Event) => event.preventDefault();
  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className={`${classes.backdrop} ${animations.fadeIn}`} />
        <Dialog.Content
          aria-modal="true"
          className={classes.dialog}
          data-testid="naruto-mulligan"
          onEscapeKeyDown={preventDismissal}
          onInteractOutside={preventDismissal}
        >
          <Dialog.Title className={classes.dialogTitle}>Opening hand</Dialog.Title>
          <Dialog.Description className={classes.dialogPrompt}>
            Keep this hand, or shuffle it back and redraw?
          </Dialog.Description>
          <div className={classes.choiceGrid}>
            {hand.map((card) => (
              <span key={card.uid} className={cards.card} style={{ cursor: "default" }}>
                <NarutoCardImage
                  className={cards.cardArt}
                  src={card.visible ? cardImageUrl(card.cardId) : undefined}
                  alt={card.visible ? card.name : "Hidden card"}
                  draggable={false}
                  fallbackLabel={card.visible ? card.name : "Card back"}
                />
                <span className={cards.cardName}>{card.visible ? card.name : "Hidden card"}</span>
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
