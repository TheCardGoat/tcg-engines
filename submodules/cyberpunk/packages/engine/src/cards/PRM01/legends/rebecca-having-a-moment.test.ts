import { describe, expect, it } from "vite-plus/test";
import { prm01RebeccaHavingAMoment } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Rebecca - Having a Moment", () => {
  it("is the exact textless red Nova Rare promo Legend", () => {
    expect(prm01RebeccaHavingAMoment).toMatchObject({
      canonicalId: "rebecca-having-a-moment",
      slug: "rebecca-having-a-moment",
      name: "Rebecca",
      subname: "Having a Moment",
      displayName: "Rebecca: Having a Moment",
      type: "legend",
      color: "red",
      classifications: [],
      cost: null,
      power: null,
      ram: null,
      hasSellTag: false,
      printNumber: "005",
      rarity: "Nova Rare",
      imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/PRM01/005.webp",
      selectedPrintingId: "71a35836-e604-4d98-ab56-58bfb4581033",
      printings: [
        {
          id: "71a35836-e604-4d98-ab56-58bfb4581033",
          collectorNumber: "005",
          setCode: "PRM01",
        },
        {
          id: "f625d2ac-3007-48f4-82b3-b521fc11a172",
          collectorNumber: "007",
          setCode: "PRM01",
        },
      ],
      keywords: [],
      abilities: [],
      timingTriggers: [],
    });
    expect("rulesText" in prm01RebeccaHavingAMoment).toBe(false);
    expect("flavorText" in prm01RebeccaHavingAMoment).toBe(false);
  });

  it("calls for exactly 1 Eddie and exposes no card-specific action", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: prm01RebeccaHavingAMoment, faceDown: true }],
      eddies: 1,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.callLegend(prm01RebeccaHavingAMoment, { as: P1 });

    expect(engine.getCard(prm01RebeccaHavingAMoment, "legendArea", P1).meta.faceDown).toBe(false);
    expect(engine.getEddies(P1)).toBe(0);
    const activateAbility = engine
      .getPrompt(P1)
      .availableMoves.find((move) => move.moveId === "activateAbility");
    expect(
      activateAbility?.inputSpec.type === "selectAbility"
        ? activateAbility.inputSpec.candidates
        : [],
    ).toHaveLength(0);
    expect(engine.getPrompt(P1).availableMoves.map((move) => move.moveId)).not.toContain("goSolo");
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("cannot be called without the generic 1-Eddie Call cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: prm01RebeccaHavingAMoment, faceDown: true }],
      eddies: 0,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    const result = engine.expectFailure(() =>
      engine.callLegend(prm01RebeccaHavingAMoment, { as: P1 }),
    );

    expect(result.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getCard(prm01RebeccaHavingAMoment, "legendArea", P1).meta.faceDown).toBe(true);
  });
});
