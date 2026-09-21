import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMaelstromGoons,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const goons = welcomeToNightCityRetailMaelstromGoons;

describe("Maelstrom Goons", () => {
  it("is the exact yellow 3-cost 3-power Ganger/Maelstrom Unit with its self-steal trigger", () => {
    expect(goons).toMatchObject({
      type: "unit",
      color: "yellow",
      classifications: ["Ganger", "Maelstrom"],
      cost: 3,
      power: 3,
      ram: 2,
      hasSellTag: false,
      printNumber: "049",
      abilities: [
        expect.objectContaining({
          trigger: {
            trigger: "event",
            event: expect.objectContaining({
              event: "gigStolen",
              player: "friendly",
              minAmount: 1,
              source: { selector: "self" },
            }),
          },
          effects: [
            expect.objectContaining({
              effect: "discardFromHand",
              player: "rival",
              amount: 1,
              conditions: [
                expect.objectContaining({
                  condition: "targetExists",
                  target: expect.objectContaining({
                    cardTypes: ["gear"],
                    attachedTo: { selector: "self" },
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    });
  });

  it("makes a Rival discard 1 when it steals a Gig while equipped", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: goons,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        hand: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.attackRival(goons, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);
  });

  it("makes the Rival choose exactly one of multiple cards to discard", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: goons,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        hand: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      },
    );
    const corpoSecurity = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "hand", P2);
    const fieldOperator = engine.getCard(welcomeToNightCityRetailFieldOperator, "hand", P2);

    engine.attackRival(goons, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      chooserId: P2,
      payload: {
        type: "discardFromHand",
        amount: 1,
        eligibleIds: expect.arrayContaining([corpoSecurity.instanceId, fieldOperator.instanceId]),
      },
    });
    expect(
      engine.executeMove(
        "resolveDiscardFromHand",
        { args: { cardIds: [corpoSecurity.instanceId] } },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "NOT_YOUR_CHOICE" });

    engine.resolveDiscardFromHand([welcomeToNightCityRetailCorpoSecurity], { as: P2 });

    expect(engine.getCardsInZone("hand", P2).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailFieldOperator.id,
    ]);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not discard when it steals a Gig unequipped", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: goons, spent: false, hasLag: false }],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        hand: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.attackRival(goons, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getCardsInZone("hand", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not trigger when a different friendly Unit steals a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: goons,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
          { card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false },
        ],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        hand: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      },
    );

    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P2).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailFieldOperator.id,
    ]);
  });

  it("resolves without a discard choice when the Rival's hand is empty", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: goons,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMandibularUpgrade],
          },
        ],
      },
      { gigArea: [{ dieType: "d6", faceValue: 3 }], hand: [] },
    );

    engine.attackRival(goons, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);
    expect(engine.getGigCount(P1)).toBe(1);
  });
});
