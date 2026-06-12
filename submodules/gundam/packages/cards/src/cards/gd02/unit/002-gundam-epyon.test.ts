import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd02GundamEpyon002 } from "./002-gundam-epyon.ts";

describe("Gundam Epyon (GD02-002)", () => {
  it("data keeps the printed linked once-per-turn battle-destroy ready text visible", () => {
    const effect = gd02GundamEpyon002.effects?.[0];

    expect(effect?.activation.timing).toEqual(["onDestroyByBattle"]);
    expect(effect?.activation.conditions).toContainEqual({ type: "duringLink" });
    expect(effect?.activation.conditions).toContainEqual({ type: "isTurn", whose: "friendly" });
    expect(effect?.activation.restrictions).toEqual([{ type: "oncePerTurn" }]);
    expect(effect?.sourceText).toContain("destroys an enemy Unit with battle damage");
    expect(effect?.sourceText).toContain("set this Unit as active");
  });

  it("【During Link】 readies when another friendly Unit destroys an enemy Unit with battle damage", () => {
    const attacker = createMockUnit({ ap: 4, hp: 5 });
    const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [{ card: gd02GundamEpyon002, exhausted: true }, attacker] },
      { play: [{ card: fragileEnemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [epyonId, attackerId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    markAsLinkUnit(engine, epyonId!);

    engine.resolveCombat({ attackerId: attackerId!, target: defenderId });

    expect(engine.getG().exhausted[epyonId!]).toBe(false);
  });

  it("does not ready when Epyon is not linked", () => {
    const attacker = createMockUnit({ ap: 4, hp: 5 });
    const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [{ card: gd02GundamEpyon002, exhausted: true }, attacker] },
      { play: [{ card: fragileEnemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [epyonId, attackerId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    engine.resolveCombat({ attackerId: attackerId!, target: defenderId });

    expect(engine.getG().exhausted[epyonId!]).toBe(true);
  });
});
