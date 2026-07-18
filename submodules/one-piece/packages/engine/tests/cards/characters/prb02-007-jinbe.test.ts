import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Crocodile067,
  op07GloriosaGrandmaNyon041,
  prb02JinbePrb02007007,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-007 Jinbe", () => {
  test("searches the top 5 for a non-Jinbe Seven Warlords card and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [prb02JinbePrb02007007],
      deck: [
        op01Crocodile067,
        prb02JinbePrb02007007,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: prb02JinbePrb02007007.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op01Crocodile067);
    const excludedId = engine.findCardInZone("south", "deck", prb02JinbePrb02007007);

    engine.playCard(prb02JinbePrb02007007, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Jinbe's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Jinbe's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck).toEqual(order);
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking bottom-decks a cost-1 Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: prb02JinbePrb02007007, playedOnTurn: 0 }] },
      { character: [op07GloriosaGrandmaNyon041] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jinbeId = engine.findCardInZone("south", "character", prb02JinbePrb02007007);
    const targetId = engine.findCardInZone("north", "character", op07GloriosaGrandmaNyon041);

    engine.declareAttack(jinbeId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(targetId);
    expect(engine.getState().players.north.deck.at(-1)).toBe(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
