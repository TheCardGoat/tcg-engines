/**
 * Hand presentation: bottom seat = clickable fan with 45ms deal stagger;
 * top seat = compact card backs with a count.
 */

import type { PlayerId } from "@tcg-engines/naruto-engine";

import { CARD_BACK_URL, cardImageUrl } from "../projection/labels.ts";
import type { HandCardView } from "../projection/projectSimulator.ts";
import { PillRow } from "./PillRow.tsx";
import animations from "./animations.module.css";
import classes from "./cards.module.css";
import { isSelected, pillsFor, type BoardKit } from "./types.ts";

export interface HandFanProps {
  readonly hand: readonly HandCardView[];
  readonly owner: PlayerId;
  readonly kit: BoardKit;
}

export function HandFan({ hand, owner, kit }: HandFanProps) {
  return (
    <div className={classes.fan} data-testid={`naruto-hand-${owner}`} data-count={hand.length}>
      {hand.map((card) => {
        const selected = isSelected(kit, card.uid);
        const pills = selected ? pillsFor(kit, card.uid) : [];
        const classNames = [
          classes.card,
          classes.handCard,
          classes.clickable,
          selected ? classes.selected : "",
          animations.handDeal,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <span key={card.uid} className={classes.cardWrap}>
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
              <img
                className={classes.cardArt}
                src={card.visible ? cardImageUrl(card.cardId) : CARD_BACK_URL}
                alt=""
                draggable={false}
              />
              {card.visible ? <span className={classes.cardName}>{card.name}</span> : null}
            </button>
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
          <img className={classes.cardArt} src={CARD_BACK_URL} alt="" draggable={false} />
        </span>
      ))}
    </div>
  );
}
