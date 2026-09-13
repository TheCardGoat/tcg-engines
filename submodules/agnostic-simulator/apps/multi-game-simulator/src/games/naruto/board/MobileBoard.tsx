/**
 * Mobile board tree (<900px, portrait): each seat's public zones live in a
 * single compact strip so both battle rows, the phase prompt, the hand, and
 * the fixed bottom controls stay visible without scrolling the board.
 */

import { useEffect, useRef, useState } from "react";

import { CharacterCard } from "./CharacterCard.tsx";
import { ChakraPips } from "./ChakraPips.tsx";
import { HandCount, HandFan } from "./HandFan.tsx";
import { LeaderZone } from "./LeaderZone.tsx";
import { DeckStack, ExStack, TrashStack } from "./SeatHalf.tsx";
import { SeamPrompt } from "./SeamPrompt.tsx";
import { SupportPlayDropZone } from "./SupportPlayDropZone.tsx";
import { SupportSlot } from "./SupportSlot.tsx";
import classes from "./board.module.css";
import { DropSlot } from "./DropSlot.tsx";
import type { BoardKit } from "./types.ts";
import type { SeatView } from "../projection/projectSimulator.ts";

export interface MobileBoardProps {
  readonly kit: BoardKit;
}

function MobileSeat({
  seat,
  side,
  kit,
}: {
  readonly seat: SeatView;
  readonly side: "top" | "bottom";
  readonly kit: BoardKit;
}) {
  const characterRow = (
    <div
      className={`${classes.slotRow} ${classes.mobileCharacterRow}`}
      data-testid={`naruto-characters-${seat.player}`}
    >
      {seat.characters.map((character, index) =>
        character ? (
          <CharacterCard
            key={character.uid}
            character={character}
            owner={seat.player}
            side={side}
            kit={kit}
          />
        ) : (
          <DropSlot
            key={`empty-${index}`}
            kind="battler"
            owner={seat.player}
            slot={index}
            kit={kit}
          />
        ),
      )}
    </div>
  );
  const supportRow = (
    <div
      className={`${classes.slotRow} ${classes.mobileSupportRow}`}
      data-testid={`naruto-supports-${seat.player}`}
    >
      <span className="sr-only" data-testid={`naruto-mobile-support-capacity-${seat.player}`}>
        {seat.supports.filter(Boolean).length}/{seat.supports.length}
      </span>
      {seat.supports.map((support, index) =>
        support ? (
          <SupportSlot key={support.uid} support={support} owner={seat.player} kit={kit} />
        ) : (
          <DropSlot
            key={`empty-${index}`}
            kind="support"
            owner={seat.player}
            slot={index}
            kit={kit}
            className={classes.mobileSupportEmpty}
          />
        ),
      )}
    </div>
  );
  const zoneGuide = (
    <SupportPlayDropZone
      owner={seat.player}
      kit={kit}
      className={`${classes.mobileSeatStrip} ${side === "top" ? classes.mobileSeatStripWithHandCount : ""}`}
    >
      <LeaderZone
        leader={seat.leader}
        owner={seat.player}
        side={side}
        kit={kit}
        showActionBadges={false}
      />
      <div className={classes.mobileResourceGroup}>
        <ChakraPips chakra={seat.chakra} owner={seat.player} summon={seat.summon} kit={kit} />
      </div>
      <ExStack count={seat.exCount} owner={seat.player} />
      <DeckStack count={seat.deckCount} owner={seat.player} />
      <TrashStack
        count={seat.trashCount}
        topUid={seat.trashTop?.uid ?? null}
        topCardId={seat.trashTop?.cardId ?? null}
        owner={seat.player}
        kit={kit}
      />
      {side === "top" ? <HandCount count={seat.hand.length} owner={seat.player} /> : null}
    </SupportPlayDropZone>
  );

  return (
    <section
      className={`${classes.mobileSeat} ${seat.isActive ? classes.mobileSeatActive : ""}`}
      data-testid={`naruto-mobile-seat-${seat.player}`}
      data-side={side}
      aria-label={`${seat.name}'s board`}
    >
      {side === "top" ? zoneGuide : null}
      {side === "top" ? supportRow : characterRow}
      {side === "top" ? characterRow : supportRow}
      {side === "bottom" ? zoneGuide : null}
    </section>
  );
}

export function MobileBoard({ kit }: MobileBoardProps) {
  const { projection } = kit;
  const handRef = useRef<HTMLDivElement>(null);
  const [handOverflow, setHandOverflow] = useState({ left: 0, right: 0 });

  const updateOffscreenHandCards = () => {
    const hand = handRef.current;
    if (!hand) return;
    const visibleRight = hand.scrollLeft + hand.clientWidth;
    const cards = [...hand.querySelectorAll<HTMLElement>('[data-testid^="naruto-hand-card-"]')];
    setHandOverflow({
      left: cards.filter(
        (card) => card.parentElement && card.parentElement.offsetLeft < hand.scrollLeft - 1,
      ).length,
      right: cards.filter(
        (card) =>
          card.parentElement &&
          card.parentElement.offsetLeft + card.parentElement.offsetWidth > visibleRight + 1,
      ).length,
    });
  };

  useEffect(() => {
    updateOffscreenHandCards();
    window.addEventListener("resize", updateOffscreenHandCards);
    return () => window.removeEventListener("resize", updateOffscreenHandCards);
  }, [projection.bottom.hand.length]);

  const scrollHandToEnd = () => {
    handRef.current?.scrollTo({ left: handRef.current.scrollWidth, behavior: "smooth" });
  };

  const scrollHandToStart = () => {
    handRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <div className={classes.mobileColumn} data-testid="naruto-mobile-board">
      <MobileSeat seat={projection.top} side="top" kit={kit} />
      <SeamPrompt kit={kit} sticky />
      <MobileSeat seat={projection.bottom} side="bottom" kit={kit} />
      <div className={classes.mobileHand} data-testid="naruto-mobile-hand">
        <div className={classes.mobileHandInner}>
          <HandFan
            hand={projection.bottom.hand}
            owner={projection.bottom.player}
            kit={kit}
            variant="mobile"
            scrollContainerRef={handRef}
            onScroll={updateOffscreenHandCards}
          />
          {handOverflow.left > 0 ? (
            <button
              type="button"
              className={`${classes.mobileHandScrollButton} ${classes.mobileHandScrollButtonLeft}`}
              data-testid="naruto-hand-scroll-start"
              aria-label={`Show ${handOverflow.left} hand cards to the left`}
              onClick={scrollHandToStart}
            >
              <svg viewBox="0 0 16 24" aria-hidden="true">
                <path d="m12 3-7 9 7 9" />
              </svg>
              <span className={classes.mobileHandScrollCount}>{handOverflow.left}</span>
              <span className={classes.mobileHandScrollLabel}>more</span>
            </button>
          ) : null}
          {handOverflow.right > 0 ? (
            <button
              type="button"
              className={classes.mobileHandScrollButton}
              data-testid="naruto-hand-scroll-end"
              aria-label={`Show ${handOverflow.right} hand cards to the right`}
              onClick={scrollHandToEnd}
            >
              <svg viewBox="0 0 16 24" aria-hidden="true">
                <path d="m4 3 7 9-7 9" />
              </svg>
              <span className={classes.mobileHandScrollCount}>{handOverflow.right}</span>
              <span className={classes.mobileHandScrollLabel}>more</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
