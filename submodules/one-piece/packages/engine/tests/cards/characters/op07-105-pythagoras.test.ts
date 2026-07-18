import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07Pythagoras105,
  op07Shaka101,
  op07TonyTonyChopper103,
  op07Vegapunk097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-105 Pythagoras", () => {
  test("at two Life, battle K.O. plays only a cost-4-or-less included Egghead Character rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07Vegapunk097,
        life: [eb01Doma005, eb01Doma005],
        character: [{ card: op07Pythagoras105, rested: true }],
        trash: [op07TonyTonyChopper103, op07Shaka101, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const pythagorasId = engine.findCardInZone("south", "character", op07Pythagoras105);
    const eligibleId = engine.findCardInZone("south", "trash", op07TonyTonyChopper103);
    const expensiveId = engine.findCardInZone("south", "trash", op07Shaka101);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, pythagorasId, "north");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Pythagoras's trash play.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(pythagorasId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });

  test("does not offer the On K.O. play above two Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005],
        character: [{ card: op07Pythagoras105, rested: true }],
        trash: [op07TonyTonyChopper103],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const pythagorasId = engine.findCardInZone("south", "character", op07Pythagoras105);
    const candidateId = engine.findCardInZone("south", "trash", op07TonyTonyChopper103);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, pythagorasId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([pythagorasId, candidateId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("Trigger plays the resolving physical card with a Vegapunk Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { leaderCardId: op07Vegapunk097, life: [op07Pythagoras105], deck: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const pythagorasId = engine.findCardInZone("north", "life", op07Pythagoras105);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(pythagorasId);
  });
});
