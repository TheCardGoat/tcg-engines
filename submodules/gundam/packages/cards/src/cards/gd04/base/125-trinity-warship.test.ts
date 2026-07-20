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
import { gd04TrinityWarship125 } from "./125-trinity-warship.ts";

describe("Trinity Warship (GD04-125)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04TrinityWarship125],
      resourceArea: activeResources(4),
      shieldArea: [createMockUnit({ name: "Shield" })],
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04TrinityWarship125));

    expect(p1.getHand()).toHaveLength(1);
  });

  it("【Burst】 offers its owner the choice to deploy this card after a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd04TrinityWarship125] },
    );
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
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd04TrinityWarship125)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Burst】 leaves this card in trash when its owner declines", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd04TrinityWarship125] },
    );
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
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

    expect(p2.getCardZone(gd04TrinityWarship125)).toBe(`trash:${PLAYER_TWO}`);
  });

  describe("【Activate･Main】【Once per Turn】①, rest 1 friendly (CB) Unit：Choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.", () => {
    it("pays 1 and rests a friendly CB Unit to deal 1 damage to an enemy Lv.5 or lower Unit", () => {
      const costUnit = createMockUnit({ traits: ["cb"] });
      const enemy = createMockUnit({ level: 5, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [gd04TrinityWarship125],
          play: [costUnit],
          resourceArea: activeResources(1),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const costUnitId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(gd04TrinityWarship125, { targets: [enemyId] }));

      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
      expect(p1.isExhausted(costUnitId)).toBe(true);
      expect(engine.asPlayer(PLAYER_TWO).getDamage(enemyId)).toBe(1);
    });

    it("cannot activate without an active friendly CB Unit", () => {
      const wrongTrait = createMockUnit({ traits: ["earth federation"] });
      const enemy = createMockUnit({ level: 5 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [gd04TrinityWarship125],
          play: [wrongTrait],
          resourceArea: activeResources(1),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04TrinityWarship125, { targets: [enemyId] }),
        "COST_NOT_PAYABLE",
      );
    });

    it("rejects enemy Units above Lv.5", () => {
      const costUnit = createMockUnit({ traits: ["cb"] });
      const enemy = createMockUnit({ level: 6 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [gd04TrinityWarship125],
          play: [costUnit],
          resourceArea: activeResources(1),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04TrinityWarship125, { targets: [enemyId] }),
        "ILLEGAL_TARGET",
      );
    });
  });
});
