import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01StrategicArms108 } from "../../gd01/command/108-strategic-arms.ts";
import { gd02DramaticTurnabout100 } from "./100-dramatic-turnabout.ts";

describe("Dramatic Turnabout (GD02-100)", () => {
  it("【Burst】 draws one card and moves the revealed Command to trash", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02DramaticTurnabout100], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstChoice = p2.getBoardView().pendingChoice;
    if (burstChoice?.kind !== "optional") {
      throw new Error("Expected Dramatic Turnabout's visible Burst choice");
    }
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

    expect(p2.getBoardView().players[PLAYER_TWO]?.deckCount).toBe(2);
    expect(p2.getCardZone(gd02DramaticTurnabout100)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("【Main】 recovers the chosen legally damaged friendly Unit and draws one", () => {
    const friendly = createMockUnit({
      hp: 7,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const enemyBlocker = createMockUnit({
      hp: 7,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StrategicArms108, gd02DramaticTurnabout100],
        play: [friendly],
        resourceArea: activeResources(10),
        deck: 4,
      },
      { play: [enemyBlocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[1]!;

    expectSuccess(p1.playCommand(gd01StrategicArms108));
    expect(p1.getDamage(friendlyId)).toBe(2);
    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible damaged friendly Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([friendlyId]);
    expect(choice.legalTargetIds).not.toContain(enemyId);
    expectSuccess(p1.resolveEffect({ targets: [friendlyId] }));

    expect(p1.getDamage(friendlyId)).toBe(0);
    expect(p2.getDamage(enemyId)).toBe(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot be played when no friendly Unit is damaged", () => {
    const friendly = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [gd02DramaticTurnabout100],
      play: [friendly],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd02DramaticTurnabout100), "NO_LEGAL_TARGETS");
    expect(p1.getCardZone(gd02DramaticTurnabout100)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot be played in a legally reached Action step", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02DramaticTurnabout100],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.playCommand(gd02DramaticTurnabout100), "WRONG_TIMING");
  });

  it("enforces both its printed Lv.5 and active Resource cost 2", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [gd02DramaticTurnabout100],
      resourceArea: activeResources(4),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).playCommand(gd02DramaticTurnabout100),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(lowLevel.asPlayer(PLAYER_ONE).getCardZone(gd02DramaticTurnabout100)).toBe(
      `hand:${PLAYER_ONE}`,
    );

    const setup = createMockCommand({
      level: 0,
      cost: 4,
      effects: [
        { type: "command", activation: { timing: ["main"] }, directives: [], sourceText: "" },
      ],
    });
    const friendly = createMockUnit({ hp: 5 });
    const insufficient = GundamTestEngine.create({
      hand: [setup, gd02DramaticTurnabout100],
      play: [friendly],
      resourceArea: activeResources(5),
    });
    const p1 = insufficient.asPlayer(PLAYER_ONE);
    expectSuccess(p1.playCommand(setup));
    expectFailure(p1.playCommand(gd02DramaticTurnabout100), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd02DramaticTurnabout100)).toBe(`hand:${PLAYER_ONE}`);
  });
});
