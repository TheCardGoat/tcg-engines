import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03Gin024,
  op03Kuro021,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-024 Gin", () => {
  test("with an included East Blue Leader, rests up to two cost-4-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Kuro021,
        hand: [op03Gin024],
        activeDon: op03Gin024.cost,
      },
      { character: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
    );
    const costOneId = engine.findCardInZone("north", "character", eb01Doma005);
    const costThreeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const costFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Gin024, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Gin's rest targets.");
    expect(target).toMatchObject({ min: 0, max: 2 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([costOneId, costThreeId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(costFiveId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [costOneId, costThreeId] },
      "south",
    );

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costOneId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costThreeId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costFiveId)?.rested,
    ).toBe(false);
  });

  test("does not rest an opposing Character without an East Blue Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Gin024],
        activeDon: op03Gin024.cost,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op03Gin024, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
