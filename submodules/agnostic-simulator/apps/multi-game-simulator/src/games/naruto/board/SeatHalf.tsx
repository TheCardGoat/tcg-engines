/**
 * One desktop seat is a three-row board: a double-height battlefield with the
 * leader and units, a support line, then a compact utility line.
 */

import type { PlayerId } from "@tcg-engines/naruto-engine";

import { cardImageUrl, cardName } from "../projection/labels.ts";
import type { SeatView } from "../projection/projectSimulator.ts";
import { CharacterCard } from "./CharacterCard.tsx";
import { ChakraPips } from "./ChakraPips.tsx";
import { LeaderZone } from "./LeaderZone.tsx";
import { SupportSlot } from "./SupportSlot.tsx";
import animations from "./animations.module.css";
import classes from "./board.module.css";
import cards from "./cards.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import { DropSlot } from "./DropSlot.tsx";
import { SummonSlot } from "./SummonSlot.tsx";
import { SupportPlayDropZone } from "./SupportPlayDropZone.tsx";
import type { BoardKit } from "./types.ts";

export { SummonSlot } from "./SummonSlot.tsx";

export interface SeatHalfProps {
  readonly seat: SeatView;
  readonly side: "top" | "bottom";
  readonly kit: BoardKit;
}

export function DeckStack({ count, owner }: { readonly count: number; readonly owner: PlayerId }) {
  return (
    <div className={cards.stack} data-testid={`naruto-deck-${owner}`} data-count={count}>
      <span key={count} className={`${cards.stackFrame} ${animations.deckTick}`}>
        {count}
      </span>
      <span className={cards.stackCount}>deck</span>
    </div>
  );
}

/** Public count of characters placed in the EX pile. */
export function ExStack({ count, owner }: { readonly count: number; readonly owner: PlayerId }) {
  return (
    <div className={cards.stack} data-testid={`naruto-ex-${owner}`} data-count={count}>
      <span className={cards.stackFrame}>{count}</span>
      <span className={cards.stackCount}>EX</span>
    </div>
  );
}

export function TrashStack({
  count,
  topUid,
  topCardId,
  owner,
  kit,
}: {
  readonly count: number;
  readonly topUid: string | null;
  readonly topCardId: string | null;
  readonly owner: PlayerId;
  readonly kit: BoardKit;
}) {
  return (
    <div className={cards.stack} data-testid={`naruto-trash-${owner}`} data-count={count}>
      <button
        type="button"
        className={`${cards.stackFrame} ${classes.mobileTrashButton}`}
        style={{ padding: 0, cursor: count > 0 ? "pointer" : "default", border: "none" }}
        aria-label={`Trash, ${count} cards`}
        onClick={() => (topUid ? kit.onEntityClick(topUid, "trash", owner) : undefined)}
        onMouseEnter={() => (topUid ? kit.onInspect(topUid, "trash", owner) : undefined)}
        onMouseLeave={() => kit.onInspect(null, null, null)}
      >
        <span className={classes.mobileTrashFrame}>
          {topCardId ? (
            <NarutoCardImage
              src={cardImageUrl(topCardId)}
              alt=""
              draggable={false}
              fallbackLabel={cardName(topCardId)}
            />
          ) : (
            count
          )}
        </span>
      </button>
      <span className={cards.stackCount}>trash</span>
    </div>
  );
}

export function SeatHalf({ seat, side, kit }: SeatHalfProps) {
  const halfClasses = [
    classes.half,
    side === "top" ? classes.halfTop : "",
    seat.isActive ? classes.halfActive : "",
  ]
    .filter(Boolean)
    .join(" ");

  const chakra = <ChakraPips chakra={seat.chakra} owner={seat.player} kit={kit} />;
  const summon = <SummonSlot summon={seat.summon} owner={seat.player} kit={kit} />;
  const deck = <DeckStack count={seat.deckCount} owner={seat.player} />;
  const trash = (
    <TrashStack
      count={seat.trashCount}
      topUid={seat.trashTop?.uid ?? null}
      topCardId={seat.trashTop?.cardId ?? null}
      owner={seat.player}
      kit={kit}
    />
  );
  const utilityRow = (
    <SupportPlayDropZone owner={seat.player} kit={kit} className={classes.utilityRow}>
      {chakra}
      {summon}
      {deck}
      {trash}
    </SupportPlayDropZone>
  );

  return (
    <section
      className={halfClasses}
      data-testid={`naruto-half-${seat.player}`}
      data-side={side}
      data-active={seat.isActive || undefined}
      aria-label={`${seat.name}'s board`}
    >
      {side === "top" ? utilityRow : null}
      <div className={classes.seatGrid} data-testid={`naruto-seat-grid-${seat.player}`}>
        <div className={classes.leaderColumn}>
          <LeaderZone leader={seat.leader} owner={seat.player} side={side} kit={kit} />
        </div>
        <div className={classes.laneColumn} data-testid={`naruto-lanes-${seat.player}`}>
          <div className={classes.characterLane}>
            <div className={classes.slotRow} data-testid={`naruto-characters-${seat.player}`}>
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
          </div>
          <div className={classes.supportLane}>
            <div className={classes.slotRow} data-testid={`naruto-supports-${seat.player}`}>
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
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      {side === "bottom" ? utilityRow : null}
    </section>
  );
}
