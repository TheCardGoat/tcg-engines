import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAllIsLost,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKiroshiOptics,
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
      reason: "River Ward still needs an attachment host for the chosen Gear",
    });
    engine.expectEffectTargetChoice(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, {
      as: P1,
      zone: "legendArea",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, { as: P1 });
    engine.expectNoPendingChoice();

    expect(
      engine.getCard(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, "legendArea", P1).meta
        .attachedGearIds,
    ).toHaveLength(1);
  });

  it("prompts for the Gear before the attachment host", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailKiroshiOptics, welcomeToNightCityRetailMantisBlades],
      field: [welcomeToNightCityRetailSwordwiseHuscle, welcomeToNightCityRetailFieldOperator],
      legendArea: [
        {
          card: welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
          faceDown: false,
          spent: false,
        },
      ],
    });

    engine.activateAbility(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, 1, { as: P1 });
    engine.expectEffectTargetChoice(welcomeToNightCityRetailKiroshiOptics, {
      as: P1,
      zone: "hand",
    });
    engine.expectEffectTargetChoice(welcomeToNightCityRetailMantisBlades, {
      as: P1,
      zone: "hand",
    });

    engine.resolveEffectTarget(welcomeToNightCityRetailMantisBlades, {
      as: P1,
      allowPendingChoice: true,
      reason: "River Ward still needs an attachment host for the chosen Gear",
    });

    engine.expectEffectTargetChoice(welcomeToNightCityRetailSwordwiseHuscle, {
      as: P1,
      zone: "field",
    });
    engine.expectEffectTargetChoice(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      zone: "field",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.expectAttachedGear(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailMantisBlades,
      {
        as: P1,
      },
    );
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
            hasLag: false,
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
            hasLag: false,
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
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("scry");
    expect(engine.getState().G.turnMetadata.pendingChoice?.chooserId).toBe(P1);
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("can resolve the private trash look without publicly revealing cards", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: false,
            hasLag: false,
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
            hasLag: false,
            powerModifier: 5,
          },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "scry",
      payload: {
        destinations: expect.arrayContaining([
          expect.objectContaining({ zone: "trash", min: 1, max: 1, reveal: false }),
        ]),
      },
    });
    if (!choice || choice.type !== "scry") throw new Error("Expected River Ward scry choice");
    const selectedCardId = choice.payload.revealedCardIds[0] as string;

    expect(engine.resolveScryTo("trash", [selectedCardId], { as: P1 })).toMatchObject({
      success: true,
    });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEvents("cardsRevealed")).toHaveLength(0);
  });

  it("does not publicly reveal cards chosen for River Ward's private trash look", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFieldOperator],
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: false,
            hasLag: false,
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
            hasLag: false,
            powerModifier: 5,
          },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "scry") throw new Error("Expected River Ward scry choice");
    const selectedCardId = choice.payload.revealedCardIds[0] as string;

    expect(engine.resolveScryTo("trash", [selectedCardId], { as: P1 })).toMatchObject({
      success: true,
    });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.instanceId)).toContain(
      selectedCardId,
    );
    expect(engine.getEvents("cardsRevealed")).toHaveLength(0);
    expect(
      engine.getEvents("actionLog").some((log) => log.messageKey === "move.resolveSearchDeckNamed"),
    ).toBe(false);
  });
});
