import { eb01Doma005, eb01MountainGod018, op07BoaHancock038, op07Salome043 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Ran114 } from "../../../../../cards/src/cards/OP14EB04/characters/114-ran.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-114 Ran", () => {
  test("once per turn gives one rested DON!! only to an included Kuja Pirates Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07BoaHancock038,
        character: [op14eb04Ran114, op07Salome043, eb01Doma005],
        restedDon: 1,
      },
      { character: [op07Salome043] },
    );
    const ranId = engine.findCardInZone("south", "character", op14eb04Ran114);
    const eligibleId = engine.findCardInZone("south", "character", op07Salome043);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", op07Salome043);

    engine.activateEffect(ranId, "activateMain", "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Ran's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Ran's DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), ranId, eligibleId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.attachedDon,
    ).toBe(1);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: ranId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger with an included Kuja Pirates Leader plays the resolving physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07BoaHancock038,
        life: [op14eb04Ran114, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04Ran114);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
