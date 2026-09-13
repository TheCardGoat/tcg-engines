import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01GoufVijayanta014 } from "./014-gouf-vijayanta.ts";

function effectDamageUnit(level: number, timing: "main" | "action" = "main") {
  const effect: CardEffect = {
    type: "activated",
    activation: { timing: [`activate:${timing}`] },
    directives: [
      {
        action: {
          action: "dealDamage",
          amount: 2,
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ],
    sourceText: `【Activate･${timing === "main" ? "Main" : "Action"}】Deal 2 damage.`,
  };
  return createMockUnit({ name: `Lv.${level} Damage Unit`, level, effects: [effect] });
}

describe("Gouf Vijayanta (EB01-014)", () => {
  /** @behavioral-proof complete: opponent-turn, enemy Unit source, effect-damage type, and Lv.5 ceiling are public. */
  it("prevents effect damage from an enemy Lv.5 Unit during the opponent's turn", () => {
    const source = effectDamageUnit(5);
    const engine = GundamTestEngine.create(
      { play: [eb01GoufVijayanta014] },
      { play: [source] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const goufId = p1.getCardsInZone("battleArea")[0]!;
    const sourceId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.activateAbility(sourceId, 0, { targets: [goufId] }));

    expect(p1.getDamage(goufId)).toBe(0);
  });

  it("receives effect damage from an enemy Lv.6 Unit", () => {
    const source = effectDamageUnit(6);
    const engine = GundamTestEngine.create(
      { play: [eb01GoufVijayanta014] },
      { play: [source] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const goufId = p1.getCardsInZone("battleArea")[0]!;
    const sourceId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.activateAbility(sourceId, 0, { targets: [goufId] }));

    expect(p1.getDamage(goufId)).toBe(2);
  });

  it("receives the same Lv.5 enemy effect damage during its controller's turn", () => {
    const source = effectDamageUnit(5, "action");
    const engine = GundamTestEngine.create(
      { play: [eb01GoufVijayanta014], deck: 5 },
      { play: [source], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const goufId = p1.getCardsInZone("battleArea")[0]!;
    const sourceId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.activateAbility(sourceId, 0, { targets: [goufId] }));

    expect(p1.getDamage(goufId)).toBe(2);
  });

  it("still receives ordinary battle damage from a Lv.5 enemy Unit", () => {
    const attacker = createMockUnit({ name: "Lv.5 Attacker", level: 5, ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [{ card: eb01GoufVijayanta014, exhausted: true }], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const goufId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, goufId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getDamage(goufId)).toBe(2);
  });
});
