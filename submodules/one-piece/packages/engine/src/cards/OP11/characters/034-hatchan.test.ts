import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Arlong022, op11Hatchan034 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-034 Hatchan", () => {
  test("rests itself before protecting a cost-3-or-less opponent through their next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Arlong022,
        character: [op11Hatchan034],
        deck: Array.from({ length: 6 }, () => eb01Doma005),
      },
      {
        deck: Array.from({ length: 6 }, () => eb01Doma005),
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hatchanId = engine.findCardInZone("south", "character", op11Hatchan034);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(hatchanId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Hatchan's protected target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === hatchanId)?.rested,
    ).toBe(true);
    engine.endTurn("south");
    const protectedAttack = engine.expectFailure({
      type: "declareAttack",
      seat: "north",
      attackerId: eligibleId,
      targetId: engine.leader("south"),
    });
    expect(protectedAttack.reason).toBe("The selected attacker cannot attack.");

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(eligibleId, engine.leader("south"), "north");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });

  test("pays the self-rest cost but grants no protection without the required Leader type", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Hatchan034] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hatchanId = engine.findCardInZone("south", "character", op11Hatchan034);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(hatchanId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hatchanId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
  });
});
