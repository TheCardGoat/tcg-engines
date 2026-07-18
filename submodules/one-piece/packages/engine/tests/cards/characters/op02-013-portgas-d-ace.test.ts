import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02EdwardNewgate001,
  op02PortgasDAce013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-013 Portgas.D.Ace", () => {
  test("reduces up to two Characters and gains Rush with a compound Whitebeard Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op02PortgasDAce013],
        activeDon: op02PortgasDAce013.cost,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const unchangedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op02PortgasDAce013, "south");
    const aceId = engine.findCardInZone("south", "character", op02PortgasDAce013);

    const targets = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(targets?.kind).toBe("selectEntity");
    if (targets?.kind !== "selectEntity") throw new Error("Expected Ace's power targets.");
    expect(targets.candidates).toHaveLength(3);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === firstId)?.power).toBe(
      0,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === secondId)?.power).toBe(
      2000,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === unchangedId)?.power,
    ).toBe(7000);

    engine.declareAttack(aceId, engine.leader("north"), "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === aceId)
        ?.rested,
    ).toBe(true);
  });

  test("still reduces power without the Leader gate but does not gain Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02PortgasDAce013],
        activeDon: op02PortgasDAce013.cost,
      },
      {
        character: [eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op02PortgasDAce013, "south");
    const aceId = engine.findCardInZone("south", "character", op02PortgasDAce013);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(4000);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: aceId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });
});
