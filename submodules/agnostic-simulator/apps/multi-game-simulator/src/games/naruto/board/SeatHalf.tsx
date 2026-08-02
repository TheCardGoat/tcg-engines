/**
 * One seat half (desktop): [chakra + summon flank] [characters over supports]
 * [deck/trash flank + leader block]. Opponent half renders row-reverse.
 */

import type { PlayerId } from "@tcg-engines/naruto-engine";

import { cardImageUrl } from "../projection/labels.ts";
import type { SeatView } from "../projection/projectSimulator.ts";
import { CharacterCard } from "./CharacterCard.tsx";
import { ChakraPips } from "./ChakraPips.tsx";
import { LeaderZone } from "./LeaderZone.tsx";
import { SupportSlot } from "./SupportSlot.tsx";
import animations from "./animations.module.css";
import classes from "./board.module.css";
import cards from "./cards.module.css";
import type { BoardKit } from "./types.ts";

export interface SeatHalfProps {
  readonly seat: SeatView;
  readonly side: "top" | "bottom";
  readonly kit: BoardKit;
}

function DeckStack({ count, owner }: { readonly count: number; readonly owner: PlayerId }) {
  return (
    <div className={cards.stack} data-testid={`naruto-deck-${owner}`} data-count={count}>
      <span key={count} className={`${cards.stackFrame} ${animations.deckTick}`}>
        {count}
      </span>
      <span className={cards.stackCount}>deck</span>
    </div>
  );
}

function TrashStack({
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
        className={cards.stackFrame}
        style={{ padding: 0, cursor: count > 0 ? "pointer" : "default", border: "none" }}
        aria-label={`Trash, ${count} cards`}
        onClick={() => (topUid ? kit.onEntityClick(topUid, "trash", owner) : undefined)}
        onMouseEnter={() => (topUid ? kit.onInspect(topUid, "trash", owner) : undefined)}
        onMouseLeave={() => kit.onInspect(null, null, null)}
      >
        {topCardId ? <img src={cardImageUrl(topCardId)} alt="" draggable={false} /> : count}
      </button>
      <span className={cards.stackCount}>trash</span>
    </div>
  );
}

/** Summon zone: 1-slot indicator, rests (dims) once used this turn. */
function SummonSlot({ rested, owner }: { readonly rested: boolean; readonly owner: PlayerId }) {
  return (
    <div
      className={cards.slot}
      data-testid={`naruto-summon-${owner}`}
      data-rested={rested || undefined}
      style={rested ? { opacity: 0.45, transform: "rotate(90deg) scale(0.72)" } : undefined}
      aria-label={rested ? "Summon zone (used this turn)" : "Summon zone"}
      role="img"
    >
      summon
    </div>
  );
}

export function SeatHalf({ seat, side, kit }: SeatHalfProps) {
  const halfClasses = [
    classes.half,
    side === "top" ? classes.halfTop : "",
    seat.isActive ? `${classes.halfActive} ${animations.breatheOpacity}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={halfClasses}
      data-testid={`naruto-half-${seat.player}`}
      data-side={side}
      data-active={seat.isActive || undefined}
      aria-label={`${seat.name}'s board`}
    >
      <div className={classes.halfFlank}>
        <ChakraPips chakra={seat.chakra} owner={seat.player} />
        <SummonSlot rested={seat.summonRested} owner={seat.player} />
        <span className={classes.zoneLabel}>{seat.name}</span>
      </div>
      <div className={classes.halfCentre}>
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
              <span key={`empty-${index}`} className={cards.slot} data-slot-index={index} />
            ),
          )}
        </div>
        <div className={classes.slotRow} data-testid={`naruto-supports-${seat.player}`}>
          {seat.supports.map((support, index) =>
            support ? (
              <SupportSlot key={support.uid} support={support} owner={seat.player} kit={kit} />
            ) : (
              <span key={`empty-${index}`} className={cards.slot} data-slot-index={index} />
            ),
          )}
        </div>
      </div>
      <div className={classes.halfFlank}>
        <DeckStack count={seat.deckCount} owner={seat.player} />
        <TrashStack
          count={seat.trashCount}
          topUid={seat.trashTop?.uid ?? null}
          topCardId={seat.trashTop?.cardId ?? null}
          owner={seat.player}
          kit={kit}
        />
      </div>
      <LeaderZone leader={seat.leader} owner={seat.player} side={side} kit={kit} />
    </section>
  );
}
