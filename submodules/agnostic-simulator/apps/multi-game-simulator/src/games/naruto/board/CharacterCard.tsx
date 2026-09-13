/**
 * Board character: rested rotation, damage/bonus badges (keyed pops), chain
 * number, power-doubled tint, target/attack rings, contextual pills.
 */

import type { PlayerId } from "@tcg-engines/naruto-engine";
import { CardInteractionFrame } from "@tcg/simulator-ui";

import { cardImageUrl } from "../projection/labels.ts";
import type { CharacterView } from "../projection/projectSimulator.ts";
import { PillRow } from "./PillRow.tsx";
import animations from "./animations.module.css";
import classes from "./cards.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import { ActionBadges } from "./ActionBadge.tsx";
import { cardInteractionStateFor, isSelected, pillsFor, type BoardKit } from "./types.ts";

export interface CharacterCardProps {
  readonly character: CharacterView;
  readonly owner: PlayerId;
  readonly side: "top" | "bottom";
  readonly kit: BoardKit;
}

export function CharacterCard({ character, owner, side, kit }: CharacterCardProps) {
  const selected = isSelected(kit, character.uid);
  const interactionState = cardInteractionStateFor(kit, character.uid);
  const attacking = kit.projection.attack?.attackerUid === character.uid;
  const draftSource = kit.attackDraft?.attackerUid === character.uid;
  const entityPills = pillsFor(kit, character.uid);
  const pills = selected ? entityPills : [];
  const availablePills = entityPills.filter((pill) => pill.enabled);

  const classNames = [
    classes.card,
    classes.clickable,
    character.rested ? classes.rested : "",
    character.doubled ? classes.doubled : "",
    attacking || draftSource ? classes.attackSource : "",
    attacking
      ? side === "bottom"
        ? animations.lungeUp
        : animations.lungeDown
      : animations.cardLand,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes.cardWrap}>
      <button
        type="button"
        className={classNames}
        data-testid={`naruto-character-${character.uid}`}
        data-board-uid={character.uid}
        data-slot-index={character.slotIndex}
        data-power={character.power}
        data-rested={character.rested || undefined}
        aria-label={`${character.name}, power ${character.power}, health ${character.health - character.damage} of ${character.health}`}
        onClick={() => kit.onEntityClick(character.uid, "character", owner)}
        onMouseEnter={() => kit.onInspect(character.uid, "character", owner)}
        onMouseLeave={() => kit.onInspect(null, null, null)}
        onFocus={() => kit.onInspect(character.uid, "character", owner)}
      >
        <CardInteractionFrame state={interactionState}>
          <NarutoCardImage
            className={classes.cardArt}
            src={cardImageUrl(character.cardId)}
            alt=""
            draggable={false}
            fallbackLabel={character.name}
          />
          <ActionBadges pills={availablePills} />
        </CardInteractionFrame>
        {character.chainLink !== null ? (
          <span
            className={`${classes.statChip} ${classes.chainBadge}`}
            data-chain={character.chainLink}
          >
            {character.chainLink}
          </span>
        ) : null}
        {character.powerBonus > 0 ? (
          <span className={`${classes.statChip} ${classes.bonusBadge}`}>
            +{character.powerBonus}
          </span>
        ) : null}
        {character.damage > 0 ? (
          <span
            key={character.damage}
            className={`${classes.statChip} ${classes.damageBadge} ${animations.damagePop}`}
            data-damage={character.damage}
          >
            -{character.damage}
          </span>
        ) : null}
        <span
          className={`${classes.statChip} ${classes.powerChip}`}
          data-testid={`naruto-power-${character.uid}`}
        >
          {character.power}
        </span>
        <span className={`${classes.statChip} ${classes.healthChip}`}>
          {Math.max(0, character.health - character.damage)}/{character.health}
        </span>
        <span className={classes.cardName}>{character.name}</span>
      </button>
      <PillRow pills={pills} onPill={kit.onPill} />
    </span>
  );
}
