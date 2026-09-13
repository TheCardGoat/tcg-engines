import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05GearaDoga061 } from "./061-geara-doga.ts";

describe("Geara Doga (GD05-061)", () => {
  /** @behavioral-proof complete: another-friendly Neo Zeon condition, Blocker visibility, target replacement, rest cost, and no-companion exclusion are public. */
  it("gains <Blocker> with another friendly Neo Zeon Unit and redirects an attack", () => {
    const attacker = createMockUnit({ ap: 1, hp: 6 });
    const originalTarget = createMockUnit({ hp: 5 });
    const companion = createMockUnit({ traits: ["neo zeon"] });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: originalTarget, exhausted: true }, gd05GearaDoga061, companion] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [targetId, gearaId] = p2.getCardsInZone("battleArea");

    expect(p2.getVisibleCard(gearaId!)?.keywords).toContain("Blocker");
    expectSuccess(p1.enterBattle(attackerId, targetId!));
    expectSuccess(p2.declareBlock(gearaId!));

    expect(p2.isExhausted(gearaId!)).toBe(true);
    expect(p1.getBoardView().pendingCombat).toMatchObject({ blockerId: gearaId });
  });

  it("cannot block when it is the only Neo Zeon Unit", () => {
    const attacker = createMockUnit({ ap: 1, hp: 6 });
    const originalTarget = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: originalTarget, exhausted: true }, gd05GearaDoga061] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [targetId, gearaId] = p2.getCardsInZone("battleArea");

    expect(p2.getVisibleCard(gearaId!)?.keywords).not.toContain("Blocker");
    expectSuccess(p1.enterBattle(attackerId, targetId!));
    expectFailure(p2.declareBlock(gearaId!), "MISSING_BLOCKER_KEYWORD");
    expect(p2.isExhausted(gearaId!)).toBe(false);
  });
});
