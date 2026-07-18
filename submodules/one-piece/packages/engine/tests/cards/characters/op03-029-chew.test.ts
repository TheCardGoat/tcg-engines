import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Chew029 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-029 Chew", () => {
  test("K.O.s only an opposing rested cost-4-or-less Character on play", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Chew029], activeDon: op03Chew029.cost },
      {
        character: [
          { card: eb01Doma005, rested: true },
          eb01Doma005,
          { card: eb01MountainGod018, rested: true },
        ],
      },
    );
    const legalId = engine.findCardInZone("north", "character", eb01Doma005);
    const activeId = engine
      .getView("south")
      .players.north.characters.find(
        (card) => card?.cardId === eb01Doma005.id && card.instanceId !== legalId,
      )?.instanceId;
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Chew029, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Chew's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(legalId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [legalId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      legalId,
    );
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === highCostId),
    ).toBe(true);
  });

  test("Life Trigger plays the resolving physical card before its On Play K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true },
        ],
      },
      { life: [op03Chew029] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const lifeId = engine.findCardInZone("north", "life", op03Chew029);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Chew's On Play target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === lifeId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
