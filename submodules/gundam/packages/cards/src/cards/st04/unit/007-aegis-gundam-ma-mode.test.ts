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
import { st04AegisGundamMaMode007 } from "./007-aegis-gundam-ma-mode.ts";

describe("Aegis Gundam (MA Mode) (ST04-007)", () => {
  it("declares the <Breach 3> keyword in card data", () => {
    expect(
      st04AegisGundamMaMode007.keywordEffects?.some((k) => k.keyword === "Breach" && k.value === 3),
    ).toBe(true);
  });

  it("<Breach 3> deals 3 damage to the defender's top shield on kill", () => {
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const shieldSeed = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [st04AegisGundamMaMode007] },
      { play: [defender], deck: [shieldSeed] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const aegisId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(aegisId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Aegis (AP 3) destroys defender (HP 1) -> Breach 3 lands on the shield.
    expect(getDamageCounter(engine, shieldId!)).toBe(3);
  });
});
