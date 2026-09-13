import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMuamarReyesElCapitaN,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const muamar = welcomeToNightCityRetailMuamarReyesElCapitaN;

describe("Muamar Reyes — El Capitán", () => {
  it("is a yellow Fixer legend", () => {
    expect(muamar).toMatchObject({
      type: "legend",
      color: "yellow",
      classifications: ["Fixer"],
      printNumber: "038",
    });
  });

  it("on Call can protect a friendly Unit from being defeated in a fight this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: muamar, faceDown: true }],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
    );

    engine.callLegend(muamar, { as: P1 });
    engine.resolveChooseEffect("protect", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectiveRules(engine.getState(), unit.instanceId as string)).toContain(
      "cantBeDefeatedInFight",
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailRidingNomad, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("on Call can draw 1 instead", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: muamar, faceDown: true }],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 2,
    });
    const handBefore = engine.getHandCount(P1);
    engine.callLegend(muamar, { as: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("spends to adjust a Gig by 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: muamar, faceDown: false, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });

    engine.activateAbility(muamar, 1, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Muamar still needs the Gig adjustment amount",
    });
    engine.resolveAdjustGig(4, { as: P1 });
    expect(engine.getCard(muamar, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getGigValue(P1)).toBe(4);
  });
});
