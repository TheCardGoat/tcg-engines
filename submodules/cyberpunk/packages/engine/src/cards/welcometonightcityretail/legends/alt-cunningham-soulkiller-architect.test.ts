import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAllIsLost,
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Alt Cunningham - Soulkiller Architect", () => {
  it("spends to discount the next friendly Program by friendly min Gigs, to a minimum of 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailChromeReverie],
      legendArea: [
        {
          card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
          faceDown: false,
          spent: false,
        },
      ],
      gigArea: [
        { dieType: "d4", faceValue: 1 },
        { dieType: "d6", faceValue: 1 },
      ],
    });
    const programId = engine.findCardId(welcomeToNightCityRetailChromeReverie, "hand", P1);

    expect(computeEffectiveCost(engine.getState(), programId, P1)).toBe(
      welcomeToNightCityRetailChromeReverie.cost,
    );

    engine.activateAbility(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, 0, {
      as: P1,
    });

    expect(computeEffectiveCost(engine.getState(), programId, P1)).toBe(1);
    expect(
      engine.getCard(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, "legendArea", P1)
        .meta.spent,
    ).toBe(true);
  });

  it("plays a Program from trash, resolves it, and bottom-decks it at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailFieldOperator,
        ],
        trash: [welcomeToNightCityRetailAllIsLost],
        legendArea: [
          {
            card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 2,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.activateAbility(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, 1, {
      as: P1,
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailAllIsLost, {
      as: P1,
      allowPendingChoice: true,
      reason: "Alt still needs confirmation to play the selected Program from trash",
    });
    engine.resolveCardToPlay(welcomeToNightCityRetailAllIsLost, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailAllIsLost.id,
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getCardsInZone("deck", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailAllIsLost.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailAllIsLost.id,
    );
  });

  it("does not activate the trash-play ability with no Program in trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      trash: [welcomeToNightCityRetailCorpoSecurity],
      legendArea: [
        {
          card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 1,
    });

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, 1, {
        as: P1,
      }),
    );

    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(
      engine.getCard(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, "legendArea", P1)
        .meta.spent,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
  });
});
