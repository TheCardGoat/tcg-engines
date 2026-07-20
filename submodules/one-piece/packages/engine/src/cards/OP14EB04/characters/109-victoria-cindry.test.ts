import {
  eb01Doma005,
  eb01MountainGod018,
  op06GeckoMoria086,
  op06Inuppe082,
  op06ThrillerBark098,
  op12Perona034,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04VictoriaCindry109 } from "../../../../../cards/src/cards/OP14EB04/characters/109-victoria-cindry.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-109 Victoria Cindry", () => {
  test("Life Trigger filters included cost-4 Thriller Bark Characters and plays the selected identity rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04VictoriaCindry109, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        trash: [op12Perona034, op06Inuppe082, op06GeckoMoria086, eb01Doma005, op06ThrillerBark098],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const includedId = engine.findCardInZone("north", "trash", op12Perona034);
    const exactId = engine.findCardInZone("north", "trash", op06Inuppe082);
    const highCostId = engine.findCardInZone("north", "trash", op06GeckoMoria086);
    const wrongTraitId = engine.findCardInZone("north", "trash", eb01Doma005);
    const wrongCategoryId = engine.findCardInZone("north", "trash", op06ThrillerBark098);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Cindry's trash-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([includedId, exactId]);
    for (const excludedId of [highCostId, wrongTraitId, wrongCategoryId]) {
      expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    }
    engine.resolveDecision("effectPlaySelection", { selectedIds: [includedId] }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === includedId),
    ).toMatchObject({ cardId: op12Perona034.id, rested: true });
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("uses Blocker to redirect an attack and protect Leader Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04VictoriaCindry109] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op14eb04VictoriaCindry109);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });
});
