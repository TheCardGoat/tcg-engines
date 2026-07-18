import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07Atlas098,
  op07Lilith111,
  op07Vegapunk097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-111 Lilith", () => {
  test("finds a compound Egghead card other than every Lilith and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Lilith111],
      deck: [
        op07Atlas098,
        op07Lilith111,
        eb01Doma005,
        op07Lilith111,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op07Lilith111.cost,
    });
    const atlasId = engine.findCardInZone("south", "deck", op07Atlas098);
    const nonEggheadId = engine.findCardInZone("south", "deck", eb01Doma005);
    const lilithIds = engine
      .getState()
      .players.south.deck.filter(
        (instanceId) => engine.getState().cards[instanceId]?.cardId === op07Lilith111.id,
      );
    const untouchedId = engine.getState().players.south.deck[5]!;

    engine.playCard(op07Lilith111, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Lilith's Egghead search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === atlasId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === nonEggheadId)?.legal).toBe(
      false,
    );
    expect(
      search.candidates
        .filter((candidate) => lilithIds.includes(candidate.ref.id))
        .every((candidate) => !candidate.legal),
    ).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [atlasId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Lilith's remainder order.");
    const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(atlasId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger plays its physical card with Vegapunk before resolving On Play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07Vegapunk097,
        life: [op07Lilith111],
        deck: [
          op07Atlas098,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lilithId = engine.findCardInZone("north", "life", op07Lilith111);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "north").steps[0];
    if (remainder?.kind !== "orderItems")
      throw new Error("Expected Lilith's Trigger search order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(lilithId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(lilithId);
    expect(view.prompts).toHaveLength(0);
  });
});
