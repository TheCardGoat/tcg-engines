import {
  eb01Doma005,
  eb01MountainGod018,
  op06GeckoMoria086,
  op06Inuppe082,
  op12Perona034,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04PeronaOp14111111 } from "../../../../../cards/src/cards/OP14EB04/characters/111-perona-op14-111.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-111 Perona", () => {
  test("on play restricts an opposing cost-6 Character through the opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04PeronaOp14111111],
        activeDon: op14eb04PeronaOp14111111.cost,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op06GeckoMoria086, playedOnTurn: 0 },
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", op06GeckoMoria086);

    engine.playCard(op14eb04PeronaOp14111111, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Perona's attack restriction.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: eligibleId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(eligibleId, engine.leader("south"), "north");
  });

  test("on K.O. independently restricts a selected opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04PeronaOp14111111] },
      {
        hand: [op12UrsaShock096],
        activeDon: op12UrsaShock096.cost,
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const peronaId = engine.findCardInZone("south", "character", op14eb04PeronaOp14111111);
    const restrictedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [peronaId] }, "north");
    expect(engine.pendingDecision("effectTargetSelection", "south").actorId).toBe("south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restrictedId] }, "south");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: restrictedId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });

  test("Life Trigger plays a selected included cost-4 Thriller Bark Character rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04PeronaOp14111111, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
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
    if (play?.kind !== "selectEntity") throw new Error("Expected Perona's Trigger choice.");
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
