import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDexterDeshawnOffTheGrid,
  welcomeToNightCityRetailMuamarReyesElCapitan,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../testing/index.ts";

describe("resolveAdjustGig", () => {
  it("accepts the current face for an atomic up-to adjustment without a value-change event", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: false, spent: false },
      ],
      gigArea: [{ dieType: "d4", faceValue: 4 }],
    });
    engine.activateAbility(welcomeToNightCityRetailDexterDeshawnOffTheGrid, 1, { as: P1 });
    const dieId = engine.findGigIdByType(P1, "d4");
    expect(engine.resolveAdjustGig(dieId, 4, { as: P1 }).success).toBe(true);
    expect(engine.getGigValue(P1)).toBe(4);
    expect(engine.getEvents("gigValueChanged")).toEqual([]);
    engine.expectNoPendingChoice();
    const legends = engine.getFilteredView(P1).players[P1]?.zones.legendArea;
    if (!Array.isArray(legends)) throw new Error("Expected visible Legends");
    const sourceId = engine.findCardId(
      welcomeToNightCityRetailDexterDeshawnOffTheGrid,
      "legendArea",
      P1,
    );
    expect(legends.find((card) => card.instanceId === sourceId)?.spent).toBe(true);
  });

  it("uses zero as an adjustment amount, never as a Gig face value", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: false, spent: false },
      ],
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });
    engine.activateAbility(welcomeToNightCityRetailDexterDeshawnOffTheGrid, 1, { as: P1 });
    const dieId = engine.findGigIdByType(P1, "d6");
    const failure = engine.expectFailure(() => engine.resolveAdjustGig(dieId, 0, { as: P1 }));
    expect(failure.errorCode).toBe("VALUE_OUT_OF_RANGE");
    expect(engine.resolveAdjustGig(dieId, 2, { as: P1 }).success).toBe(true);
    expect(engine.getGigValue(P1)).toBe(2);
    expect(engine.getEvents("gigValueChanged")).toEqual([]);
    engine.expectNoPendingChoice();
  });

  it("still emits a value-change event for a nonzero up-to adjustment", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailDexterDeshawnOffTheGrid, faceDown: false, spent: false },
      ],
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });
    engine.activateAbility(welcomeToNightCityRetailDexterDeshawnOffTheGrid, 1, { as: P1 });
    const dieId = engine.findGigIdByType(P1, "d6");
    engine.resolveAdjustGig(dieId, 4, { as: P1 });
    expect(engine.getGigValue(P1)).toBe(4);
    expect(engine.getEvents("gigValueChanged")).toMatchObject([
      { dieId, previousValue: 2, newValue: 4 },
    ]);
  });

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
