import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailOverTheEdge,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Over the Edge", () => {
  it("defeats a Unit whose power is at most a friendly d20 value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailOverTheEdge],
        eddies: 3,
        gigArea: [{ dieType: "d12", faceValue: 3 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    const d12 = engine.getGigDice(P1).find((die) => die.dieType === "d12");
    if (!d12) throw new Error("Expected fixture to include a d12 die");
    engine.getState().G.gigDice[d12.id]!.dieType = "d20";

    engine.playCard(welcomeToNightCityRetailOverTheEdge, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("checks every friendly d20 when finding the maximum eligible power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailOverTheEdge],
        eddies: 3,
        gigArea: [
          { dieType: "d10", faceValue: 3 },
          { dieType: "d12", faceValue: 5 },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false }],
      },
    );

    const d10 = engine.getGigDice(P1).find((die) => die.dieType === "d10");
    const d12 = engine.getGigDice(P1).find((die) => die.dieType === "d12");
    if (!d10) throw new Error("Expected fixture to include a d10 die");
    if (!d12) throw new Error("Expected fixture to include a d12 die");
    engine.getState().G.gigDice[d10.id]!.dieType = "d20";
    engine.getState().G.gigDice[d12.id]!.dieType = "d20";

    engine.playCard(welcomeToNightCityRetailOverTheEdge, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
  });
});
