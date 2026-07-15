import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01InterceptOrders099 } from "../command/099-intercept-orders.ts";
import { gd01Gamow127 } from "./127-gamow.ts";

describe("Gamow (GD01-127)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd01Gamow127] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01Gamow127)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds one Shield to hand", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd01Gamow127],
      shieldArea: [returnedShield],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd01Gamow127));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("【Activate･Action】 grants Breach 3 for that battle and rests Gamow", () => {
    const attacker = createMockUnit({ ap: 5, hp: 6, traits: ["zaft"] });
    const defender = createMockUnit({ ap: 0, hp: 3 });
    const shield = createMockUnit({ name: "Enemy Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01InterceptOrders099],
        play: [attacker],
        baseSection: [gd01Gamow127],
        resourceArea: activeResources(4),
      },
      { play: [defender], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd01InterceptOrders099));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected Intercept Orders to ask which defender to rest");
    }
    expect(restChoice.legalTargetIds).toEqual([defenderId]);
    expectSuccess(p1.resolveEffect({ targets: [defenderId] }));
    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.activateAbility(baseId, 0));
    const breachChoice = p1.getBoardView().pendingChoice;
    if (breachChoice?.kind !== "targetSelection") {
      throw new Error("Expected Gamow to ask which battling ZAFT Unit gains Breach");
    }
    expect(breachChoice.legalTargetIds).toEqual([attackerId]);
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));
    expect(p1.getVisibleCard(attackerId)?.keywords).toContain("Breach");
    expect(p1.isExhausted(baseId)).toBe(true);
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p1.getVisibleCard(attackerId)?.keywords).not.toContain("Breach");
  });

  it("rejects the wrong trait, less than 5 AP, and an enemy Unit", () => {
    const battleUnit = createMockUnit({ ap: 1 });
    const legal = createMockUnit({ ap: 5, traits: ["zaft"] });
    const wrongTrait = createMockUnit({ ap: 5, traits: ["earth federation"] });
    const lowAp = createMockUnit({ ap: 4, traits: ["zaft"] });
    const enemy = createMockUnit({ ap: 5, traits: ["zaft"] });
    const engine = GundamTestEngine.create(
      { play: [battleUnit, legal, wrongTrait, lowAp], baseSection: [gd01Gamow127] },
      { play: [enemy], shieldArea: [createMockUnit({ name: "Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [battleUnitId, , wrongTraitId, lowApId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(battleUnitId!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectFailure(p1.activateAbility(baseId, 0, { targets: [wrongTraitId!] }), "ILLEGAL_TARGET");
    expectFailure(p1.activateAbility(baseId, 0, { targets: [lowApId!] }), "ILLEGAL_TARGET");
    expectFailure(p1.activateAbility(baseId, 0, { targets: [enemyId] }), "ILLEGAL_TARGET");
    expect(p1.isExhausted(baseId)).toBe(false);
  });
});
