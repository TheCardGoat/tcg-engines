import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailWeGottaLiveTogether,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const weGotta = welcomeToNightCityRetailWeGottaLiveTogether;

describe("We Gotta Live Together", () => {
  it("costs 3 €$ when a Rival controls at least 2 more Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [weGotta],
        trash: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
        eddies: 3,
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );
    const id = engine.findCardId(weGotta, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(3);
    engine.playCard(weGotta, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("keeps its printed 5 €$ cost when the Rival does not lead by 2 Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [weGotta],
        legendArea: [],
        eddies: 3,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
    );
    const id = engine.findCardId(weGotta, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(5);
    const failure = engine.expectFailure(() => engine.playCard(weGotta, { as: P1 }));
    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
  });

  it("plays up to 2 cost-3-or-less Units from trash for free", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [weGotta],
      legendArea: [],
      trash: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      eddies: 5,
    });

    engine.playCard(weGotta, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    engine.resolveCardToPlay(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    engine.resolveCardToPlay(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorpoSecurity.id,
        welcomeToNightCityRetailFieldOperator.id,
      ]),
    );
    expect(engine.getEddies(P1)).toBe(0);
  });
});
