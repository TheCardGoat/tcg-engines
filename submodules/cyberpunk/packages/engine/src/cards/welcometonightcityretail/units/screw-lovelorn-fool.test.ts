import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailScrewLovelornFool,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Screw - Lovelorn Fool", () => {
  it("adds another Unit from trash to hand when defeated", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailScrewLovelornFool,
            spent: false,
            hasLag: false,
          },
        ],
        trash: [welcomeToNightCityRetailMoxInciters],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 5 }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailScrewLovelornFool,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMoxInciters, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailScrewLovelornFool.id,
    );
  });

  it("does not offer itself as the Unit returned from trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailScrewLovelornFool,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 5 }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailScrewLovelornFool,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailScrewLovelornFool.id,
    );
  });
});
