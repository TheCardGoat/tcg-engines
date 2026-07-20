import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04GloriosaGrandmaNyon103 } from "../../../../../cards/src/cards/OP14EB04/characters/103-gloriosa-grandma-nyon.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-103 Gloriosa (Grandma Nyon)", () => {
  test("on play may take bottom Life, then places the selected physical hand card on top of Life", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04GloriosaGrandmaNyon103, eb01MountainGod018],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op14eb04GloriosaGrandmaNyon103.cost,
    });
    const paidHandId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const bottomLifeId = engine.getState().players.south.life.at(-1)!;

    engine.playCard(op14eb04GloriosaGrandmaNyon103, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    if (cost?.kind !== "chooseOption") throw new Error("Expected Gloriosa's Life cost choice.");
    expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const addLife = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (addLife?.kind !== "selectEntity")
      throw new Error("Expected Gloriosa's hand-to-Life choice.");
    expect(addLife).toMatchObject({ min: 0, max: 1 });
    expect(addLife.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([paidHandId, bottomLifeId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [paidHandId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(paidHandId);
    expect(engine.getState().players.south.life[0]).toBe(paidHandId);
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("on play may decline without moving Life or another hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04GloriosaGrandmaNyon103, eb01MountainGod018],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op14eb04GloriosaGrandmaNyon103.cost,
    });
    const handId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const lifeCount = engine.getView("south").players.south.lifeCount;

    engine.playCard(op14eb04GloriosaGrandmaNyon103, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeCount);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger plays the resolving physical Gloriosa card, then offers its On Play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04GloriosaGrandmaNyon103, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04GloriosaGrandmaNyon103);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.pendingDecision("effectOptional", "north").actorId).toBe("north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
