import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";

describe("Sasha Yakovleva - Won't Let You Down", () => {
  it("goes solo as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, faceDown: false }],
      eddies: 5,
    });
    const sashaId = engine.findCardId(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: sashaId as string } }, P1);

    expect(result.success).toBe(true);
    expectAttackCandidate(engine, welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, {
      as: P1,
    });
  });

  it("reveals and adds the top deck card when attacking, then gains power equal to its cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
            faceDown: false,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      { preserveDeckOrder: true },
    );
    const sashaId = engine.findCardId(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "field",
      P1,
    );

    engine.attackRival(welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getEvents("cardsRevealed")).toHaveLength(1);
    expect(getEffectivePower(engine.getState(), sashaId)).toBe(
      welcomeToNightCityRetailCorpoSecurity.cost,
    );
  });

  it("makes the rival discard 1 when defeated", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailFieldOperator],
        field: [
          {
            card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
            faceDown: false,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        hand: [welcomeToNightCityRetailDyingNightVSPistol],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 5 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDyingNightVSPistol.id,
    );
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);
  });
});
