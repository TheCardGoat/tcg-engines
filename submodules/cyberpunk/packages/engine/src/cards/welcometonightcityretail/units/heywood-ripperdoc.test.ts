import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailHeywoodRipperdoc,
  welcomeToNightCityRetailMandibularUpgrade,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const heywood = welcomeToNightCityRetailHeywoodRipperdoc;

describe("Heywood Ripperdoc", () => {
  it("is a yellow Ripperdoc unit", () => {
    expect(heywood).toMatchObject({
      type: "unit",
      color: "yellow",
      classifications: ["Ripperdoc"],
      cost: 6,
      power: 8,
      printNumber: "047",
    });
  });

  it("enters the field from hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [heywood],
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
        },
      ],
      eddies: 6,
    });

    engine.playCard(heywood, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });
    }
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      heywood.id,
    );
  });

  it("does not draw when the defeated Gear cost does not match a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [heywood],
        field: [welcomeToNightCityRetailFieldOperator],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 6,
        gigArea: [{ dieType: "d6", faceValue: 6 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
      },
    );
    const handBefore = engine.getHandCount(P1);
    engine.playCard(heywood, { as: P1 });
    if (engine.getState().G.turnMetadata.pendingChoice?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });
    }
    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
  });

  it("can decline to defeat a Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [heywood],
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
        },
      ],
      eddies: 6,
    });

    engine.playCard(heywood, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type === "chooseTarget") {
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [], pass: true } }, P1);
    }
    expect(
      engine.getCardsInZone("field", P1).some((card) => card.definitionId === heywood.id),
    ).toBe(true);
  });
});
