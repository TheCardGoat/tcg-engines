import { describe, expect, it } from "vite-plus/test";
import type { PreventGigStealPendingChoice } from "../../../types/match-state.ts";
import {
  welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
  welcomeToNightCityRetailBonnieAndClyde,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import { getEffectivePower } from "../../../active-effects/index.ts";

describe("Alt Cunningham — Mother of Daemons", () => {
  /**
   * Oracle: "equipped" means a Unit or Legend with Gear attached (CR 4.13),
   * and spending turns that ready card sideways (CR 2.9). The first ability
   * triggers only for the controller's equipped Unit or Legend and draws the
   * top card (CR 10.16.1, 11.5.1). The second ability is an optional
   * replacement before a rival Unit steals: discard exactly one hand card
   * whose printed cost equals that Gig's current value, then do not move that
   * Gig (CR 10.4, 10.10, 10.11).
   */
  it("costs exactly 7 to play and has 8 base power", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAltCunninghamMotherOfDaemons],
      eddies: 7,
    });

    engine.playCard(welcomeToNightCityRetailAltCunninghamMotherOfDaemons, { as: P1 });

    const alt = engine.getCard(welcomeToNightCityRetailAltCunninghamMotherOfDaemons, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(getEffectivePower(engine.getState(), alt.instanceId)).toBe(8);
  });

  it("draws exactly 1 when a friendly equipped Unit is spent to attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            spent: true,
            hasLag: false,
          },
        ],
      },
      { preserveDeckOrder: true },
    );
    const deckBefore = engine.getCardsInZone("deck", P1).length;

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckBefore - 1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("draws exactly 1 when an equipped face-up Legend is spent for payment", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSwordwiseHuscle],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [welcomeToNightCityRetailAltCunninghamMotherOfDaemons],
        legendArea: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            faceDown: false,
            spent: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
        eddies: 2,
      },
      {},
      { preserveDeckOrder: true },
    );
    const deckBefore = engine.getCardsInZone("deck", P1).length;

    engine.playCard(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "legendArea", P1).meta
        .spent,
    ).toBe(true);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckBefore - 1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not draw when the friendly Unit being spent is not equipped", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailCorpoSecurity,
            spent: true,
            hasLag: false,
          },
        ],
      },
      { preserveDeckOrder: true },
    );
    const deckBefore = engine.getCardsInZone("deck", P1).length;

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckBefore);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });

  it("prevents a gig theft by discarding a card whose cost equals the Gig's value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        eddies: 4,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
            spent: false,
            hasLag: false,
          },
        ],
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    // P1's Delamain Cab attacks P2 directly and would steal the d6 (value 3).
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice as
      | PreventGigStealPendingChoice
      | undefined;
    expect(choice?.type).toBe("preventGigSteal");
    expect(choice?.chooserId).toBe(P2);
    expect(choice?.payload.stealEntries[0]?.value).toBe(3);
    expect(choice?.payload.handEntries.map((entry) => entry.cost)).toEqual([3]);

    const dieId = choice!.payload.stealEntries[0]!.dieId as string;
    const cardId = choice!.payload.handEntries.find((entry) => entry.cost === 3)!.cardId as string;

    // P2 discards Bonnie and Clyde (cost 3) to keep the value-3 Gig.
    engine.resolvePreventGigSteal([{ dieId, cardId }], { as: P2 });

    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d6");
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailBonnieAndClyde.id,
    );
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
    engine.expectNoPendingChoice();
  });

  it("rejects a mismatched discard without mutating the hand or Gig, then accepts the match", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        eddies: 4,
      },
      {
        field: [welcomeToNightCityRetailAltCunninghamMotherOfDaemons],
        hand: [welcomeToNightCityRetailBonnieAndClyde, welcomeToNightCityRetailKiroshiOptics],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "preventGigSteal") {
      throw new Error("Expected Alt's Gig-steal prevention choice");
    }
    const dieId = choice.payload.stealEntries[0]!.dieId as string;
    const matchingCardId = choice.payload.handEntries.find((entry) => entry.cost === 3)!
      .cardId as string;
    const mismatchedCardId = choice.payload.handEntries.find((entry) => entry.cost === 1)!
      .cardId as string;

    expect(
      engine.executeMove(
        "resolvePreventGigSteal",
        { args: { preventions: [{ dieId, cardId: mismatchedCardId }] } },
        P2,
      ),
    ).toMatchObject({ success: false, errorCode: "COST_MISMATCH" });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("preventGigSteal");
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(2);
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d6");
    expect(engine.getEvents("gigStolen")).toHaveLength(0);

    engine.resolvePreventGigSteal([{ dieId, cardId: matchingCardId }], { as: P2 });
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(1);
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d6");
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
  });

  it("does not interrupt the theft when no hand card has cost equal to the Gig value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        eddies: 4,
      },
      {
        field: [welcomeToNightCityRetailAltCunninghamMotherOfDaemons],
        hand: [welcomeToNightCityRetailKiroshiOptics],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d6");
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(1);
    expect(engine.getEvents("gigStolen")).toHaveLength(1);
  });

  it("lets the theft resolve when prevention is declined", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        eddies: 4,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
            spent: false,
            hasLag: false,
          },
        ],
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.declinePreventGigSteal({ as: P2 });

    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d6");
  });
});
