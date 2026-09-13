import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailModdedMuramasa } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const muramasa = welcomeToNightCityRetailModdedMuramasa;

describe("Modded Muramasa", () => {
  it("is a blue Vehicle unit", () => {
    expect(muramasa).toMatchObject({
      type: "unit",
      color: "blue",
      classifications: ["Vehicle"],
      cost: 5,
      power: 4,
      printNumber: "121",
    });
  });

  it("readies at the end of your turn when you have less Street Cred than a Rival", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: muramasa, spent: true, hasLag: false }],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 8 }],
      },
    );

    expect(engine.getCard(muramasa, "field", P1).meta.spent).toBe(true);
    engine.completeTurn({ as: P1 });
    expect(engine.getCard(muramasa, "field", P1).meta.spent).toBe(false);
  });

  it("does not ready when you have equal or more Street Cred than a Rival", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: muramasa, spent: true, hasLag: false }],
        gigArea: [{ dieType: "d10", faceValue: 9 }],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 8 }],
      },
    );

    engine.completeTurn({ as: P1 });
    expect(engine.getCard(muramasa, "field", P1).meta.spent).toBe(true);
  });
});
