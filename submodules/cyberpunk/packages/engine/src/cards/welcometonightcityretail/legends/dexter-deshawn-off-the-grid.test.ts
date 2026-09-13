import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDexterDeshawnOffTheGrid,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const dexter = welcomeToNightCityRetailDexterDeshawnOffTheGrid;

describe("Dexter DeShawn — Off the Grid", () => {
  it("is a red Fixer legend with a Call modal and a Spend gig increase", () => {
    expect(dexter).toMatchObject({
      type: "legend",
      color: "red",
      classifications: ["Fixer"],
      printNumber: "002",
    });
    expect(dexter.abilities[0]?.trigger).toMatchObject({ trigger: "call" });
    expect(dexter.abilities[0]?.effects[0]?.effect).toBe("chooseEffect");
    expect(dexter.abilities[1]?.trigger).toMatchObject({ trigger: "activated" });
  });

  it("on Call lets you give a friendly Unit +2 power this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: dexter, faceDown: true }],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      eddies: 2,
    });

    engine.callLegend(dexter, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseEffect");
    engine.resolveChooseEffect("buff", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectivePower(engine.getState(), unit.instanceId as string)).toBe(
      (welcomeToNightCityRetailFieldOperator.power ?? 0) + 2,
    );
  });

  it("on Call lets you draw 1 instead", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: dexter, faceDown: true }],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 2,
    });
    const handBefore = engine.getHandCount(P1);

    engine.callLegend(dexter, { as: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("spends to increase a Gig by up to 2", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: dexter, faceDown: false, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });

    engine.activateAbility(dexter, 1, { as: P1 });
    const gigId = engine.findGigIdByType(P1, "d6");
    engine.resolveEffectTargetIds([gigId], {
      as: P1,
      allowPendingChoice: true,
      reason: "Dexter still needs the Gig increase amount",
    });
    engine.resolveAdjustGig(4, { as: P1 });
    expect(engine.getCard(dexter, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getGigValue(P1)).toBe(4);
  });

  it("cannot spend while already spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: dexter, faceDown: false }],
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });
    engine.judgeSpendCard(dexter, { as: P1 });

    const failure = engine.expectFailure(() => engine.activateAbility(dexter, 1, { as: P1 }));
    expect(failure.errorCode).toBe("CARD_SPENT");
  });

  it("does not buff a rival Unit from the Call power option", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: dexter, faceDown: true }],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    engine.callLegend(dexter, { as: P1 });
    engine.resolveChooseEffect("buff", { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type === "chooseTarget") {
      expect(choice.payload.eligibleIds).not.toContain(
        engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
      );
    }
  });
});
