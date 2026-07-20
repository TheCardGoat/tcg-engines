import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Kaido094,
  op13JewelryBonney100,
} from "@tcg/op-cards";
import { op13JewelryBonney108 } from "../../../../../cards/src/cards/OP13/characters/108-jewelry-bonney.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-108 Jewelry Bonney", () => {
  test("with an included Egghead Leader gains Rush and removes the opponent's top Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13JewelryBonney100,
        hand: [op13JewelryBonney108],
        activeDon: op13JewelryBonney108.cost,
      },
      { life: [eb01Fourtricks025], character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeId = engine.findCardInZone("north", "life", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13JewelryBonney108, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const bonneyId = engine.findCardInZone("south", "character", op13JewelryBonney108);
    engine.declareAttack(bonneyId, targetId, "south");

    const southView = engine.getView("south");
    const northView = engine.getView("north");
    expect(northView.players.north.lifeCount).toBe(0);
    expect(northView.players.north.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(
      southView.players.south.characters.find((card) => card?.instanceId === bonneyId)?.rested,
    ).toBe(true);
    expect(southView.prompts).toHaveLength(0);
  });

  test("without an Egghead Leader neither removes Life nor gains Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13JewelryBonney108],
        activeDon: op13JewelryBonney108.cost,
      },
      { life: [eb01Fourtricks025], character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeId = engine.findCardInZone("north", "life", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13JewelryBonney108, "south");
    const bonneyId = engine.findCardInZone("south", "character", op13JewelryBonney108);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: bonneyId,
        targetId,
      }).accepted,
    ).toBe(false);

    const view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(1);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(lifeId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger at one remaining Life optionally rests only an opposing cost-7-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005, op01Kaido094],
      },
      {
        life: [op13JewelryBonney108, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("south", "character", op01Kaido094);
    const triggerId = engine.findCardInZone("north", "life", op13JewelryBonney108);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Bonney's Trigger target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger does not rest a Character when two Life remain after damage", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      {
        life: [op13JewelryBonney108, eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
