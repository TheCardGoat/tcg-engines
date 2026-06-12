import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaFloorIt,
  spoilerHanakoArasakaInAGildedCage,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Hanako Arasaka - In A Gilded Cage", () => {
  it("reveals the top four and starts a search-deck choice keyed to a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [spoilerHanakoArasakaInAGildedCage],
      deck: [alphaFloorIt, alphaCorpoSecurity, alphaCorpoSecurity, alphaCorpoSecurity],
      eddies: 3,
      gigArea: [{ dieType: "d4", faceValue: 2 }],
    });

    const wanted = engine
      .getCardsInZone("deck", P1)
      .find((card) => card.definitionId === alphaFloorIt.id);
    if (!wanted) throw new Error("Expected Floor It in deck.");
    engine.judgeStackDeck([wanted], { as: P1 });
    engine.playCard(spoilerHanakoArasakaInAGildedCage, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      spoilerHanakoArasakaInAGildedCage.id,
    );
    expect(spoilerHanakoArasakaInAGildedCage.abilities[0]!.effects[0]).toMatchObject({
      effect: "searchDeck",
      lookCount: 4,
    });
  });
});
