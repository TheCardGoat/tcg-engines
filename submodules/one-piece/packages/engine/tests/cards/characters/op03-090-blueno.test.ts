import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01Kaido094,
  op01King091,
  op03Blueno090,
  op03Camie101,
  op03Jabra085,
  op03Kumadori082,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-090 Blueno", () => {
  test("can replay a CP Character K.O.'d at the same time as Blueno", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op01King091, hand: [op01Kaido094], activeDon: 10 },
      { character: [op03Blueno090, op03Kumadori082] },
    );
    const bluenoId = engine.findCardInZone("north", "character", op03Blueno090);
    const companionId = engine.findCardInZone("north", "character", op03Kumadori082);
    engine.playCard(op01Kaido094, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const step = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Blueno trash play.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(companionId);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([bluenoId, companionId]),
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [companionId] }, "north");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === companionId)?.rested,
    ).toBe(true);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      bluenoId,
    );
  });

  test("gains Blocker with DON!! x1 during the opponent's attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op03Blueno090], activeDon: 1 },
      { character: [{ card: op03Camie101, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bluenoId = engine.findCardInZone("south", "character", op03Blueno090);
    const attackerId = engine.findCardInZone("north", "character", op03Camie101);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.attachDon(bluenoId, 1, "south");
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Blueno's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bluenoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [bluenoId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === bluenoId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("on K.O. plays only a cost-4-or-less CP Character from trash rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Blueno090, rested: true }],
        trash: [op03Kumadori082, op03Jabra085, op03Camie101],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bluenoId = engine.findCardInZone("south", "character", op03Blueno090);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "trash", op03Kumadori082);
    const tooExpensiveId = engine.findCardInZone("south", "trash", op03Jabra085);
    const wrongTraitId = engine.findCardInZone("south", "trash", op03Camie101);

    engine.declareAttack(attackerId, bluenoId, "north");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Blueno's trash play.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });
});
