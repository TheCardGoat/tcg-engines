/**
 * Leader block: 1.6x card + life badge (keyed pop on change), rested state,
 * attack/choice target rings, leader pills (attack / effect / recovery).
 */

import type { PlayerId } from "@tcg-engines/naruto-engine";
import { CardInteractionFrame } from "@tcg/simulator-ui";

import { cardImageUrl } from "../projection/labels.ts";
import type { LeaderView } from "../projection/projectSimulator.ts";
import { PillRow } from "./PillRow.tsx";
import animations from "./animations.module.css";
import board from "./board.module.css";
import classes from "./cards.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import { ActionBadges } from "./ActionBadge.tsx";
import { cardInteractionStateFor, isSelected, pillsFor, type BoardKit } from "./types.ts";

export interface LeaderZoneProps {
  readonly leader: LeaderView;
  readonly owner: PlayerId;
  readonly side: "top" | "bottom";
  readonly kit: BoardKit;
  readonly showActionBadges?: boolean;
}

export function LeaderZone({ leader, owner, side, kit, showActionBadges = true }: LeaderZoneProps) {
  const selected = isSelected(kit, leader.uid);
  const interactionState = cardInteractionStateFor(kit, leader.uid);
  const attacking = kit.projection.attack?.attackerUid === leader.uid;
  const draftSource = kit.attackDraft?.attackerUid === leader.uid;
  const entityPills = pillsFor(kit, leader.uid);
  const pills = selected ? entityPills : [];
  const availablePills = entityPills.filter((pill) => pill.enabled);

  const classNames = [
    classes.card,
    classes.leaderCard,
    classes.clickable,
    leader.rested ? classes.rested : "",
    attacking || draftSource ? classes.attackSource : "",
    attacking ? (side === "bottom" ? animations.lungeUp : animations.lungeDown) : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={board.leaderBlock} data-testid={`naruto-leader-${owner}`}>
      <span className={classes.cardWrap}>
        <button
          type="button"
          className={classNames}
          data-board-uid={leader.uid}
          data-rested={leader.rested || undefined}
          aria-label={`${leader.name}, leader, ${leader.life} life`}
          onClick={() => kit.onEntityClick(leader.uid, "leader", owner)}
          onMouseEnter={() => kit.onInspect(leader.uid, "leader", owner)}
          onMouseLeave={() => kit.onInspect(null, null, null)}
          onFocus={() => kit.onInspect(leader.uid, "leader", owner)}
        >
          <CardInteractionFrame state={interactionState}>
            <NarutoCardImage
              className={`${classes.cardArt} ${board.mobileLeaderArt}`}
              src={cardImageUrl(leader.cardId)}
              alt=""
              draggable={false}
              fallbackLabel={leader.name}
            />
            {showActionBadges ? <ActionBadges pills={availablePills} /> : null}
          </CardInteractionFrame>
          <span className={`${classes.statChip} ${classes.powerChip}`}>{leader.power}</span>
          <span className={classes.cardName}>{leader.name}</span>
        </button>
        <PillRow pills={pills} onPill={kit.onPill} />
      </span>
      <span
        key={leader.life}
        className={`${classes.lifeBadge} ${animations.lifePop}`}
        data-testid={`naruto-life-${owner}`}
        data-life={leader.life}
      >
        {leader.life}
      </span>
    </div>
  );
}
