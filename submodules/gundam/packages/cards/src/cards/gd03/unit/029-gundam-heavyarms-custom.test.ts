import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd03GundamHeavyarmsCustom029 } from "./029-gundam-heavyarms-custom.ts";

describe("Gundam Heavyarms Custom (GD03-029)", () => {
  it("during your turn, when this Unit destroys an enemy Unit by battle damage, deals 2 to all enemy Blocker Units", () => {
    // Heavyarms (AP 4) attacks a 1-HP defender → defender dies.
    // The new `onDestroyByBattle` event fires on the attacker, gated on
    // isTurn:friendly. Two other enemy Blockers in play take 2 each.
    const fragileDefender = createMockUnit({ ap: 1, hp: 1 });
    const blocker1 = createMockUnit({
      ap: 2,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const blocker2 = createMockUnit({
      ap: 2,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const nonBlocker = createMockUnit({ ap: 2, hp: 4 });

    const engine = GundamTestEngine.create(
      { play: [gd03GundamHeavyarmsCustom029] },
      { play: [{ card: fragileDefender, exhausted: true }, blocker1, blocker2, nonBlocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, blocker1Id, blocker2Id, nonBlockerId] = p2.getCardsInZone("battleArea");

    engine.resolveCombat({ attackerId, target: defenderId! });

    // Both Blockers took 2 damage from the trigger.
    expect(getDamageCounter(engine, blocker1Id!)).toBe(2);
    expect(getDamageCounter(engine, blocker2Id!)).toBe(2);
    // Non-Blocker enemy untouched.
    expect(getDamageCounter(engine, nonBlockerId!)).toBe(0);
  });

  it("does NOT fire when the defender is NOT destroyed (e.g. AP < HP)", () => {
    const sturdyDefender = createMockUnit({ ap: 1, hp: 8 });
    const blocker = createMockUnit({
      ap: 2,
      hp: 4,
      keywordEffects: [{ keyword: "Blocker" }],
    } as unknown as Parameters<typeof createMockUnit>[0]);

    const engine = GundamTestEngine.create(
      { play: [gd03GundamHeavyarmsCustom029] },
      { play: [{ card: sturdyDefender, exhausted: true }, blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, blockerId] = p2.getCardsInZone("battleArea");

    engine.resolveCombat({ attackerId, target: defenderId! });

    // Defender survived (4 damage, 8 HP) — the trigger never fires.
    expect(getDamageCounter(engine, blockerId!)).toBe(0);
  });
});
