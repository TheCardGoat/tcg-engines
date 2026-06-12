import { describe, it, expect } from "vite-plus/test";
import {
  createMockUnit,
  getEffectiveStats,
  GundamTestEngine,
  markAsLinkUnit,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd01UnicornGundam02BansheeDestroyMode003 } from "./003-unicorn-gundam-02-banshee-destroy-mode.ts";

describe("Unicorn Gundam 02 Banshee (Destroy Mode) (GD01-003)", () => {
  it("data keeps the printed linked attack trash-return text visible", () => {
    const effect = gd01UnicornGundam02BansheeDestroyMode003.effects?.[0];

    expect(effect?.activation.timing).toEqual(["attack"]);
    expect(effect?.activation.conditions).toContainEqual({ type: "duringLink" });
    expect(effect?.directives[0]).toMatchObject({
      action: { action: "returnToDeck", shuffle: true },
    });
    expect(effect?.sourceText).toContain("Choose 12 cards from your trash");
    expect(effect?.sourceText).toContain("set this Unit as active");
  });

  describe("【During Link】【Attack】Choose 12 cards from your trash. Return them to their owner's deck and shuffle it. If you do, set this Unit as active. It gains <First Strike> during this turn.", () => {
    function keywords(engine: GundamTestEngine, cardId: string): string[] {
      const framework = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(cardId, engine.getG(), framework.cards, framework).keywords;
    }

    function setup(trashCount = 12) {
      const trashCards = Array.from({ length: trashCount }, (_, index) =>
        createMockUnit({ name: `Trash ${index + 1}` }),
      );
      const enemy = createMockUnit({ ap: 1, hp: 7 });
      const engine = GundamTestEngine.create(
        { play: [gd01UnicornGundam02BansheeDestroyMode003], trash: trashCards },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const bansheeId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      markAsLinkUnit(engine, bansheeId);
      return { engine, p1, bansheeId, enemyId };
    }

    it("returns 12 trash cards to deck, readies itself, and gains First Strike while linked", () => {
      const { engine, p1, bansheeId, enemyId } = setup(12);
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.enterBattle(bansheeId, enemyId));

      expect(p1.getCardsInZone("trash")).toHaveLength(0);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore + 12);
      expect(isCardExhausted(engine, bansheeId)).toBe(false);
      expect(keywords(engine, bansheeId)).toContain("FirstStrike");
    });

    it("does not fire without 12 cards in trash", () => {
      const { engine, p1, bansheeId, enemyId } = setup(11);
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.enterBattle(bansheeId, enemyId));

      expect(p1.getCardsInZone("trash")).toHaveLength(11);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
      expect(isCardExhausted(engine, bansheeId)).toBe(true);
      expect(keywords(engine, bansheeId)).not.toContain("FirstStrike");
    });
  });
});
