import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectPendingChoice } from "../../../testing/index.ts";

const maman = welcomeToNightCityRetailMamanBrigitteSpiritOfDeath;

describe("Maman Brigitte", () => {
  it("is the exact blue 5-cost 3-power Mystic/Netrunner/Voodoo Boys Unit", () => {
    expect(maman).toMatchObject({
      type: "unit",
      color: "blue",
      classifications: ["Mystic", "Netrunner", "Voodoo Boys"],
      printNumber: "118",
      cost: 5,
      power: 3,
      ram: 4,
      hasSellTag: false,
      timingTriggers: ["play"],
      abilities: [
        expect.objectContaining({
          trigger: { trigger: "play" },
          effects: [
            expect.objectContaining({
              effect: "ifYouDo",
              doEffect: expect.objectContaining({
                effect: "discardFromHand",
                player: "friendly",
                amount: 2,
                optional: true,
                target: expect.objectContaining({
                  controller: "friendly",
                  zones: ["hand"],
                  cardTypes: ["program"],
                }),
              }),
              ifEffects: [
                expect.objectContaining({
                  effect: "moveCard",
                  destination: "deckBottom",
                  target: expect.objectContaining({
                    controller: "rival",
                    zones: ["field"],
                    cardTypes: ["unit"],
                    hasAttachedCards: false,
                    selection: { mode: "choose", min: 1, max: 1 },
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    });
  });

  it("offers exactly two friendly Programs and rejects an incomplete discard", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          maman,
          welcomeToNightCityRetailCorporateSurveillance,
          welcomeToNightCityRetailFloorIt,
          welcomeToNightCityRetailRebootOptics,
          welcomeToNightCityRetailFieldOperator,
        ],
        eddies: 5,
      },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );
    const surveillance = engine.getCard(welcomeToNightCityRetailCorporateSurveillance, "hand", P1);
    const floorIt = engine.getCard(welcomeToNightCityRetailFloorIt, "hand", P1);
    const reboot = engine.getCard(welcomeToNightCityRetailRebootOptics, "hand", P1);
    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "hand", P1);

    engine.playCard(maman, { as: P1 });

    const discard = expectPendingChoice(engine, "chooseTarget");
    expect(discard).toMatchObject({
      chooserId: P1,
      payload: {
        type: "discardFromHand",
        amount: 2,
        canDecline: true,
        eligibleIds: expect.arrayContaining([
          surveillance.instanceId,
          floorIt.instanceId,
          reboot.instanceId,
        ]),
      },
    });
    if (discard.payload.type !== "discardFromHand") {
      throw new Error("Expected the optional Program discard choice.");
    }
    expect(discard.payload.eligibleIds).not.toContain(unit.instanceId);
    expect(
      engine.executeMove(
        "resolveDiscardFromHand",
        { args: { cardIds: [surveillance.instanceId] } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "INVALID_AMOUNT" });

    engine.resolveDiscardFromHand(
      [welcomeToNightCityRetailCorporateSurveillance, welcomeToNightCityRetailFloorIt],
      { as: P1 },
    );

    const target = expectPendingChoice(engine, "chooseTarget");
    expect(target.payload).toMatchObject({
      type: "effectTarget",
      min: 1,
      max: 1,
    });
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailRebootOptics.id,
        welcomeToNightCityRetailFieldOperator.id,
      ]),
    );
  });

  it("requires discarding two Programs before bottom-decking an unequipped rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          maman,
          welcomeToNightCityRetailCorporateSurveillance,
          welcomeToNightCityRetailFloorIt,
        ],
        field: [welcomeToNightCityRetailFieldOperator],
        eddies: 5,
      },
      {
        field: [
          welcomeToNightCityRetailCorpoSecurity,
          {
            card: welcomeToNightCityRetailFieldOperator,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
        deck: [welcomeToNightCityRetailRebootOptics],
      },
      { preserveDeckOrder: true },
    );
    const friendlyUnit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    const rivalUnequipped = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2);
    const rivalEquipped = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);

    engine.playCard(maman, { as: P1 });

    engine.resolveDiscardFromHand(
      [welcomeToNightCityRetailCorporateSurveillance, welcomeToNightCityRetailFloorIt],
      { as: P1 },
    );
    const target = expectPendingChoice(engine, "chooseTarget");
    expect(target.payload.eligibleIds).toEqual([rivalUnequipped.instanceId]);
    expect(target.payload.eligibleIds).not.toEqual(
      expect.arrayContaining([friendlyUnit.instanceId, rivalEquipped.instanceId]),
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorporateSurveillance.id,
      welcomeToNightCityRetailFloorIt.id,
    ]);
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("deck", P2).at(-1)?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("may decline the two-Program discard and leaves every Program in hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          maman,
          welcomeToNightCityRetailCorporateSurveillance,
          welcomeToNightCityRetailFloorIt,
        ],
        eddies: 5,
      },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );

    engine.playCard(maman, { as: P1 });
    engine.executeMove("resolveDiscardFromHand", { args: { pass: true } }, P1);

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorporateSurveillance.id,
        welcomeToNightCityRetailFloorIt.id,
      ]),
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("opens no discard when fewer than two Programs are available", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [maman, welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailFieldOperator],
        eddies: 5,
      },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );

    engine.playCard(maman, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailFloorIt.id,
        welcomeToNightCityRetailFieldOperator.id,
      ]),
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("may discard two Programs even when no rival unequipped Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          maman,
          welcomeToNightCityRetailCorporateSurveillance,
          welcomeToNightCityRetailFloorIt,
        ],
        eddies: 5,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
      },
    );

    engine.playCard(maman, { as: P1 });
    engine.resolveDiscardFromHand(
      [welcomeToNightCityRetailCorporateSurveillance, welcomeToNightCityRetailFloorIt],
      { as: P1 },
    );

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorporateSurveillance.id,
        welcomeToNightCityRetailFloorIt.id,
      ]),
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });
});
