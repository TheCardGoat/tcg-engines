import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailJackieWellesMamaSFavorite } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectAttackCandidate } from "../../../testing/index.ts";

describe("Jackie Welles — Mama's Favorite", () => {
  it("is a green Merc GO SOLO legend with cost 6 and power 8", () => {
    const card = welcomeToNightCityRetailJackieWellesMamaSFavorite;
    expect(card.type).toBe("legend");
    expect(card.color).toBe("green");
    expect(card.classifications).toEqual(["Merc"]);
    expect(card.keywords).toContain("goSolo");
    expect(card.cost).toBe(6);
    expect(card.power).toBe(8);
    expect(card.printNumber).toBe("073");
  });

  it("goes solo from the legend area and can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false }],
      eddies: 6,
    });
    const jackieId = engine.findCardId(
      welcomeToNightCityRetailJackieWellesMamaSFavorite,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: jackieId as string } }, P1);

    expect(result.success).toBe(true);
    const jackie = engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "field", P1);
    expect(jackie.meta.spent).toBe(false);
    expect(jackie.meta.hasLag).toBe(false);
    expectAttackCandidate(engine, welcomeToNightCityRetailJackieWellesMamaSFavorite, {
      as: P1,
    });
  });

  it("cannot go solo without enough eddies", () => {
    // Fill all three legend slots with Jackie face-up so filler face-down
    // legends cannot be spent as Eddie substitutes.
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
        { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
        { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
      ],
      eddies: 0,
    });
    const jackieId = engine.findCardId(
      welcomeToNightCityRetailJackieWellesMamaSFavorite,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: jackieId as string } }, P1);

    expect(result).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
  });
});
