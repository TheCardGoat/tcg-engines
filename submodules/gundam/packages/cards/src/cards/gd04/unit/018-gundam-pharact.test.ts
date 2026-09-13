import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamPharact018 } from "./018-gundam-pharact.ts";

function enemyEffectDamageUnit() {
  const effect: CardEffect = {
    type: "activated",
    activation: { timing: ["activate:action"] },
    directives: [
      {
        action: {
          action: "dealDamage",
          amount: 1,
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ],
    sourceText: "【Activate･Action】Deal 1 damage to 1 enemy Unit.",
  };
  return createMockUnit({ name: "Enemy Effect Source", effects: [effect] });
}

describe("Gundam Pharact (GD04-018)", () => {
  /** @behavioral-proof complete: Breach, turn/source/other/Academy gates, battle/effect damage, EX state, and once-per-turn are public. */
  it("<Breach 5> deals 5 damage to the enemy Base after destroying a Unit in battle", () => {
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const base = createMockBase({ hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamPharact018] },
      { play: [{ card: defender, exhausted: true }], baseSection: [base] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const pharactId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const baseId = p2.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.enterBattle(pharactId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getDamage(baseId)).toBe(5);
  });

  it("places only 1 active EX Resource when other Academy Units receive enemy battle damage during your turn", () => {
    const firstAcademyUnit = createMockUnit({
      name: "First Academy Unit",
      traits: ["academy"],
      ap: 2,
      hp: 5,
    });
    const secondAcademyUnit = createMockUnit({
      name: "Second Academy Unit",
      traits: ["academy"],
      ap: 2,
      hp: 5,
    });
    const firstDefender = createMockUnit({ name: "First Enemy", ap: 1, hp: 5 });
    const secondDefender = createMockUnit({ name: "Second Enemy", ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamPharact018, firstAcademyUnit, secondAcademyUnit] },
      {
        play: [
          { card: firstDefender, exhausted: true },
          { card: secondDefender, exhausted: true },
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, firstAcademyId, secondAcademyId] = p1.getCardsInZone("battleArea");
    const [firstDefenderId, secondDefenderId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(firstAcademyId!, firstDefenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.enterBattle(secondAcademyId!, secondDefenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    const [exResourceId] = p1.getCardsInZone("resourceArea");
    expect(p1.getDamage(firstAcademyId!)).toBe(1);
    expect(p1.getDamage(secondAcademyId!)).toBe(1);
    expect(p1.getResourceCount()).toBe(1);
    expect(p1.isExhausted(exResourceId!)).toBe(false);
  });

  it("does not place an EX Resource when Pharact itself receives the damage", () => {
    const defender = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamPharact018] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const pharactId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(pharactId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(pharactId)).toBe(2);
    expect(p1.getResourceCount()).toBe(0);
  });

  it("places an active EX Resource when another Academy Unit receives enemy effect damage", () => {
    const academyUnit = createMockUnit({ traits: ["academy"], hp: 5 });
    const effectSource = enemyEffectDamageUnit();
    const engine = GundamTestEngine.create(
      { play: [gd04GundamPharact018, academyUnit], deck: 5 },
      { play: [effectSource], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const academyId = p1.getCardsInZone("battleArea")[1]!;
    const sourceId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.activateAbility(sourceId, 0, { targets: [academyId] }));

    const [resourceId] = p1.getCardsInZone("resourceArea");
    expect(p1.getDamage(academyId)).toBe(1);
    expect(p1.getResourceCount()).toBe(1);
    expect(p1.isExhausted(resourceId!)).toBe(false);
  });

  it("does not place an EX Resource when a non-Academy Unit receives enemy damage", () => {
    const nonAcademyUnit = createMockUnit({ traits: ["earth federation"], ap: 2, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamPharact018, nonAcademyUnit] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const nonAcademyId = p1.getCardsInZone("battleArea")[1]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(nonAcademyId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(nonAcademyId)).toBe(1);
    expect(p1.getResourceCount()).toBe(0);
  });

  it("does not place an EX Resource when an Academy Unit receives damage on the opponent's turn", () => {
    const academyUnit = createMockUnit({ traits: ["academy"], ap: 1, hp: 5 });
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamPharact018, { card: academyUnit, exhausted: true }] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const academyId = p1.getCardsInZone("battleArea")[1]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, academyId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getDamage(academyId)).toBe(2);
    expect(p1.getResourceCount()).toBe(0);
  });
});
