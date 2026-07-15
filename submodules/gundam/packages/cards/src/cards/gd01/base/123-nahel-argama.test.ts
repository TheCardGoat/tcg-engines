import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01NahelArgama123 } from "./123-nahel-argama.ts";

describe("Nahel Argama (GD01-123)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01NahelArgama123] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01NahelArgama123)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds a Shield to hand, then asks which eligible enemy Unit to rest", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const eligibleEnemy = createMockUnit({ hp: 3 });
    const ineligibleEnemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01NahelArgama123],
        shieldArea: [returnedShield],
        resourceArea: activeResources(3),
      },
      { play: [eligibleEnemy, ineligibleEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleEnemyId, ineligibleEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd01NahelArgama123));
    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleEnemyId!] }));

    expect(p2.isExhausted(eligibleEnemyId!)).toBe(true);
    expect(p2.isExhausted(ineligibleEnemyId!)).toBe(false);
    expect(p1.getCardZone(gd01NahelArgama123)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("still asks for the enemy Unit when there is no Shield to add", () => {
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd01NahelArgama123], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd01NahelArgama123));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(engine.asPlayer(PLAYER_TWO).isExhausted(enemyId)).toBe(true);
  });

  it("does not offer a high-HP enemy Unit or a qualifying friendly Unit", () => {
    const friendly = createMockUnit({ hp: 3 });
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01NahelArgama123],
        play: [friendly],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd01NahelArgama123));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.isExhausted(friendlyId)).toBe(false);
    expect(engine.asPlayer(PLAYER_TWO).isExhausted(enemyId)).toBe(false);
  });
});
