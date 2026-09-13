/** Summon zone: selected side card, rests (dims) once used this turn. */

import type { PlayerId } from "@tcg-engines/naruto-engine";
import { CardInteractionFrame } from "@tcg/simulator-ui";

import { cardImageUrl, cardName } from "../projection/labels.ts";
import type { SummonView } from "../projection/projectSimulator.ts";
import cards from "./cards.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import { cardInteractionStateFor, type BoardKit } from "./types.ts";

export function SummonSlot({
  summon,
  owner,
  kit,
}: {
  readonly summon: SummonView;
  readonly owner: PlayerId;
  readonly kit: BoardKit;
}) {
  const interactionState = cardInteractionStateFor(kit, summon.uid);
  return (
    <button
      type="button"
      className={cards.slot}
      data-testid={`naruto-summon-${owner}`}
      data-card-id={summon.cardId}
      data-rested={summon.rested || undefined}
      style={summon.rested ? { opacity: 0.45, transform: "rotate(90deg) scale(0.72)" } : undefined}
      aria-label={
        summon.rested
          ? `${cardName(summon.cardId)} Summon zone (used this turn)`
          : `${cardName(summon.cardId)} Summon zone`
      }
      onClick={() => kit.onEntityClick(summon.uid, "summon", owner)}
      onMouseEnter={() => kit.onInspect(summon.uid, "summon", owner)}
      onMouseLeave={() => kit.onInspect(null, null, null)}
      onFocus={() => kit.onInspect(summon.uid, "summon", owner)}
    >
      <CardInteractionFrame state={interactionState}>
        <NarutoCardImage
          className={cards.sideCardArt}
          src={cardImageUrl(summon.cardId)}
          alt=""
          draggable={false}
          fallbackLabel={cardName(summon.cardId)}
        />
      </CardInteractionFrame>
    </button>
  );
}
