import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Kusanagi129 } from "./129-kusanagi.ts";

describe("Kusanagi (GD01-129)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd01Kusanagi129] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01Kusanagi129)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds a Shield, then asks which eligible enemy Unit to return", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const eligibleEnemy = createMockUnit({ hp: 3 });
    const ineligibleEnemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Kusanagi129],
        shieldArea: [returnedShield],
        resourceArea: activeResources(4),
      },
      { play: [eligibleEnemy, ineligibleEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleEnemyId, ineligibleEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd01Kusanagi129));
    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleEnemyId!] }));

    expect(p2.getCardZone(eligibleEnemyId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(ineligibleEnemyId!)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p1.getCardZone(gd01Kusanagi129)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("still returns the eligible enemy Unit when there is no Shield to add", () => {
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd01Kusanagi129], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd01Kusanagi129));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("does not offer a high-HP enemy Unit or a qualifying friendly Unit", () => {
    const friendly = createMockUnit({ hp: 3 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Kusanagi129],
        play: [friendly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd01Kusanagi129));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(friendlyId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(engine.asPlayer(PLAYER_TWO).getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
