import { describe, expect, it } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("River Ward - Detective on the Hunt", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt);
  });

  it("can equip a cheap Gear from hand to a friendly face-up Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailZetatechFaceplate],
      legendArea: [
        {
          card: welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
          faceDown: false,
          spent: false,
        },
      ],
    });

    engine.activateAbility(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, 1, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailZetatechFaceplate, { as: P1 });
    engine.resolveCardToPlay(welcomeToNightCityRetailZetatechFaceplate, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, "legendArea", P1).meta
        .attachedGearIds,
    ).toHaveLength(1);
  });

  it("triggers from an equipped friendly Unit using the defeated event-time attached state", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [alphaRuthlessLowlife, alphaRuthlessLowlife],
        field: [
          {
            card: alphaRuthlessLowlife,
            spent: false,
            playedThisTurn: false,
            attachedGears: [alphaKiroshiOptics],
          },
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
            faceDown: false,
            spent: false,
          },
        ],
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: true, playedThisTurn: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(alphaRuthlessLowlife, alphaSwordwiseHuscle, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaRuthlessLowlife.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaKiroshiOptics.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("searchDeck");
    expect(engine.getState().G.turnMetadata.pendingChoice?.chooserId).toBe(P1);
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      alphaSwordwiseHuscle.id,
    );
  });
});
