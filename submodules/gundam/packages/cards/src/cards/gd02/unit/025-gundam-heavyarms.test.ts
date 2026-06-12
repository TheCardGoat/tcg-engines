import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd02GundamHeavyarms025 } from "./025-gundam-heavyarms.ts";

describe("Gundam Heavyarms (GD02-025)", () => {
  it("【Deploy】 looks at top card of deck and places it to the bottom", () => {
    // Heavyarms is Lv.4 / cost 3 — need 4+ resources to deploy.
    const engine = GundamTestEngine.create(
      { hand: [gd02GundamHeavyarms025], resourceArea: activeResources(4), deck: 5 },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    // Snapshot the deck before deploy.
    const deckBefore = p1.getCardsInZone("deck");
    const topCardBefore = deckBefore[0]!;
    const deckSizeBefore = deckBefore.length;

    expectSuccess(p1.deployUnit(gd02GundamHeavyarms025));

    // The deploy trigger fires lookAtTopDeck(1, "topAndBottom").
    // Auto-resolve places the single revealed card to the bottom.
    const deckAfter = p1.getCardsInZone("deck");
    expect(deckAfter.length).toBe(deckSizeBefore);

    // The card that was on top is now at the bottom.
    expect(deckAfter[deckAfter.length - 1]).toBe(topCardBefore);
    // It should no longer be the first card in the deck.
    expect(deckAfter[0]).not.toBe(topCardBefore);
  });

  it("【Deploy】 on empty deck is a no-op", () => {
    const filler = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [gd02GundamHeavyarms025, filler], resourceArea: activeResources(4), deck: 0 },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    // Deploy should succeed even with empty deck — lookAtTopDeck is a no-op.
    expectSuccess(p1.deployUnit(gd02GundamHeavyarms025));
    expect(p1.getCardsInZone("deck").length).toBe(0);
  });
});
