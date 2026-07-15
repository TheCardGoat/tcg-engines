import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamPharact018 } from "./018-gundam-pharact.ts";

describe("Gundam Pharact (GD04-018)", () => {
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
});
