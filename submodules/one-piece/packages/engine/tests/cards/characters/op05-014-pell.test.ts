import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05Pell014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-014 Pell", () => {
  test("with DON!! x1, may reduce an opposing Character by 2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05Pell014, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pellId = engine.findCardInZone("south", "character", op05Pell014);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(pellId, 1, "south");
    engine.declareAttack(pellId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Pell's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      engine.leader("north"),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(5000);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(7000);
  });

  test("without attached DON!!, does not offer the effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Pell014, playedOnTurn: 0 }] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pellId = engine.findCardInZone("south", "character", op05Pell014);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(pellId, engine.leader("north"), "south");

    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(7000);
  });
});
