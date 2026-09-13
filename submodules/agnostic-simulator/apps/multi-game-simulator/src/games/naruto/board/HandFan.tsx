/**
 * Hand presentation: bottom seat = clickable fan with 45ms deal stagger;
 * top seat = compact card backs with a count.
 */

import { useDraggable } from "@dnd-kit/core";
import type { ReactNode, Ref } from "react";

import type { PlayerId } from "@tcg-engines/naruto-engine";
import { CardInteractionFrame } from "@tcg/simulator-ui";

import { CARD_BACK_URL, cardImageUrl } from "../projection/labels.ts";
import type { HandCardView } from "../projection/projectSimulator.ts";
import { PillRow } from "./PillRow.tsx";
import animations from "./animations.module.css";
import classes from "./cards.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import { ActionBadges } from "./ActionBadge.tsx";
import {
  cardInteractionStateFor,
  dragTargetsFor,
  isSelected,
  pillsFor,
  type BoardKit,
  type NarutoDropTarget,
} from "./types.ts";

export interface HandFanProps {
  readonly hand: readonly HandCardView[];
  readonly owner: PlayerId;
  readonly kit: BoardKit;
  readonly variant?: "desktop" | "mobile";
  readonly scrollContainerRef?: Ref<HTMLDivElement>;
  readonly onScroll?: () => void;
}

function DraggableHandCard({
  uid,
  targets,
  children,
}: {
  readonly uid: string;
  readonly targets: readonly NarutoDropTarget[];
  readonly children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `naruto-hand:${uid}`,
    disabled: targets.length === 0,
  });

  return (
    <span
      ref={setNodeRef}
      {...(targets.length > 0 ? attributes : {})}
      {...(targets.length > 0 ? listeners : {})}
      data-drag-kind={targets.join(" ") || undefined}
      style={isDragging ? { opacity: 0.4 } : undefined}
    >
      {children}
    </span>
  );
}

export function HandFan({
  hand,
  owner,
  kit,
  variant = "desktop",
  scrollContainerRef,
  onScroll,
}: HandFanProps) {
  return (
    <div
      ref={scrollContainerRef}
      className={`${classes.fan} ${variant === "mobile" ? classes.fanMobile : ""}`}
      data-testid={`naruto-hand-${owner}`}
      data-count={hand.length}
      onScroll={onScroll}
    >
      {hand.map((card) => {
        const selected = isSelected(kit, card.uid);
        const cardPills = pillsFor(kit, card.uid);
        const pills = selected ? cardPills : [];
        const availablePills = cardPills.filter((pill) => pill.enabled);
        const interactionState = cardInteractionStateFor(kit, card.uid);
        const dragTargets = dragTargetsFor(cardPills);
        const classNames = [classes.card, classes.handCard, classes.clickable, animations.handDeal]
          .filter(Boolean)
          .join(" ");
        return (
          <span key={card.uid} className={classes.cardWrap}>
            <DraggableHandCard uid={card.uid} targets={dragTargets}>
              <button
                type="button"
                className={classNames}
                data-testid={`naruto-hand-card-${card.uid}`}
                data-board-uid={card.uid}
                aria-label={card.visible ? `${card.name} (in hand)` : "Hidden card in hand"}
                onClick={() => kit.onEntityClick(card.uid, "hand", owner)}
                onMouseEnter={() =>
                  card.visible ? kit.onInspect(card.uid, "hand", owner) : undefined
                }
                onMouseLeave={() => kit.onInspect(null, null, null)}
                onFocus={() => (card.visible ? kit.onInspect(card.uid, "hand", owner) : undefined)}
              >
                <CardInteractionFrame state={interactionState}>
                  <NarutoCardImage
                    className={classes.cardArt}
                    src={card.visible ? cardImageUrl(card.cardId) : CARD_BACK_URL}
                    alt=""
                    draggable={false}
                    fallbackLabel={card.visible ? card.name : "Card back"}
                  />
                  <ActionBadges pills={availablePills} />
                </CardInteractionFrame>
                {card.visible ? <span className={classes.cardName}>{card.name}</span> : null}
              </button>
            </DraggableHandCard>
            <PillRow pills={pills} onPill={kit.onPill} />
          </span>
        );
      })}
    </div>
  );
}

/** Compact opponent hand: face-down backs + count. */
export function HandBacks({ count, owner }: { readonly count: number; readonly owner: PlayerId }) {
  return (
    <div
      className={classes.backRow}
      data-testid={`naruto-hand-${owner}`}
      data-count={count}
      aria-label={`Opponent hand, ${count} cards`}
      role="img"
    >
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={classes.card}>
          <NarutoCardImage
            className={classes.cardArt}
            src={CARD_BACK_URL}
            alt=""
            draggable={false}
            fallbackLabel="Card back"
          />
        </span>
      ))}
    </div>
  );
}

/** Public count of cards in the opponent's hidden hand. */
export function HandCount({ count, owner }: { readonly count: number; readonly owner: PlayerId }) {
  return (
    <div
      className={classes.stack}
      data-testid={`naruto-hand-count-${owner}`}
      data-count={count}
      aria-label={`Opponent hand, ${count} cards`}
      role="img"
    >
      <span className={classes.stackFrame}>{count}</span>
      <span className={classes.stackCount}>hand</span>
    </div>
  );
}
