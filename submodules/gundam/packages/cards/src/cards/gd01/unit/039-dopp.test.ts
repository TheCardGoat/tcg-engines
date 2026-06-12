import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, expectSuccess, activeResources } from "@tcg/gundam-engine";
import { gd01Dopp039 } from "./039-dopp.ts";

describe("Dopp (GD01-039)", () => {
  it("【Deploy】 looks at top card of deck and places it to the bottom", () => {
    // Dopp is Lv.1 / cost 1 — need 1+ resource to deploy.
    const engine = GundamTestEngine.create(
      { hand: [gd01Dopp039], resourceArea: activeResources(1), deck: 4 },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    const deckBefore = p1.getCardsInZone("deck");
    const topCardBefore = deckBefore[0]!;
    const deckSizeBefore = deckBefore.length;

    expectSuccess(p1.deployUnit(gd01Dopp039));

    const deckAfter = p1.getCardsInZone("deck");
    expect(deckAfter.length).toBe(deckSizeBefore);

    // The card that was on top is now at the bottom.
    expect(deckAfter[deckAfter.length - 1]).toBe(topCardBefore);
    expect(deckAfter[0]).not.toBe(topCardBefore);
  });
});
