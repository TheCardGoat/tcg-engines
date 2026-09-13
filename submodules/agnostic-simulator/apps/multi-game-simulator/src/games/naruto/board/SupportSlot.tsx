/**
 * Support slot: face-down (masked for the opponent / veiled for owner until
 * revealed), chain badge, activate pill when selected.
 */

import type { PlayerId } from "@tcg-engines/naruto-engine";
import { CardInteractionFrame } from "@tcg/simulator-ui";

import { CARD_BACK_URL, cardImageUrl } from "../projection/labels.ts";
import type { SupportView } from "../projection/projectSimulator.ts";
import { PillRow } from "./PillRow.tsx";
import animations from "./animations.module.css";
import classes from "./cards.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import { ActionBadges } from "./ActionBadge.tsx";
import { cardInteractionStateFor, isSelected, pillsFor, type BoardKit } from "./types.ts";

export interface SupportSlotProps {
  readonly support: SupportView;
  readonly owner: PlayerId;
  readonly kit: BoardKit;
}

export function SupportSlot({ support, owner, kit }: SupportSlotProps) {
  const selected = isSelected(kit, support.uid);
  const entityPills = pillsFor(kit, support.uid);
  const pills = selected ? entityPills : [];
  const availablePills = entityPills.filter((pill) => pill.enabled);
  const interactionState = cardInteractionStateFor(kit, support.uid);
  const faceDown = !support.visible || !support.revealed;

  const classNames = [
    classes.card,
    classes.clickable,
    support.revealed ? classes.attackSource : "",
    animations.cardLand,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes.cardWrap}>
      <button
        type="button"
        className={classNames}
        data-testid={`naruto-support-${support.uid}`}
        data-board-uid={support.uid}
        data-slot-index={support.slotIndex}
        data-revealed={support.revealed || undefined}
        aria-label={
          support.visible
            ? `${support.name}${support.revealed ? ", revealed" : ", set support"}`
            : "Opponent's face-down support"
        }
        onClick={() => kit.onEntityClick(support.uid, "support", owner)}
        onMouseEnter={() =>
          support.visible ? kit.onInspect(support.uid, "support", owner) : undefined
        }
        onMouseLeave={() => kit.onInspect(null, null, null)}
        onFocus={() => (support.visible ? kit.onInspect(support.uid, "support", owner) : undefined)}
      >
        <CardInteractionFrame state={interactionState}>
          <NarutoCardImage
            className={`${classes.cardArt} ${faceDown ? classes.cardArtHidden : ""}`}
            src={faceDown ? CARD_BACK_URL : cardImageUrl(support.cardId)}
            alt=""
            draggable={false}
            fallbackLabel={faceDown ? "Card back" : support.name}
          />
          <ActionBadges pills={availablePills} />
        </CardInteractionFrame>
        {support.chainLink !== null ? (
          <span className={`${classes.statChip} ${classes.chainBadge}`}>{support.chainLink}</span>
        ) : null}
        {support.visible ? <span className={classes.cardName}>{support.name}</span> : null}
      </button>
      <PillRow pills={pills} onPill={kit.onPill} />
    </span>
  );
}
