import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGunpointDiplomacy,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower, getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const gunpoint = welcomeToNightCityRetailGunpointDiplomacy;

describe("Gunpoint Diplomacy", () => {
  it("is a red Ganger/Plan program", () => {
    expect(gunpoint).toMatchObject({
      type: "program",
      color: "red",
      classifications: ["Ganger", "Plan"],
      cost: 4,
      printNumber: "032",
    });
  });

  it("gives a friendly Unit both effects when you do not have less Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [gunpoint],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 4,
        gigArea: [{ dieType: "d10", faceValue: 8 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.playCard(gunpoint, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectivePower(engine.getState(), unit.instanceId as string)).toBe(
      (welcomeToNightCityRetailFieldOperator.power ?? 0) + 3,
    );
    expect(getEffectiveRules(engine.getState(), unit.instanceId as string)).toContain(
      "canAttackReadyUnits",
    );
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailFieldOperator,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ).success,
    ).toBe(true);
    expect(getEffectiveRules(engine.getState(), unit.instanceId as string)).not.toContain(
      "canAttackReadyUnits",
    );
  });

  it("lets the Rival choose one effect when you have less Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [gunpoint],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [{ dieType: "d10", faceValue: 9 }],
      },
    );

    engine.playCard(gunpoint, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      allowPendingChoice: true,
      reason: "Rival still chooses which Gunpoint Diplomacy effect applies",
    });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseEffect");
    expect(choice?.chooserId).toBe(P2);
    if (choice?.type === "chooseEffect") {
      expect(choice.payload.options.map((option) => option.id).sort()).toEqual([
        "plus-power",
        "ready-attack",
      ]);
    }

    const failure = engine.expectFailure(() =>
      engine.resolveChooseEffect("plus-power", { as: P1 }),
    );
    expect(failure.errorCode).toBe("NOT_YOUR_CHOICE");

    engine.resolveChooseEffect("plus-power", { as: P2 });
    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectivePower(engine.getState(), unit.instanceId as string)).toBe(
      (welcomeToNightCityRetailFieldOperator.power ?? 0) + 3,
    );
    expect(getEffectiveRules(engine.getState(), unit.instanceId as string)).not.toContain(
      "canAttackReadyUnits",
    );
  });
});
