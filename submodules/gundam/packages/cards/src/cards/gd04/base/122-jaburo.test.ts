import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Jaburo122 } from "./122-jaburo.ts";

describe("Jaburo (GD04-122)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Jaburo122],
      resourceArea: activeResources(4),
      shieldArea: [createMockUnit({ name: "Shield" })],
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.deployBase(gd04Jaburo122));

    expect(p1.getHand()).toContain(shieldId);
    expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
  });

  it("【Burst】 offers its owner the choice to deploy this card after a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd04Jaburo122] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Burst】 leaves this card in trash when its owner declines", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd04Jaburo122] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

    expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
  });

  describe("【Activate･Main】【Once per Turn】Rest 1 of your (Earth Federation) Units：Choose 1 enemy Unit that is Lv.3 or lower. Rest it.", () => {
    it("rests a friendly Earth Federation Unit to rest an enemy Lv.3 or lower Unit", () => {
      const costUnit = createMockUnit({ traits: ["earth federation"] });
      const enemy = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Jaburo122], play: [costUnit] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const costUnitId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(gd04Jaburo122, { targets: [enemyId] }));

      expect(p1.isExhausted(costUnitId)).toBe(true);
      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("cannot activate without an active friendly Earth Federation Unit", () => {
      const wrongTrait = createMockUnit({ traits: ["academy"] });
      const enemy = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Jaburo122], play: [wrongTrait] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04Jaburo122, { targets: [enemyId] }),
        "COST_NOT_PAYABLE",
      );
    });

    it("rejects enemy Units above Lv.3", () => {
      const costUnit = createMockUnit({ traits: ["earth federation"] });
      const enemy = createMockUnit({ level: 4 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Jaburo122], play: [costUnit] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04Jaburo122, { targets: [enemyId] }),
        "ILLEGAL_TARGET",
      );
    });
  });
});
