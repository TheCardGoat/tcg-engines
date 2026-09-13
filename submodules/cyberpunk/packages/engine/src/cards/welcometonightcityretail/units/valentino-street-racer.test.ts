import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailNadiaFightingThroughGrief,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailValentinoStreetRacer,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Valentino Street Racer", () => {
  it("gives another friendly Unit with cost 5 or less Adrenaline this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailValentinoStreetRacer],
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: true }],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailValentinoStreetRacer, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    // The granted Adrenaline lets the Lagged Unit attack the turn it entered.
    engine.attackUnit(
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    expect(engine.getAttackState()?.defenderId).toBe(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("cannot target itself or a friendly Unit with cost 6 or more", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailValentinoStreetRacer],
      field: [
        { card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: true },
        { card: welcomeToNightCityRetailNadiaFightingThroughGrief, spent: false, hasLag: true },
      ],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailValentinoStreetRacer, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected Valentino Street Racer to ask for an effect target.");
    }

    const eligibleIds = choice.payload.eligibleIds;
    expect(eligibleIds).toContain(
      engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1),
    );
    expect(eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailNadiaFightingThroughGrief, "field", P1),
    );
    expect(eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailValentinoStreetRacer, "field", P1),
    );
  });

  it("granted Adrenaline expires at the end of the turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailValentinoStreetRacer],
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: true }],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailValentinoStreetRacer, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    engine.completeTurn({ as: P1 });

    // The granted Adrenaline is an end-of-turn ActiveEffect and is gone now.
    const huscle = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    expect(getEffectiveRules(engine.getState(), huscle.instanceId)).not.toContain("adrenaline");
  });
});
