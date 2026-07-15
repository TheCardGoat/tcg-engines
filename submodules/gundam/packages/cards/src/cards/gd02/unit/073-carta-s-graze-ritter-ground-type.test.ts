import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02CartaSGrazeRitterGroundType073 } from "./073-carta-s-graze-ritter-ground-type.ts";

describe("Carta's Graze Ritter (Ground Type) (GD02-073)", () => {
  const firstStrikeAttacker = createMockUnit({
    name: "First Strike Attacker",
    ap: 4,
    hp: 5,
  });
  const alternateTarget = createMockUnit({
    name: "Alternate Target",
    ap: 5,
    hp: 4,
  });

  function finishBattle(
    attacker: ReturnType<GundamTestEngine["asPlayer"]>,
    defender: ReturnType<GundamTestEngine["asPlayer"]>,
    attackerId: string,
    targetId: string,
  ) {
    expectSuccess(attacker.enterBattle(attackerId, targetId));
    expectSuccess(defender.passBlock());
    expectSuccess(defender.passBattleAction());
    expectSuccess(attacker.passBattleAction());
  }

  it("lets the opponent's attacker strike first while battling Carta on their turn", () => {
    const engine = GundamTestEngine.create(
      { play: [{ card: gd02CartaSGrazeRitterGroundType073, exhausted: true }], deck: 5 },
      { play: [firstStrikeAttacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const cartaId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    engine.endTurn();
    finishBattle(p2, p1, attackerId, cartaId);

    expect(p1.getCardsInZone("trash")).toContain(cartaId);
    expect(p2.getCardsInZone("battleArea")).toContain(attackerId);
    expect(p2.getDamage(attackerId)).toBe(0);
  });

  it("does not give First Strike to an attacker battling a different Unit", () => {
    const engine = GundamTestEngine.create(
      {
        play: [gd02CartaSGrazeRitterGroundType073, { card: alternateTarget, exhausted: true }],
        deck: 5,
      },
      { play: [firstStrikeAttacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const targetId = p1.getCardsInZone("battleArea")[1]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    engine.endTurn();
    finishBattle(p2, p1, attackerId, targetId);

    expect(p1.getCardsInZone("trash")).toContain(targetId);
    expect(p2.getCardsInZone("trash")).toContain(attackerId);
  });

  it("does not give the enemy First Strike when Carta attacks on its controller's turn", () => {
    const engine = GundamTestEngine.create(
      { play: [gd02CartaSGrazeRitterGroundType073] },
      { play: [{ card: firstStrikeAttacker, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const cartaId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p2.getCardsInZone("battleArea")[0]!;

    finishBattle(p1, p2, cartaId, targetId);

    expect(p1.getCardsInZone("trash")).toContain(cartaId);
    expect(p2.getCardsInZone("trash")).toContain(targetId);
  });
});
