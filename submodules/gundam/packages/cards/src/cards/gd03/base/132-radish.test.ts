import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03EmmaSheen099 } from "../pilot/099-emma-sheen.ts";
import { gd03GDefenser079 } from "../unit/079-g-defenser.ts";
import { gd03Radish132 } from "./132-radish.ts";

describe("Radish (GD03-132)", () => {
  it("lets its owner deploy it when its Burst is revealed by a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd03Radish132] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03Radish132)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds one shield to its owner's hand when deployed", () => {
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Radish132],
      resourceArea: activeResources(2),
      shieldArea: [returnedShield],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03Radish132));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03Radish132)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("offers only an enemy with 4 or less HP after battle destroys it beside an AEUG Link Unit", () => {
    const attacker = createMockUnit({ cardNumber: "TEST-ATTACKER", ap: 5, hp: 6 });
    const eligibleEnemy = createMockUnit({ cardNumber: "TEST-ELIGIBLE", hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03EmmaSheen099],
        play: [gd03GDefenser079],
        baseSection: [gd03Radish132],
        resourceArea: activeResources(3),
        deck: 3,
      },
      { play: [attacker, eligibleEnemy], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const linkUnitId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const [attackerId, eligibleEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd03EmmaSheen099, linkUnitId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(attackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(baseId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      sourceCardId: baseId,
      legalTargetIds: [eligibleEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleEnemyId!] }));
    expect(p2.isExhausted(eligibleEnemyId!)).toBe(true);
  });

  it("does not offer the rest effect when the friendly AEUG Unit is not linked", () => {
    const attacker = createMockUnit({ cardNumber: "TEST-ATTACKER", ap: 5, hp: 6 });
    const eligibleEnemy = createMockUnit({ cardNumber: "TEST-ELIGIBLE", hp: 4 });
    const engine = GundamTestEngine.create(
      {
        play: [gd03GDefenser079],
        baseSection: [gd03Radish132],
        deck: 3,
      },
      { play: [attacker, eligibleEnemy], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const [attackerId, eligibleEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(attackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(baseId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(eligibleEnemyId!)).toBe(false);
  });
});
