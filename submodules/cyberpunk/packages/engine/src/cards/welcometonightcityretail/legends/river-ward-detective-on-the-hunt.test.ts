import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAllIsLost,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("River Ward - Detective on the Hunt", () => {
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
    engine.expectEffectTargetChoice(welcomeToNightCityRetailZetatechFaceplate, {
      as: P1,
      zone: "hand",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailZetatechFaceplate, {
      as: P1,
      allowPendingChoice: true,
      reason: "River still needs the chosen Gear to be confirmed for play",
    });
    engine.resolveCardToPlay(welcomeToNightCityRetailZetatechFaceplate, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, "legendArea", P1).meta
        .attachedGearIds,
    ).toHaveLength(1);
  });

  it("is not activatable when no cheap Gear can be played from hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAllIsLost],
      legendArea: [
        {
          card: welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
          faceDown: false,
          spent: false,
        },
      ],
    });

    const prompt = engine.getPrompt(P1);
    const activateAbility = prompt.availableMoves.find((move) => move.moveId === "activateAbility");
    const candidates =
      activateAbility?.inputSpec.type === "selectAbility"
        ? activateAbility.inputSpec.candidates
        : [];
    expect(candidates.some((candidate) => candidate.abilityIndex === 1)).toBe(false);

    const river = engine.getCard(
      welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
      "legendArea",
      P1,
    );
    expect(
      engine.executeMove(
        "activateAbility",
        { args: { cardId: river.instanceId as string, abilityIndex: 1 } },
        P1,
      ),
    ).toMatchObject({
      success: false,
      errorCode: "NO_VALID_TARGETS",
    });
    expect(river.meta.spent).toBe(false);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("triggers from an equipped friendly Unit using the defeated event-time attached state", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFieldOperator],
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: false,
            playedThisTurn: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
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
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            spent: true,
            playedThisTurn: false,
            powerModifier: 5,
          },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMantisBlades.id,
    );
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("searchDeck");
    expect(engine.getState().G.turnMetadata.pendingChoice?.chooserId).toBe(P1);
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
