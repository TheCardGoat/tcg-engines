import { describe, expect, it } from "vite-plus/test";
import {
  createMockBase,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01GundamPlutone028 } from "./028-gundam-plutone.ts";

describe("Gundam Plutone (EB01-028)", () => {
  it("while rested gives another Unit Breach 2 only when it attacks an enemy Unit", () => {
    const attacker = createMockUnit({ ap: 2, hp: 4 });
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const base = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [{ card: eb01GundamPlutone028, exhausted: true }, attacker] },
      { play: [{ card: defender, exhausted: true }], baseSection: [base] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, attackerId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const baseId = p2.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.enterBattle(attackerId!, defenderId));
    expect(p1.getVisibleCard(attackerId!)?.keywords).toContain("Breach");
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getDamage(baseId)).toBe(2);
  });

  it("does not grant Breach when Plutone is active", () => {
    const attacker = createMockUnit({ ap: 2, hp: 4 });
    const defender = createMockUnit({ ap: 0, hp: 1 });
    const base = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [eb01GundamPlutone028, attacker] },
      { play: [{ card: defender, exhausted: true }], baseSection: [base] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, attackerId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const baseId = p2.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.enterBattle(attackerId!, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getDamage(baseId)).toBe(0);
  });

  it("grants Breach only to the first qualifying attack each turn", () => {
    const firstAttacker = createMockUnit({ ap: 1, hp: 4 });
    const secondAttacker = createMockUnit({ ap: 1, hp: 4 });
    const firstDefender = createMockUnit({ ap: 0, hp: 4 });
    const secondDefender = createMockUnit({ ap: 0, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        play: [{ card: eb01GundamPlutone028, exhausted: true }, firstAttacker, secondAttacker],
      },
      {
        play: [
          { card: firstDefender, exhausted: true },
          { card: secondDefender, exhausted: true },
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, firstAttackerId, secondAttackerId] = p1.getCardsInZone("battleArea");
    const [firstDefenderId, secondDefenderId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(firstAttackerId!, firstDefenderId!));
    expect(p1.getVisibleCard(firstAttackerId!)?.keywords).toContain("Breach");
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.enterBattle(secondAttackerId!, secondDefenderId!));
    expect(p1.getVisibleCard(secondAttackerId!)?.keywords).not.toContain("Breach");
  });
});
