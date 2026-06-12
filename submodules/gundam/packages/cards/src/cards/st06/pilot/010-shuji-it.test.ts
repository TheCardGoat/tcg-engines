import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_TWO, seedShieldsFromDeck } from "@tcg/gundam-engine";
import { st06ShujiIt010 } from "./010-shuji-it.ts";

describe("Shuji Itō (ST06-010)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st06ShujiIt010] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【During Link】【Attack】 card data encodes lookAtTopDeck in thenDirectives", () => {
    // Verify the card data now has the lookAtTopDeck action wired in the
    // conditional thenDirectives (previously empty).
    const cardDef = st06ShujiIt010;
    const linkEffect = cardDef.effects![1];
    const directives = (
      linkEffect as {
        directives: Array<{ thenDirectives?: Array<{ action?: Record<string, unknown> }> }>;
      }
    ).directives;
    const conditional = directives[0]!;
    expect(conditional.thenDirectives).toBeDefined();
    expect(conditional.thenDirectives!.length).toBeGreaterThan(0);
    const action = conditional.thenDirectives![0]!.action!;
    expect(action.action).toBe("lookAtTopDeck");
    expect(action.count).toBe(1);
  });
});
