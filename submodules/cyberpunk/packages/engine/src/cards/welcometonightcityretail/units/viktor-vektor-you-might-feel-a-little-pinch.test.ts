import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailTakeControl,
  welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Viktor Vektor - You Might Feel a Little Pinch", () => {
  it("equips a cheap Cyberware Gear from trash to another friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      field: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailSecondhandBombus],
      trash: [welcomeToNightCityRetailMandibularUpgrade],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });
    engine.expectEffectTargetChoice(welcomeToNightCityRetailMandibularUpgrade, {
      as: P1,
      zone: "trash",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, {
      as: P1,
      allowPendingChoice: true,
      reason: "Viktor still needs a friendly Unit to host the chosen Gear",
    });
    engine.expectEffectTargetChoice(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      zone: "field",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.expectAttachedGear(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailMandibularUpgrade,
      {
        as: P1,
      },
    );
  });

  it("does not prompt when trash has no cheap Cyberware Gear", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      field: [welcomeToNightCityRetailFieldOperator],
      trash: [welcomeToNightCityRetailDyingNightVSPistol, welcomeToNightCityRetailTakeControl],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("does not prompt when a cheap Cyberware Gear has no valid host Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      trash: [welcomeToNightCityRetailMandibularUpgrade],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMandibularUpgrade.id,
    );
  });

  it("does not prompt when neither a cheap Cyberware Gear nor a host Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      trash: [welcomeToNightCityRetailTakeControl],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
