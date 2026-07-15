import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07AllelujahHaptism012 } from "../../st07/pilot/012-allelujah-haptism.ts";
import { gd03GundamKyrios022 } from "./022-gundam-kyrios.ts";

describe("Gundam Kyrios (GD03-022)", () => {
  it("【During Link】 deals 1 damage to all enemy Units (Lv.3 or lower) when this destroys an enemy by battle damage on your turn", () => {
    const fragileDefender = createMockUnit({ ap: 1, hp: 1, level: 2 });
    const lowLvEnemy = createMockUnit({ ap: 2, hp: 5, level: 3 });
    const highLvEnemy = createMockUnit({ ap: 2, hp: 5, level: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [st07AllelujahHaptism012],
        play: [gd03GundamKyrios022],
        resourceArea: activeResources(3),
      },
      { play: [{ card: fragileDefender, exhausted: true }, lowLvEnemy, highLvEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, lowLvId, highLvId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(st07AllelujahHaptism012, attackerId));
    expectSuccess(p1.enterBattle(attackerId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Lv.3 enemy took 1 damage (filter Lv ≤ 3).
    expect(p2.getDamage(lowLvId!)).toBe(1);
    // Lv.5 enemy is outside the filter — no damage.
    expect(p2.getDamage(highLvId!)).toBe(0);
  });

  it("does NOT fire when this Unit is NOT a Link Unit (duringLink gate fails)", () => {
    const fragileDefender = createMockUnit({ ap: 1, hp: 1, level: 2 });
    const lowLvEnemy = createMockUnit({ ap: 2, hp: 5, level: 3 });

    const nonLinkPilot = createMockPilot({ name: "Ordinary Pilot", cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [nonLinkPilot],
        play: [gd03GundamKyrios022],
        resourceArea: activeResources(3),
      },
      { play: [{ card: fragileDefender, exhausted: true }, lowLvEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, lowLvId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(nonLinkPilot, attackerId));
    expectSuccess(p1.enterBattle(attackerId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getDamage(lowLvId!)).toBe(0);
  });

  it("does not damage low-level enemies when it destroys an attacker on the opponent's turn", () => {
    const fragileAttacker = createMockUnit({ ap: 1, hp: 1, level: 2 });
    const transitionDefender = createMockUnit({ ap: 0, hp: 10, level: 5 });
    const lowLvEnemy = createMockUnit({ ap: 2, hp: 5, level: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [st07AllelujahHaptism012],
        play: [gd03GundamKyrios022],
        resourceArea: activeResources(3),
        deck: 5,
      },
      {
        play: [fragileAttacker, { card: transitionDefender, exhausted: true }, lowLvEnemy],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const kyriosId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, transitionDefenderId, lowLvEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(st07AllelujahHaptism012, kyriosId));
    expectSuccess(p1.enterBattle(kyriosId, transitionDefenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expectSuccess(p2.enterBattle(attackerId!, kyriosId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p2.getCardZone(attackerId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getDamage(lowLvEnemyId!)).toBe(0);
  });
});
