import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04CorridaColiseum096,
  op10Bartolomeo052,
  op10FoLlowMeAndIWillGuiDeYou059,
  op10Leo057,
  op10Usopp042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-057 Leo", () => {
  test("rests Leader or Stage, then with Usopp searches two Dressrosa cards, orders, and trashes one", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10Usopp042,
      hand: [op10Leo057],
      stage: op04CorridaColiseum096,
      deck: [
        op10Bartolomeo052,
        op10FoLlowMeAndIWillGuiDeYou059,
        op10Leo057,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op10Leo057.cost,
    });
    const leaderId = engine.leader("south");
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    const characterId = engine.findCardInZone("south", "deck", op10Bartolomeo052);
    const eventId = engine.findCardInZone("south", "deck", op10FoLlowMeAndIWillGuiDeYou059);
    const excludedId = engine.findCardInZone("south", "deck", op10Leo057);
    const untouchedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op10Leo057, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const rest = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected Leo's rest cost.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([leaderId, stageId]),
    );
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Leo's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === characterId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [characterId, eventId] },
      "south",
    );

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Leo's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Leo's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([characterId, eventId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [eventId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(characterId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...order]);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the rest cost with a non-Usopp Leader without searching or trashing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Leo057],
      stage: op04CorridaColiseum096,
      deck: [eb01Doma005],
      activeDon: op10Leo057.cost,
    });
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op10Leo057, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");

    expect(engine.getView("south").players.south.stage?.rested).toBe(true);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
