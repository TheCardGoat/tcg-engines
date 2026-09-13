import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01ZudahUnit1037 } from "./037-zudah-unit-1.ts";

describe("Zudah Unit 1 (EB01-037)", () => {
  /** @behavioral-proof complete: friendly-turn battle prevention is limited to a battling Blocker. */
  it("takes no battle damage while battling an enemy Unit with Blocker", () => {
    const blocker = createMockUnit({ ap: 2, hp: 5, keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      { play: [eb01ZudahUnit1037] },
      { play: [{ card: blocker, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const zudahId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(zudahId, blockerId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getCardZone(zudahId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getDamage(zudahId)).toBe(0);
  });
});
