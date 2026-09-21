import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDeadmanTransmitter,
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
  it("has the exact printed identity, Quick Spend attachment, and equipped-defeat search", () => {
    expect(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt).toMatchObject({
      canonicalId: "river-ward-detective-on-the-hunt",
      slug: "river-ward-detective-on-the-hunt",
      name: "River Ward",
      subname: "Detective on the Hunt",
      displayName: "River Ward: Detective on the Hunt",
      type: "legend",
      color: "yellow",
      classifications: ["NCPD"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "039",
      rarity: "Rare",
      keywords: ["quick"],
      rulesText:
        "{Quick} {Spend} Play a Gear with cost 2 or less from your hand for free.\nWhen a friendly equipped Unit is defeated, search the top 2 cards of your deck and trash 1.",
      abilities: [
        { kind: "keyword", keyword: "quick" },
        {
          kind: "triggered",
          trigger: { trigger: "activated" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedGear",
              target: {
                controller: "friendly",
                zones: ["hand"],
                cardTypes: ["gear"],
                maxCost: 2,
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
            {
              id: "selectedUnit",
              target: {
                controller: "friendly",
                zones: ["field", "legendArea"],
                cardTypes: ["unit", "legend"],
                face: "faceUp",
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
          costs: [{ cost: "spend", target: { selector: "self" } }],
          effects: [{ effect: "attachCard", free: true }],
        },
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: {
              event: "cardDefeated",
              player: "friendly",
              target: { controller: "friendly", cardTypes: ["unit"], hasAttachedCards: true },
            },
          },
          effects: [
            {
              effect: "scry",
              player: "friendly",
              amount: 2,
              destinations: [
                { zone: "trash", min: 1, max: 1, reveal: false },
                { zone: "deckTop", remainder: true, order: "original" },
              ],
            },
          ],
        },
      ],
    });
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

  it("uses Quick to attach a cheap Gear for free during the Rival's React Step", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailZetatechFaceplate],
        field: [welcomeToNightCityRetailFieldOperator],
        legendArea: [
          {
            card: welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 0,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });

    engine.activateAbility(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, 1, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailZetatechFaceplate, {
      as: P1,
      allowPendingChoice: true,
      reason: "River still needs the attachment host",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    engine.expectAttachedGear(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailZetatechFaceplate,
      { as: P1 },
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailRiverWardDetectiveOnTheHunt, "legendArea", P1).meta
        .spent,
    ).toBe(true);
  });

  it("is not activatable when no cheap Gear can be played from hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailDeadmanTransmitter],
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
    const pendingChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(pendingChoice?.type).toBe("scry");
    expect(pendingChoice?.chooserId).toBe(P1);
    if (pendingChoice?.type === "scry") {
      expect(pendingChoice.payload.revealedCardIds).toHaveLength(2);
    }
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
