import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  markAsLinkUnit,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd01GundamPharact071 } from "./071-gundam-pharact.ts";

describe("Gundam Pharact (GD01-071)", () => {
  // Card carries an `attack` trigger gated by `duringLink`, applying AP-2
  // thisBattle to an enemy unit.
  it("【During Link】【Attack】 applies AP-2 to the target enemy for this battle", () => {
    // Enemy: AP 4 / HP 4. Pharact: AP 3 / HP 4.
    // Without AP-2: mutual damage → Pharact takes 4 (destroyed), enemy takes 3.
    // With AP-2:    enemy AP becomes 2 → Pharact takes 2 (survives), enemy takes 3.
    const enemy = createMockUnit({ ap: 4, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd01GundamPharact071] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    markAsLinkUnit(engine, attackerId);
    engine.getG().exhausted[attackerId] = false;

    engine.resolveCombat({ attackerId, target: defenderId });

    // Pharact took 2 damage (would have been 4 without the debuff) → survives.
    expect(engine.getG().damage[attackerId]).toBe(2);
    // Defender zone unchanged (still in battleArea, not trashed).
    const defenderZone = engine.getState().ctx.zones.private.cardIndex[defenderId]?.zoneKey;
    expect(defenderZone).toBe(`battleArea:${PLAYER_TWO}`);
  });

  it("does NOT apply AP-2 when Pharact is not a Link Unit", () => {
    // Same matchup but Pharact is unpaired → duringLink gate rejects at
    // enqueue; enemy AP stays 4, Pharact takes 4 and is destroyed.
    const enemy = createMockUnit({ ap: 4, hp: 4 });
    const engine = GundamTestEngine.create({ play: [gd01GundamPharact071] }, { play: [enemy] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    engine.getG().exhausted[attackerId] = false;

    engine.resolveCombat({ attackerId, target: defenderId });

    // Pharact destroyed (took full 4 damage).
    const attackerZone = engine.getState().ctx.zones.private.cardIndex[attackerId]?.zoneKey;
    expect(attackerZone).toBe(`trash:${PLAYER_ONE}`);
  });
});
