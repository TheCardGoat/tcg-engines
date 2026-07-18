import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Striker020, op06Braham111 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-111 Braham", () => {
  test("Life Trigger plays the physical card with two Life remaining", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op06Braham111, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const brahamId = engine.findCardInZone("north", "life", op06Braham111);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(brahamId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(brahamId);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests only a cost-4-or-less opposing Character once per turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Braham111], stage: op03Striker020 },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const brahamId = engine.findCardInZone("south", "character", op06Braham111);
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(brahamId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Braham's rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(lowCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === lowCostId)?.rested,
    ).toBe(true);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: brahamId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });

  test("cannot activate without returning a cost-1 Stage to the owner's deck", () => {
    const engine = OnePieceTestEngine.create({ character: [op06Braham111] });
    const brahamId = engine.findCardInZone("south", "character", op06Braham111);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: brahamId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
