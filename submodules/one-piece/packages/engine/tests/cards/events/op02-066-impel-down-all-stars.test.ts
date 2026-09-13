import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op02EmporioIvankov049,
  op02ImpelDownAllStars066,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-066 Impel Down All Stars", () => {
  test("with a compound Impel Down Leader, maps the optional 2-card hand cost and draw count", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EmporioIvankov049,
      hand: [op02ImpelDownAllStars066, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      deck: [eb01Sanji014, eb01Doma005],
      activeDon: 1,
    });
    const firstCostId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondCostId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const keptId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Sanji014);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op02ImpelDownAllStars066);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the controller to choose exactly two hand cards to trash.");
    }
    expect(costStep).toMatchObject({ min: 2, max: 2 });
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstCostId,
      secondCostId,
      keptId,
    ]);
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [firstCostId, secondCostId] },
      "south",
    );

    const drawDecision = engine.pendingDecision("effectDrawCount", "south");
    const drawStep = drawDecision.steps[0];
    expect(drawStep?.kind).toBe("chooseOption");
    if (drawStep?.kind !== "chooseOption") {
      throw new Error("Expected the controller to choose how many cards to draw.");
    }
    expect(drawStep.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectDrawCount", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      keptId,
      firstDrawId,
      secondDrawId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstCostId, secondCostId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("allows payment with a non-Impel Down Leader but skips the conditioned draw", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02ImpelDownAllStars066, eb01Doma005, eb01Fourtricks025],
      deck: [eb01Sanji014, eb01MountainGod018],
      activeDon: 1,
    });
    const firstCostId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondCostId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.playCard(op02ImpelDownAllStars066);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstCostId, secondCostId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws exactly 2 without Event payment or a draw-count prompt", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        deck: [eb01Doma005, eb01Fourtricks025, eb01Sanji014, eb01MountainGod018],
        life: [op02ImpelDownAllStars066],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("north", "deck", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
      secondDrawId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EmporioIvankov049,
      hand: [op02ImpelDownAllStars066, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      deck: [eb01Sanji014, eb01Doma005],
      activeDon: 1,
    });
    engine.playCard(op02ImpelDownAllStars066, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
