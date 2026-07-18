import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05UsoHachi061 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-061 Uso-Hachi", () => {
  test("with one given DON!! and eight on the field, rests only an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05UsoHachi061, attachedDon: 1, playedOnTurn: 0 }],
        activeDon: 7,
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const usoHachiId = engine.findCardInZone("south", "character", op05UsoHachi061);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(usoHachiId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Uso-Hachi's rest choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === expensiveId)?.rested,
    ).toBe(false);
  });

  test("does not rest a Character with only seven DON!! cards on the field", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05UsoHachi061, attachedDon: 1, playedOnTurn: 0 }],
        activeDon: 6,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const usoHachiId = engine.findCardInZone("south", "character", op05UsoHachi061);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(usoHachiId, engine.leader("north"), "south");

    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(false);
  });
});
