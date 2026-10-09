import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09MarshallDTeach081 } from "@tcg/op-cards";
import { op09MarshallDTeach093 } from "../../../../../cards/src/cards/characters/op09-093-marshall-d-teach.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-093 Marshall.D.Teach", () => {
  test("after the Leader choice, also offers a Character to negate and prevent from attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [{ card: op09MarshallDTeach093, playedOnTurn: 1 }],
      },
      { character: [eb01Doma005] },
    );
    const teachId = engine.findCardInZone("south", "character", op09MarshallDTeach093);
    const opposingCharacterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(teachId, "activateMain", "south");
    const leaderChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (leaderChoice?.kind !== "selectEntity")
      throw new Error("Expected the opposing Leader choice.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "south",
    );

    const characterChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (characterChoice?.kind !== "selectEntity") {
      throw new Error("Expected the printed second Character choice.");
    }
    expect(characterChoice.candidates.map((candidate) => candidate.ref.id)).toContain(
      opposingCharacterId,
    );

    engine.asSouth().chooseTargets(opposingCharacterId);
    const repeat = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: teachId,
      trigger: "activateMain",
    });
    expect(repeat.reason).toBe("This effect has already been used this turn.");
    engine.asSouth().endTurn();
    engine.expectFailure({
      type: "declareAttack",
      seat: "north",
      attackerId: opposingCharacterId,
      targetId: engine.leader("south"),
    });
  });
  test("keeps the selected Character's effect negated through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [{ card: op09MarshallDTeach093, playedOnTurn: 1 }],
      },
      { character: ["OP09-083"] },
    );
    const teach = engine.findCardInZone("south", "character", op09MarshallDTeach093);
    const augur = engine.findCardInZone("north", "character", "OP09-083");
    engine.asSouth().activateMain(teach);
    engine.asSouth().chooseNoTargets();
    engine.asSouth().chooseTargets(augur);
    engine.asSouth().endTurn();
    engine.expectFailure({
      type: "activateEffect",
      seat: "north",
      sourceInstanceId: augur,
      trigger: "activateMain",
    });
    engine.expectFailure({
      type: "declareAttack",
      seat: "north",
      attackerId: augur,
      targetId: engine.leader("south"),
    });
    engine.asNorth().endTurn();
    engine.asSouth().endTurn();
    engine.asNorth().activateMain(augur);
    engine.asNorth().declineOptional();
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("negates the selected Leader only this turn and independently uses Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [{ card: op09MarshallDTeach093, playedOnTurn: 1 }],
      },
      { leaderCardId: "OP07-019", activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const teach = engine.findCardInZone("south", "character", op09MarshallDTeach093);
    engine.asSouth().activateMain(teach);
    engine.asSouth().chooseTargets(engine.leader("north"));
    engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
    expect(engine.getView("north").players.north.lifeCount).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
    engine.asSouth().endTurn();
    engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
    engine.asSouth().chooseBlocker(teach);
    engine.asNorth().endTurn();
    engine.asSouth().attack(engine.leader("south"), engine.leader("north"));
    engine.asNorth().acceptOptional();
    engine.asNorth().chooseTargets(teach);
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === teach)?.rested,
    ).toBe(true);
  });

  test("cannot activate with another Leader or after its play turn", () => {
    for (const fixture of [
      { character: [{ card: op09MarshallDTeach093, playedOnTurn: 1 }] },
      {
        leaderCardId: op09MarshallDTeach081,
        character: [{ card: op09MarshallDTeach093, playedOnTurn: 0 }],
      },
    ]) {
      const engine = OnePieceTestEngine.create(fixture);
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: engine.findCardInZone("south", "character", op09MarshallDTeach093),
        trigger: "activateMain",
      });
      expect(engine.getView("south").prompts).toHaveLength(0);
    }
  });
});
