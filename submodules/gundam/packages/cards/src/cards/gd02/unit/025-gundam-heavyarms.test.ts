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

    const deckSizeBefore = p1.getCardsInZone("deck").length;

    expectSuccess(p1.deployUnit(gd02GundamHeavyarms025));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("deckLook");
    if (choice?.kind !== "deckLook") return;
    expect(choice.revealedCardIds).toHaveLength(1);
    const [revealedId] = choice.revealedCardIds;
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { 0: { toBottom: [revealedId!] } } }));

    // The deploy trigger fires lookAtTopDeck(1, "topAndBottom").
    // Auto-resolve places the single revealed card to the bottom.
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("deck")).toHaveLength(deckSizeBefore);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
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
