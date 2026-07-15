import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  expectEligibleTargets,
  expectNoPendingChoice,
} from "../../../testing/index.ts";

describe("Lizzy Wizzy - Delicate Weapon", () => {
  it("plays a cheap Program from hand for free and bottom-decks it at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
        welcomeToNightCityRetailRebootOptics,
      ],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });
    expectEligibleTargets(engine, [welcomeToNightCityRetailRebootOptics], {
      as: P1,
      zone: "hand",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailRebootOptics, { as: P1 });
    expectNoPendingChoice(engine);

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
  });

  it("can decline the optional Program selection without opening a follow-up play choice", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
        welcomeToNightCityRetailRebootOptics,
      ],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });
    engine.resolveEffectTargetIds([], { as: P1 });

    expectNoPendingChoice(engine);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
  });

  it("resolves cleanly when there is no cheap Program in hand or trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
        welcomeToNightCityRetailCorpoSecurity,
      ],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });
    engine.resolveEffectTargetIds([], { as: P1 });

    expectNoPendingChoice(engine);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
