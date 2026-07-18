import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09CrossGuild057,
  op09Nami050,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-050 Nami", () => {
  test("when attacking finds only a blue Event and bottom-orders the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09Nami050, playedOnTurn: 0 }],
        deck: [
          op09CrossGuild057,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const namiId = engine.findCardInZone("south", "character", op09Nami050);
    const eventId = engine.findCardInZone("south", "deck", op09CrossGuild057);
    const ineligibleCharacterId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.declareAttack(namiId, engine.leader("north"), "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Nami's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(true);
    expect(
      search.candidates.find((candidate) => candidate.ref.id === ineligibleCharacterId)?.legal,
    ).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eventId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Nami's bottom order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eventId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(order);
  });
});
