import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02Carrot013,
  op01Bepo049,
  op08Carrot021,
  op14eb04Eleclaw019,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-019 Eleclaw", () => {
  test("maps the rest-card cost and Minks-gated opposing cost modifier", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08Carrot021,
        hand: [op14eb04Eleclaw019],
        character: [eb02Carrot013],
        activeDon: 1,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", op14eb04Eleclaw019);
    const costId = engine.findCardInZone("south", "character", eb02Carrot013);
    const otherTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const selectedTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op14eb04Eleclaw019);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostRestCards", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected Eleclaw to publish its active-card rest cost.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      costId,
    ]);
    engine.resolveDecision("effectCostRestCards", { selectedIds: [costId] }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the Event controller to receive the opposing Character choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      otherTargetId,
      selectedTargetId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedTargetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === costId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedTargetId)?.cost,
    ).toBe(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedTargetId)?.cost,
    ).toBe(3);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("pays the pre-colon rest cost before a non-Minks Leader makes the modifier do nothing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Eleclaw019],
      character: [eb02Carrot013],
      activeDon: 1,
    });
    const costId = engine.findCardInZone("south", "character", eb02Carrot013);

    engine.playCard(op14eb04Eleclaw019);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostRestCards", { selectedIds: [costId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === costId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("maps Counter power to only Minks Leaders and Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op08Carrot021,
        hand: [op14eb04Eleclaw019],
        character: [op01Bepo049, eb01Doma005],
        activeDon: 1,
        life: 2,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04Eleclaw019);
    const minksCharacterId = engine.findCardInZone("north", "character", op01Bepo049);
    const unrelatedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.endTurn("south");
    engine.endTurn("north");
    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the Minks Counter choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      minksCharacterId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
