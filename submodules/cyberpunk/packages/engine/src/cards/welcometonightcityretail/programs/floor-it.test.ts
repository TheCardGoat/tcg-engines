import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Floor It", () => {
  it("gives a rival Unit -1 power this turn and draws 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, playedThisTurn: false }],
      },
      { preserveDeckOrder: true },
    );
    const target = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P2);

    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });

    expect(getEffectivePower(engine.getState(), target.instanceId)).toBe(
      welcomeToNightCityRetailRidingNomad.power - 1,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
  });

  it("plays and resolves without a draw when no rival Unit can be targeted", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailFloorIt],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 1,
    });

    engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFloorIt.id,
    );
  });
});
