import { useEffect, useState } from "react";

import { officialRiftboundFixtureCards } from "./fixtures/officialFixtureCards";
import { RiftboundTabletop } from "./RiftboundTabletop";
import {
  createRiftboundClientMatchStateV1,
  reduceRiftboundClientMatchStateV1,
  type RiftboundClientMatchStateV1,
} from "./state";

export function RiftboundFixturesPage() {
  const [isClientReady, setIsClientReady] = useState(false);
  useEffect(() => setIsClientReady(true), []);
  const [state, setState] = useState<RiftboundClientMatchStateV1>(() =>
    createFixtureState(officialRiftboundFixtureCards),
  );

  const focusCard = state.cards["fixture-p1-0"]!;
  return (
    <RiftboundTabletop
      sessionKey="riftbound:animation-fixtures:p1"
      state={state}
      viewerId="p1"
      onAction={(action) =>
        setState((current) => reduceRiftboundClientMatchStateV1(current!, action))
      }
      renderActionControls={(dispatch) => (
        <div className="riftbound-actions" data-testid="riftbound-animation-controls">
          <strong>Animation fixtures</strong>
          <button
            type="button"
            disabled={!isClientReady}
            data-testid="riftbound-rotate"
            data-current-rotation={focusCard.rotation}
            onClick={() =>
              dispatch({
                type: "rotate",
                cardId: focusCard.id,
                rotation: focusCard.rotation === 90 ? 0 : 90,
              })
            }
          >
            Ready / rest
          </button>
          <button
            type="button"
            disabled={!isClientReady}
            data-testid="riftbound-flip"
            onClick={() =>
              dispatch({
                type: "set_face",
                cardId: focusCard.id,
                face: focusCard.face === "up" ? "down" : "up",
              })
            }
          >
            Flip card
          </button>
          <button
            type="button"
            disabled={!isClientReady}
            data-testid="riftbound-counter"
            onClick={() =>
              dispatch({
                type: "set_counter",
                cardId: focusCard.id,
                counter: "might",
                value: (focusCard.counters.might ?? 0) + 1,
              })
            }
          >
            Add might
          </button>
          <button
            type="button"
            disabled={!isClientReady}
            data-testid="riftbound-shuffle"
            onClick={() =>
              dispatch({
                type: "shuffle",
                ownerId: "p1",
                zone: "deck",
                order: [...state.zoneOrder["p1:deck"]!].reverse(),
              })
            }
          >
            Shuffle deck
          </button>
          <button
            type="button"
            disabled={!isClientReady}
            data-testid="riftbound-result"
            onClick={() =>
              dispatch({ type: "end_game", winnerId: "p1", reason: "fixture victory" })
            }
          >
            Win game
          </button>
        </div>
      )}
    />
  );
}

function createFixtureState(
  cards: typeof officialRiftboundFixtureCards,
): RiftboundClientMatchStateV1 {
  const cardInstances = Object.fromEntries(
    cards.map((card, index) => [`fixture-${index < 3 ? "p1" : "p2"}-${index % 3}`, card.id]),
  );
  const owners = {
    p1: ["fixture-p1-0", "fixture-p1-1", "fixture-p1-2"],
    p2: ["fixture-p2-0", "fixture-p2-1", "fixture-p2-2"],
  };
  let state = createRiftboundClientMatchStateV1(
    ["p1", "p2"],
    { cardInstances, owners },
    Object.fromEntries(cards.map((card) => [card.id, card.definition])),
  );
  const placements = [
    ["fixture-p1-0", "play"],
    ["fixture-p1-1", "deck"],
    ["fixture-p1-2", "deck"],
    ["fixture-p2-0", "play"],
    ["fixture-p2-1", "deck"],
    ["fixture-p2-2", "deck"],
  ] as const;
  for (const [cardId, zone] of placements) {
    const actorId = cardId.includes("p1") ? "p1" : "p2";
    state = reduceRiftboundClientMatchStateV1(state, {
      type: "move_card",
      cardId,
      zone,
      actorId,
      actionId: `setup:${cardId}`,
      at: 0,
    });
    if (zone === "play") {
      state = reduceRiftboundClientMatchStateV1(state, {
        type: "set_face",
        cardId,
        face: "up",
        actorId,
        actionId: `setup:reveal:${cardId}`,
        at: 0,
      });
    }
  }
  return { ...state, activity: [] };
}
