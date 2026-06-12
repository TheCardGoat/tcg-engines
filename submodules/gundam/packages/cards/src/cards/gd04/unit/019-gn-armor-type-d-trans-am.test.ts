import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, createMockUnit } from "@tcg/gundam-engine";
import { gd04GnArmorTypeDTransAm019 } from "./019-gn-armor-type-d-trans-am.ts";

describe("GN Armor Type-D (Trans-Am) (GD04-019)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04GnArmorTypeDTransAm019.keywordEffects.map((effect) => effect.keyword)).toEqual([
      "Breach",
    ]);
  });

  it("【Destroyed】 reveals top 3 and tutors a (CB) Unit ≤Lv.5 to hand", () => {
    const cbTutor = createMockUnit({
      ap: 1,
      hp: 1,
      level: 4,
      traits: ["cb"],
    });
    const filler1 = createMockUnit({ ap: 1, hp: 1, traits: ["unrelated-1"] });
    const filler2 = createMockUnit({ ap: 1, hp: 1, traits: ["unrelated-2"] });

    const engine = GundamTestEngine.create({
      play: [gd04GnArmorTypeDTransAm019],
      deck: [cbTutor, filler1, filler2],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const gnArmorId = p1.getCardsInZone("battleArea")[0]!;

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });

    engine.destroyUnit(gnArmorId);

    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore + 1);
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const cbTutorInHand = p1.getCardsInZone("hand").some((id) => {
      const def = framework.cards.getDefinition(id) as { traits?: readonly string[] } | undefined;
      return def?.traits?.includes("cb");
    });
    expect(cbTutorInHand).toBe(true);
  });
});
