import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Shirahoshi057, op02Sakazuki099, op11Aladine024 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-024 Aladine", () => {
  test("after an opponent-effect K.O., its controller pays both costs and plays an eligible card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Aladine024],
        hand: [eb01Shirahoshi057, eb01Doma005],
        activeDon: 1,
      },
      {
        hand: [op02Sakazuki099, eb01Doma005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const aladineId = engine.findCardInZone("south", "character", op11Aladine024);
    const playedId = engine.findCardInZone("south", "hand", eb01Shirahoshi057);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op02Sakazuki099, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [aladineId] }, "north");

    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Aladine's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(discardedId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Aladine's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(playedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([aladineId, discardedId]),
    );
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(playedId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });
  test("may decline the compound recovery cost without trashing hand or resting DON", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP11-024"], hand: ["EB01-057", "ST02-012"], activeDon: 1 },
      { hand: ["OP04-094"], activeDon: 4 },
      { activeSeat: "north" },
    );
    e.asNorth().play("OP04-094");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "OP11-024"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([
      "EB01-057",
      "ST02-012",
    ]);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ: no active DON prevents partial hand payment and all recovery", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP11-024"], hand: ["EB01-057", "ST02-012"], restedDon: 1 },
      { hand: ["OP04-094"], activeDon: 4 },
      { activeSeat: "north" },
    );
    e.asNorth().play("OP04-094");
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "OP11-024"));
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual([
      "EB01-057",
      "ST02-012",
    ]);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
