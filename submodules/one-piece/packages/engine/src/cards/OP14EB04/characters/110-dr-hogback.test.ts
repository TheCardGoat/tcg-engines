import {
  eb01Doma005,
  eb01MountainGod018,
  op06Inuppe082,
  op12Perona034,
  op14eb04Shakuyaku107,
  op14eb04SharkBrickFist020,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04DrHogback110 } from "../../../../../cards/src/cards/OP14EB04/characters/110-dr-hogback.ts";
import { op14eb04VictoriaCindry109 } from "../../../../../cards/src/cards/OP14EB04/characters/109-victoria-cindry.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-110 Dr. Hogback", () => {
  test("on K.O. offers only non-Hogback cost-4 Characters with a Trigger from its controller's trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04DrHogback110, rested: true }],
        trash: [
          op14eb04VictoriaCindry109,
          op14eb04DrHogback110,
          op14eb04Shakuyaku107,
          eb01Doma005,
          op14eb04SharkBrickFist020,
        ],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hogbackId = engine.findCardInZone("south", "character", op14eb04DrHogback110);
    const eligibleId = engine.findCardInZone("south", "trash", op14eb04VictoriaCindry109);
    const sameNameId = engine.findCardInZone("south", "trash", op14eb04DrHogback110);
    const highCostId = engine.findCardInZone("south", "trash", op14eb04Shakuyaku107);
    const noTriggerId = engine.findCardInZone("south", "trash", eb01Doma005);
    const wrongCategoryId = engine.findCardInZone("south", "trash", op14eb04SharkBrickFist020);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, hogbackId, "north");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Hogback's On K.O. play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    for (const excludedId of [hogbackId, sameNameId, highCostId, noTriggerId, wrongCategoryId]) {
      expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    }
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(eligibleId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger plays an included cost-4 Thriller Bark Character from trash rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04DrHogback110, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        trash: [op12Perona034, op06Inuppe082, eb01Doma005],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const includedId = engine.findCardInZone("north", "trash", op12Perona034);
    const exactId = engine.findCardInZone("north", "trash", op06Inuppe082);
    const wrongTraitId = engine.findCardInZone("north", "trash", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Hogback's Trigger choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([includedId, exactId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [includedId] }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === includedId),
    ).toMatchObject({ cardId: op12Perona034.id, rested: true });
  });
});
