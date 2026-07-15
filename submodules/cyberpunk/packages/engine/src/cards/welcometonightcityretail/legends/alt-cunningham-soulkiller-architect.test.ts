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
import { CyberpunkTestEngine, P1, expectNoPendingChoice } from "../../../testing/index.ts";

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

  it("plays a Program from trash, resolves it, and bottom-decks it after the Program resolves", () => {
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
        eddies: 4,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.activateAbility(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, 1, {
      as: P1,
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailAllIsLost, {
      as: P1,
      zone: "trash",
      allowPendingChoice: true,
      reason: "the selected trash Program must still be confirmed for paid play",
    });
    engine.resolveCardToPlay(welcomeToNightCityRetailAllIsLost, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1, zone: "trash" });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );

    expectNoPendingChoice(engine);

    const deckAfterResolution = engine.getCardsInZone("deck", P1).map((card) => card.definitionId);
    expect(deckAfterResolution.at(-1)).toBe(welcomeToNightCityRetailAllIsLost.id);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailAllIsLost.id,
    );
  });

  it("bottom-decks the played Program even when that Program has no valid target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        trash: [welcomeToNightCityRetailChromeReverie],
        legendArea: [
          {
            card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 4,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.activateAbility(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, 1, {
      as: P1,
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailChromeReverie, {
      as: P1,
      zone: "trash",
      allowPendingChoice: true,
      reason: "the selected trash Program must still be confirmed for paid play",
    });
    engine.resolveCardToPlay(welcomeToNightCityRetailChromeReverie, { as: P1 });

    expectNoPendingChoice(engine);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailChromeReverie.id,
    );
    expect(
      engine
        .getCardsInZone("deck", P1)
        .map((card) => card.definitionId)
        .at(-1),
    ).toBe(welcomeToNightCityRetailChromeReverie.id);
  });

  it("does not activate the trash-play ability when no Program can be paid after the activation cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      trash: [welcomeToNightCityRetailChromeReverie],
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
    expect(engine.getCard(welcomeToNightCityRetailChromeReverie, "trash", P1).zone).toBe("trash");
    expect(engine.getEddies(P1)).toBe(1);
    expect(
      engine.getCard(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, "legendArea", P1)
        .meta.spent,
    ).toBe(false);
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
