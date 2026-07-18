import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03CharlotteLinlin077,
  op03CharlotteLinlin114,
  op03Napoleon117,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-117 Napoleon", () => {
  test("rests itself to target only a Charlotte Linlin Leader or Character until next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03CharlotteLinlin077,
        character: [
          { card: op03Napoleon117, playedOnTurn: 0 },
          { card: op03CharlotteLinlin114, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const napoleonId = engine.findCardInZone("south", "character", op03Napoleon117);
    const linlinId = engine.findCardInZone("south", "character", op03CharlotteLinlin114);
    const otherId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(napoleonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Napoleon's Linlin target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      linlinId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(otherId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [linlinId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === napoleonId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.find((card) => card?.instanceId === linlinId)?.power).toBe(
      13000,
    );

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === linlinId)
        ?.power,
    ).toBe(13000);
    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === linlinId)?.power).toBe(
      12000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the rest cost and choose no Charlotte Linlin target", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op03Napoleon117, playedOnTurn: 0 }],
    });
    const napoleonId = engine.findCardInZone("south", "character", op03Napoleon117);

    engine.activateEffect(napoleonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === napoleonId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting itself", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op03Napoleon117, playedOnTurn: 0 }],
    });
    const napoleonId = engine.findCardInZone("south", "character", op03Napoleon117);

    engine.activateEffect(napoleonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === napoleonId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("Trigger plays the resolving physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op03Napoleon117] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const napoleonId = engine.findCardInZone("north", "life", op03Napoleon117);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === napoleonId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline Trigger without playing the physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op03Napoleon117] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const napoleonId = engine.findCardInZone("north", "life", op03Napoleon117);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "decline" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(napoleonId);
    expect(view.players.north.characters.some((card) => card?.instanceId === napoleonId)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
