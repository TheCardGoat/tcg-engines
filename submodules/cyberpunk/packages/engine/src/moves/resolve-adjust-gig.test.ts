import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDexterDeshawnOffTheGrid,
  welcomeToNightCityRetailMuamarReyesElCapitan,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../testing/index.ts";

describe("resolveAdjustGig", () => {
  it("allows zero only when an up-to adjustment permits it", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: false, spent: false },
      ],
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });

    engine.activateAbility(welcomeToNightCityRetailDexterDeshawnOffTheGrid, 1, { as: P1 });
    engine.declineAdjustGig({ as: P1 });

    expect(engine.getGigValue(P1)).toBe(2);
    engine.expectNoPendingChoice();
  });

  it("still rejects zero for an exact adjustment", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: false, spent: false },
      ],
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });

    engine.activateAbility(welcomeToNightCityRetailMuamarReyesElCapitan, 1, { as: P1 });
    const dieId = engine.findGigIdByType(P1, "d6");
    const failure = engine.expectFailure(() => engine.resolveAdjustGig(dieId, 3, { as: P1 }));

    expect(failure.errorCode).toBe("SAME_VALUE");
    expect(engine.getGigValue(P1)).toBe(3);
  });
});
