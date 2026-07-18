import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Mohji060,
  op02MonkeyDLuffy062,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-062 Monkey.D.Luffy", () => {
  test("on play may trash 2 cards and return its controller's cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02MonkeyDLuffy062, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        character: [op02Mohji060],
        activeDon: op02MonkeyDLuffy062.cost,
      },
      { life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownTargetId = engine.findCardInZone("south", "character", op02Mohji060);
    const firstCostId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondCostId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.playCard(op02MonkeyDLuffy062, "south");
    const luffyId = engine.findCardInZone("south", "character", op02MonkeyDLuffy062);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [firstCostId, secondCostId] },
      "south",
    );

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Luffy's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(ownTargetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      ownTargetId,
    );
    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === luffyId),
    ).toBe(true);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstCostId, secondCostId]),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("when attacking may return either player's cost-4-or-less Character and excludes cost 5", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        character: [
          { card: op02MonkeyDLuffy062, playedOnTurn: 0 },
          { card: op02Mohji060, playedOnTurn: 0 },
        ],
      },
      {
        character: [op02Mohji060, eb01MountainGod018],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op02MonkeyDLuffy062);
    const ownTargetId = engine.findCardInZone("south", "character", op02Mohji060);
    const opposingTargetId = engine.findCardInZone("north", "character", op02Mohji060);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const firstCostId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondCostId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(luffyId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [firstCostId, secondCostId] },
      "south",
    );

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Luffy's any-player target.");
    const candidateIds = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toContain(ownTargetId);
    expect(candidateIds).toContain(opposingTargetId);
    expect(candidateIds).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingTargetId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.some((card) => card?.instanceId === opposingTargetId),
    ).toBe(false);
    expect(view.players.north.lifeCount).toBe(lifeBefore - 2);
    expect(view.prompts).toHaveLength(0);
  });
});
