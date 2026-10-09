import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op09SpecialMuggyBall058,
  op13Buggy072,
  op13Higuma013,
  op13Inuarashi061,
  op13OroJackson078,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-078 Oro Jackson", () => {
  test("adds at most 1 rested DON!! once when an opponent's effect removes a Roger Pirates Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        stage: op13OroJackson078,
        character: [op13Higuma013, op13Inuarashi061, op13Buggy072],
        donDeckCount: 2,
      },
      {
        hand: [op09SpecialMuggyBall058, op09SpecialMuggyBall058, op09SpecialMuggyBall058],
        activeDon: 6,
      },
    );
    const unrelatedId = engine.findCardInZone("south", "character", op13Higuma013);
    const compositeRogerPiratesId = engine.findCardInZone("south", "character", op13Inuarashi061);
    const exactRogerPiratesId = engine.findCardInZone("south", "character", op13Buggy072);

    engine.endTurn("south");

    engine.playCard(op09SpecialMuggyBall058, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [unrelatedId] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.playCard(op09SpecialMuggyBall058, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [compositeRogerPiratesId] },
      "south",
    );

    const donDecision = engine.pendingDecision("effectAddDon", "south");
    const donStep = donDecision.steps[0];
    expect(donDecision.actorId).toBe("south");
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected Oro Jackson to publish its DON!! count choice.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);

    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(
      compositeRogerPiratesId,
    );
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 1 });

    engine.playCard(op09SpecialMuggyBall058, "north");

    view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(exactRogerPiratesId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("does not add DON!! when a Roger Pirates Character is K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        stage: op13OroJackson078,
        character: [{ card: op13Buggy072, rested: true }],
        donDeckCount: 5,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const target = engine.findCardInZone("south", "character", op13Buggy072);
    engine.asNorth().attack(engine.findCardInZone("north", "character", "EB01-018"), target);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(target);
    expect(engine.getView("south").players.south.donDeckCount).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not add DON!! when its controller's own Event returns a Roger Pirates Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        stage: op13OroJackson078,
        character: [op13Buggy072],
        hand: ["OP01-086"],
        activeDon: 2,
        donDeckCount: 5,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const target = engine.findCardInZone("south", "character", op13Buggy072);
    engine
      .asNorth()
      .attack(engine.findCardInZone("north", "character", "EB01-018"), engine.leader("south"));
    engine.asSouth().chooseCounter("OP01-086");
    engine.asSouth().chooseTargets(engine.leader("south"));
    engine.asSouth().chooseTargets(target);
    engine.asSouth().chooseCounter();
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(target);
    expect(engine.getView("south").players.south.donDeckCount).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
