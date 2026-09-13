import { describe, expect, it } from "vitest";
import { catalogIds } from "@tcg/flesh-and-blood-engine/simulator";

import { getFabEngineScenario } from "./engineScenarios";
import {
  nextFabDeckRevealRecalls,
  nextFabHandRevealRecalls,
  projectFabDeckReveal,
  projectFabHandRevealCards,
} from "./deckRevealRecall";

describe("FAB deck reveal recall", () => {
  it("retains a public top-deck reveal only while it remains top this turn", () => {
    const revealed = nextFabDeckRevealRecalls({
      current: {},
      decks: { p1: ["older", "revealed"] },
      turnNumber: 4,
      events: [
        {
          name: "reveal",
          eventId: "event-9",
          turnNumber: 4,
          data: { playerId: "p1", object: { instanceId: "revealed", ownerId: "p1", zone: "deck" } },
        },
      ],
    });

    expect(projectFabDeckReveal(revealed.p1)).toMatchObject({
      position: "top",
      visibility: "public",
      cards: [{ entityId: "revealed" }],
    });
    expect(
      nextFabDeckRevealRecalls({
        current: revealed,
        decks: { p1: ["revealed", "new-top"] },
        turnNumber: 4,
        events: [],
      }).p1,
    ).toBeUndefined();
  });

  it("clears the recall at the next turn boundary", () => {
    const current = nextFabDeckRevealRecalls({
      current: {},
      decks: { p1: ["revealed"] },
      turnNumber: 4,
      events: [
        {
          name: "reveal",
          eventId: "event-9",
          turnNumber: 4,
          data: { playerId: "p1", object: { instanceId: "revealed", ownerId: "p1", zone: "deck" } },
        },
      ],
    });

    expect(
      nextFabDeckRevealRecalls({ current, decks: { p1: ["revealed"] }, turnNumber: 5, events: [] }),
    ).toEqual({});
  });

  it("retains publicly revealed hand cards until they leave hand or the turn ends", () => {
    const revealed = nextFabHandRevealRecalls({
      current: {},
      hands: { p2: ["hidden-a", "revealed"] },
      turnNumber: 4,
      events: [
        {
          name: "reveal",
          eventId: "event-10",
          turnNumber: 4,
          data: {
            playerId: "p2",
            object: {
              instanceId: "revealed",
              ownerId: "p2",
              zone: "hand",
              current: { name: "Pummel" },
            },
          },
        },
      ],
    });

    expect(projectFabHandRevealCards(revealed.p2)).toEqual([
      { entityId: "revealed", title: "Pummel" },
    ]);
    expect(
      nextFabHandRevealRecalls({
        current: revealed,
        hands: { p2: ["hidden-a"] },
        turnNumber: 4,
        events: [],
      }),
    ).toEqual({});
    expect(
      nextFabHandRevealRecalls({
        current: revealed,
        hands: { p2: ["hidden-a", "revealed"] },
        turnNumber: 5,
        events: [],
      }),
    ).toEqual({});
  });

  it("recognizes a real additional-cost reveal that remains in hand", () => {
    const match = getFabEngineScenario("reveal-and-shuffle")?.boot();
    if (!match) throw new Error("Missing reveal-and-shuffle scenario.");
    match.engine.as(catalogIds.rhinar).play("fixture-animation-reveal-attack", {
      target: "player-2",
    });
    const state = match.runtime.getState();
    const reveals = nextFabHandRevealRecalls({
      current: {},
      hands: Object.fromEntries(
        Object.entries(state.containers.zonesByPlayerId).map(([playerId, zones]) => [
          playerId,
          zones.hand,
        ]),
      ),
      turnNumber: state.turnNumber,
      presentationByInstanceId: Object.fromEntries(
        Object.entries(state.objects).map(([instanceId, object]) => [
          instanceId,
          { title: state.cardDefinitions[object.canonicalId]?.base.names[0] },
        ]),
      ),
      events: match.engine.committedEvents(),
    });

    expect(projectFabHandRevealCards(reveals["player-1"])).toEqual([
      expect.objectContaining({ title: "Nimblism" }),
    ]);
  });
});
