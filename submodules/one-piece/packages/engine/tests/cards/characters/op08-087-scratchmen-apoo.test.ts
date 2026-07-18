import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08ScratchmenApoo087 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-087 Scratchmen Apoo", () => {
  test("once per turn reduces an opposing Character's cost until turn end", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08ScratchmenApoo087] },
      { character: [eb01MountainGod018] },
    );
    const apooId = engine.findCardInZone("south", "character", op08ScratchmenApoo087);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(apooId, "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Apoo's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(4);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: apooId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");

    engine.endTurn("south");
    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(5);
  });

  test("can block an attack and become its target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { character: [op08ScratchmenApoo087] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const apooId = engine.findCardInZone("north", "character", op08ScratchmenApoo087);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Apoo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(apooId);
    engine.resolveDecision("battleBlocker", { selectedIds: [apooId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.characters.find((card) => card?.instanceId === apooId)?.rested).toBe(
      true,
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === apooId)).toBe(true);
  });
});
