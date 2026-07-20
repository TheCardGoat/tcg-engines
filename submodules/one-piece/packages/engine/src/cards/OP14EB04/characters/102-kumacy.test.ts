import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06GeckoMoria086,
  op06Inuppe082,
  op06ThrillerBark098,
  op12Perona034,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Kumacy102 } from "../../../../../cards/src/cards/OP14EB04/characters/102-kumacy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-102 Kumacy", () => {
  test("Life Trigger offers only cost-4-or-less Thriller Bark Pirates Characters from its controller's trash and plays the selected identity rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04Kumacy102, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        trash: [op12Perona034, op06Inuppe082, op06GeckoMoria086, eb01Doma005, op06ThrillerBark098],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04Kumacy102);
    const includedTraitId = engine.findCardInZone("north", "trash", op12Perona034);
    const exactTraitId = engine.findCardInZone("north", "trash", op06Inuppe082);
    const highCostId = engine.findCardInZone("north", "trash", op06GeckoMoria086);
    const wrongTraitId = engine.findCardInZone("north", "trash", eb01Doma005);
    const wrongCategoryId = engine.findCardInZone("north", "trash", op06ThrillerBark098);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const decision = engine.pendingDecision("effectPlaySelection", "north");
    expect(decision.actorId).toBe("north");
    const play = decision.steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Kumacy's trash play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([
      includedTraitId,
      exactTraitId,
    ]);
    for (const excludedId of [triggerId, highCostId, wrongTraitId, wrongCategoryId]) {
      expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    }
    engine.resolveDecision("effectPlaySelection", { selectedIds: [includedTraitId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === includedTraitId),
    ).toMatchObject({ cardId: op12Perona034.id, rested: true });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger may decline the optional trash play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04Kumacy102, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        trash: [op06Inuppe082],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const candidateId = engine.findCardInZone("north", "trash", op06Inuppe082);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(candidateId);
    expect(view.players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
