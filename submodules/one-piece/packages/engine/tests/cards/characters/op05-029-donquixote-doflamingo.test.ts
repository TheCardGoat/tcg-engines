import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05DonquixoteDoflamingo029 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-029 Donquixote Doflamingo", () => {
  test("declining the opponent-attack activation spends no DON and does not consume Once Per Turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05DonquixoteDoflamingo029, playedOnTurn: 0 }],
        activeDon: 1,
        life: [eb01Doma005, eb01Doma005],
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const [firstId, secondId] = engine.getState().players.north.characterArea as [string, string];

    engine.declareAttack(firstId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 0 });

    engine.declareAttack(secondId, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").kind).toBe("confirm");
  });

  test("accepting pays one DON and may rest only an opposing cost-6-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05DonquixoteDoflamingo029, playedOnTurn: 0 }],
        activeDon: 1,
        life: [eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Doflamingo's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });
});
