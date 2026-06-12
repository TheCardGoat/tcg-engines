import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01ShenlongGundam029 } from "./029-shenlong-gundam.ts";

describe("Shenlong Gundam (GD01-029)", () => {
  it("<Breach 4> deals 4 damage to a shield when the attacker destroys a Unit", () => {
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const shieldSeed = createMockUnit({ ap: 1, hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [gd01ShenlongGundam029] },
      { play: [defender], deck: [shieldSeed] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shenlongId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(shenlongId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Shenlong (AP 4) destroys defender (HP 1) -> Breach 4 lands on the shield.
    expect(getDamageCounter(engine, shieldId!)).toBe(4);
  });

  it("【Attack】 destroys an enemy <Blocker> with Lv.3 or lower", () => {
    const blocker = createMockUnit({
      ap: 1,
      hp: 5,
      level: 3,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const sturdy = createMockUnit({ ap: 1, hp: 10, level: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd01ShenlongGundam029] },
      { play: [sturdy, blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shenlongId = p1.getCardsInZone("battleArea")[0]!;
    const [sturdyId, blockerId] = p2.getCardsInZone("battleArea");

    engine.resolveCombat({ attackerId: shenlongId, target: sturdyId! });

    // The Blocker should be destroyed (moved to trash).
    const blockerZone = engine.getState().ctx.zones.private.cardIndex[blockerId!]?.zoneKey;
    expect(blockerZone).toBe(`trash:${PLAYER_TWO}`);
  });
});
