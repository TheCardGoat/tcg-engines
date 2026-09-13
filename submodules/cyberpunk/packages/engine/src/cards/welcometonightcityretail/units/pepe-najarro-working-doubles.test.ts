import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailPepeNajarroWorkingDoubles,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Pepe Najarro — Working Doubles", () => {
  it("is a green Valentino unit with an attack-triggered ready effect", () => {
    const card = welcomeToNightCityRetailPepeNajarroWorkingDoubles;
    expect(card.type).toBe("unit");
    expect(card.color).toBe("green");
    expect(card.classifications).toEqual(["Valentino"]);
    expect(card.cost).toBe(4);
    expect(card.power).toBe(6);
    expect(card.abilities[0]?.trigger).toMatchObject({ trigger: "attack" });
  });

  it("plays to the field with lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailPepeNajarroWorkingDoubles],
      eddies: 4,
    });

    engine.playCard(welcomeToNightCityRetailPepeNajarroWorkingDoubles, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailPepeNajarroWorkingDoubles, "field", P1).meta.hasLag,
    ).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("can attack and keeps the merc-legend ready ability shape", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailPepeNajarroWorkingDoubles,
            spent: false,
            hasLag: false,
          },
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            faceDown: false,
            spent: true,
          },
        ],
        gigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailPepeNajarroWorkingDoubles, { as: P1 });

    // Attack declared; ability may open a ready choice when a value-pair is controlled.
    expect(engine.getState().G.attackState?.kind).toBe("direct");
  });
});
