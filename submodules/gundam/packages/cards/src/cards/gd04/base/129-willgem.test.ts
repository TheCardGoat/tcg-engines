import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Willgem129 } from "./129-willgem.ts";

describe("Willgem (GD04-129)", () => {
  it("【Deploy】 adds 1 shield to hand and deals 3 damage to itself", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Willgem129],
      resourceArea: activeResources(3),
      shieldArea: [createMockUnit({ name: "Shield" })],
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04Willgem129));

    const baseId = p1.getCardsInZone("baseSection")[0]!;
    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getDamage(baseId)).toBe(3);
  });

  it("【Burst】 offers its owner the choice to deploy this card after a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd04Willgem129] });
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

    expect(p2.getCardZone(gd04Willgem129)).toBe(`baseSection:${PLAYER_TWO}`);
    expect(p2.getDamage(gd04Willgem129)).toBe(3);
  });

  it("【Burst】 leaves this card in trash when its owner declines", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd04Willgem129] });
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

    expect(p2.getCardZone(gd04Willgem129)).toBe(`trash:${PLAYER_TWO}`);
  });

  describe("【Once per Turn】During your turn, when you pay ① or more for a friendly Unit's effect, this Base recovers 2 HP.", () => {
    it("recovers 2 HP only once when two friendly Unit effects are paid for in the same turn", () => {
      const firstUnit = createPaidEffectUnit(1, "FIRST");
      const secondUnit = createPaidEffectUnit(1, "SECOND");
      const engine = GundamTestEngine.create({
        baseSection: [{ card: gd04Willgem129, damage: 5 }],
        play: [firstUnit, secondUnit],
        resourceArea: activeResources(2),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const [firstUnitId, secondUnitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateAbility(firstUnitId!, 0));
      expect(p1.getDamage(baseId)).toBe(3);
      expectSuccess(p1.activateAbility(secondUnitId!, 0));

      expect(p1.getDamage(baseId)).toBe(3);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("does not recover when a Unit effect has no resource payment", () => {
      const unit = createPaidEffectUnit(0);
      const engine = GundamTestEngine.create({
        baseSection: [{ card: gd04Willgem129, damage: 3 }],
        play: [unit],
        resourceArea: activeResources(1),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.activateAbility(unitId, 0));

      expect(p1.getDamage(baseId)).toBe(3);
    });

    it("does not recover when resources are paid to play a Command rather than for a Unit effect", () => {
      const command = createMockCommand({
        cost: 1,
        effect: "【Main】Draw 1.",
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "【Main】Draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create({
        hand: [command],
        baseSection: [{ card: gd04Willgem129, damage: 3 }],
        resourceArea: activeResources(3),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      expectSuccess(p1.playCommand(command));

      expect(p1.getDamage(baseId)).toBe(3);
    });
  });
});

function createPaidEffectUnit(payResources: number, suffix = "") {
  return createMockUnit({
    cardNumber: `TEST-PAID-UNIT-EFFECT-${payResources}-${suffix}`,
    effects: [
      {
        type: "activated",
        activation: { timing: ["activate:main"] },
        cost: { payResources },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: `【Activate·Main】${payResources > 0 ? "①" : ""}：Draw 1.`,
      },
    ],
  });
}
