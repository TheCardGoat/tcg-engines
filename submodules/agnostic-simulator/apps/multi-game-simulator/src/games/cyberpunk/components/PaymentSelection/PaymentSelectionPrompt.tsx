import { defOf, type CardInstanceId } from "@tcg/cyberpunk-engine";
import { usePromptSkin } from "../Prompt/PromptSkin";
import { X } from "lucide-react";

import { PLAYER_SIDE_TO_ID, useEngine, type CardDragSource } from "../../engine";
import { CARD_BACK, LEGEND_CARD_BACK } from "../GameBoard/CardImage";
import { DragCardImage, useDragDrop } from "../GameBoard/DragDropContext";
import { usePeekedLegendsForSide, type PeekedLegends } from "../GameBoard/peekedLegends";
import { usePaymentSelection } from "./PaymentSelectionContext";
import classes from "./PaymentSelectionPrompt.module.css";

/** Payment-only board prompt; see ../Prompt/index.ts for the full surface map. */
export function PaymentSelectionPrompt({
  surface = "desktop",
}: {
  surface?: "desktop" | "mobile";
}) {
  const promptSkin = usePromptSkin();
  const engine = useEngine();
  const { pendingPaymentCard } = useDragDrop();
  const {
    paymentSelectionActive,
    paymentCost,
    selectedPaymentCount,
    paymentCardId,
    payAutomatically,
    cancelPaymentSelection,
  } = usePaymentSelection();
  const peekedLegends = usePeekedLegendsForSide(
    engine.moveLogs,
    engine.humanSide,
    engine.matchState.G.turnMetadata.turnNumber,
  );

  if (!paymentSelectionActive) return null;

  // Card art rides the drag session when the play started as a drag; plays
  // opened from the card menu only carry the engine card id, so resolve it.
  const paymentCard =
    pendingPaymentCard ?? resolvePaymentCardSource(engine, paymentCardId, peekedLegends);
  const remaining = paymentCost - selectedPaymentCount;
  const sourceNoun = remaining === 1 ? "Eddie or Legend" : "Eddies or Legends";
  const partial = selectedPaymentCount > 0;

  return (
    <section
      className={classes.root}
      data-surface={surface}
      data-prompt-skin={promptSkin}
      aria-label="Choose payment"
      aria-live="polite"
    >
      <div className={classes.copy}>
        <strong>Choose payment</strong>
        <span>
          {`Select ${remaining} ready ${sourceNoun} on your board, or pay${
            partial ? " the rest" : ""
          } automatically.`}
        </span>
      </div>
      <span
        className={classes.progress}
        aria-label={`${selectedPaymentCount} of ${paymentCost} selected`}
      >
        {selectedPaymentCount}/{paymentCost} €$
      </span>
      <button
        type="button"
        className={classes.hybrid}
        onClick={payAutomatically}
        aria-keyshortcuts="Enter"
      >
        <span>{partial ? "Pay rest automatically" : "Pay automatically"}</span> <kbd>Enter</kbd>
      </button>
      <button
        type="button"
        className={classes.cancel}
        onClick={cancelPaymentSelection}
        aria-label="Cancel payment selection"
      >
        <X size={16} aria-hidden="true" />
        <span>Cancel</span>
      </button>
      {paymentCard && (
        <div className={classes.pendingCard} aria-label="Card awaiting payment">
          <DragCardImage source={paymentCard} />
        </div>
      )}
    </section>
  );
}

function resolvePaymentCardSource(
  engine: ReturnType<typeof useEngine>,
  paymentCardId: string | null,
  peekedLegends: PeekedLegends,
): CardDragSource | null {
  if (!paymentCardId) return null;
  const card = engine.matchState.G.cardIndex[paymentCardId];
  if (!card) return null;
  const def = defOf(card);
  // Presented Legends are concealed face-down in random order (CR 7.7), so
  // even the owner learns which slot holds which Legend only through game
  // reveals. A payment prompt can be cancelled for free, so its preview must
  // not turn those slots into a free identify-everything oracle.
  const humanPlayerId = String(PLAYER_SIDE_TO_ID[engine.humanSide]);
  const legendIndex =
    card.zone === "legendArea" && String(card.ownerId) === humanPlayerId
      ? (engine.matchState.G.players[humanPlayerId]?.zones.legendArea.indexOf(
          paymentCardId as CardInstanceId,
        ) ?? -1)
      : -1;
  const peeked =
    peekedLegends.ids.has(paymentCardId) ||
    (legendIndex >= 0 && peekedLegends.indexes.has(legendIndex));
  const concealed =
    card.zone === "legendArea" &&
    card.meta.faceDown === true &&
    card.meta.revealed !== true &&
    !peeked;
  return {
    type: "card",
    zone: String(card.zone),
    index: 0,
    cardId: paymentCardId,
    name: concealed ? "Hidden card" : def.displayName,
    imageUrl: concealed ? (def.type === "legend" ? LEGEND_CARD_BACK : CARD_BACK) : def.imageUrl,
  };
}
