import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01RoronoaZoro001, op03Hatchan033, op03Kuro021 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-033 Hatchan", () => {
  test("with an included East Blue Leader, plays the damaged Life card itself", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { leaderCardId: op03Kuro021, life: [op03Hatchan033] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const hatchanId = engine.findCardInZone("north", "life", op03Hatchan033);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(hatchanId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(hatchanId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not play the Life card when its Leader lacks East Blue", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { leaderCardId: op01RoronoaZoro001, life: [op03Hatchan033] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const hatchanId = engine.findCardInZone("north", "life", op03Hatchan033);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === hatchanId)).toBe(
      false,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(hatchanId);
    expect(view.prompts).toHaveLength(0);
  });
});
