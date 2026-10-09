import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAppetiteForDestruction,
  welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
  welcomeToNightCityRetailBonnieAndClyde,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
  welcomeToNightCityRetailPlacideVoodooSentinel,
  welcomeToNightCityRetailTheRelicExperimentalBiochip,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../testing/index.ts";

describe("Appetite for Destruction", () => {
  it("lets a defending winner steal after the Program is played during the rival turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAppetiteForDestruction],
        trash: [welcomeToNightCityRetailLizzyWizzyDelicateWeapon],
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
          },
          { card: welcomeToNightCityRetailOffdutyMalfini, spent: true, hasLag: false },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
      { activePlayerId: P2 },
    );
    const gigId = engine.findGigIdByType(P2, "d6");
    engine.attackUnit(
      welcomeToNightCityRetailPlacideVoodooSentinel,
      welcomeToNightCityRetailFieldOperator,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });
    engine.resolveEffectTarget(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, {
      as: P1,
      allowPendingChoice: true,
      reason: "Lizzy may play Appetite after The Relic plays her",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailAppetiteForDestruction, {
      as: P1,
    });
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailLizzyWizzyDelicateWeapon.id,
    );

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailOffdutyMalfini,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });
    const choice = engine.getPrompt(P1).choice;
    expect(choice).toMatchObject({ type: "chooseTarget", chooserId: P1 });
    engine.resolveEffectTargetIds([gigId], { as: P1 });
    engine.resolveFullFight({ as: P2 });
    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(gigId);
    expect(engine.getGigDice(P2).map((die) => die.id)).not.toContain(gigId);
  });
  /**
   * Oracle: after the 3-cost Program resolves and is discarded, it creates a
   * one-use effect lasting this turn. The first friendly attacking Unit whose
   * fight margin is at least 3 becomes the actor for exactly one chosen rival
   * Gig; lower margins do not consume it, and end of turn expires it (CR 6.7,
   * 9.19, 10.2, 10.23). Normal Gig-steal prevention still applies.
   */
  it("offers Alt Cunningham's prevention against the fight-win Gig steal", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAppetiteForDestruction],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        eddies: 3,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
          { card: welcomeToNightCityRetailAltCunninghamMotherOfDaemons, spent: false },
        ],
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailAppetiteForDestruction, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    const stealChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(stealChoice?.type).toBe("chooseTarget");
    if (!stealChoice || stealChoice.type !== "chooseTarget") {
      throw new Error("Expected a Gig selection after the decisive fight.");
    }
    engine.resolveEffectTargetIds([stealChoice.payload.eligibleIds![0]!], {
      as: P1,
      allowPendingChoice: true,
      reason: "Alt Cunningham may prevent the pending effect-driven Gig theft.",
    });

    const prevention = engine.getState().G.turnMetadata.pendingChoice;
    expect(prevention?.type).toBe("preventGigSteal");
    if (!prevention || prevention.type !== "preventGigSteal") {
      throw new Error("Expected Alt Cunningham to offer Gig-theft prevention.");
    }
    engine.resolvePreventGigSteal(
      [
        {
          dieId: prevention.payload.stealEntries[0]!.dieId,
          cardId: prevention.payload.handEntries[0]!.cardId,
        },
      ],
      { as: P2 },
    );

    expect(engine.getGigDice(P2)).toHaveLength(1);
    expect(engine.getGigDice(P1)).toHaveLength(0);
  });

  it("lets the next friendly Unit that wins by 3 power steal a chosen Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAppetiteForDestruction],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
          },
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
          },
        ],
        eddies: 3,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
    );
    const selectedGigId = engine.findGigIdByType(P2, "d8");
    const appetiteId = engine.findCardId(
      welcomeToNightCityRetailAppetiteForDestruction,
      "hand",
      P1,
    );
    const attackers = engine
      .getCardsInZone("field", P1)
      .filter((card) => card.definitionId === welcomeToNightCityRetailOffdutyMalfini.id);
    const defenders = engine
      .getCardsInZone("field", P2)
      .filter((card) => card.definitionId === welcomeToNightCityRetailCorpoSecurity.id);
    expect(attackers).toHaveLength(2);
    expect(defenders).toHaveLength(2);
    const attackerId = attackers[0]!.instanceId;

    engine.playCard(welcomeToNightCityRetailAppetiteForDestruction, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailAppetiteForDestruction.id,
    );
    expect(engine.getState().G.activeEffects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "nextFightWinGigSteal", minPowerMargin: 3 }),
      ]),
    );

    engine.attackUnit(attackers[0]!.instanceId, defenders[0]!.instanceId, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: {
        targetKind: "gig",
        min: 1,
        max: 1,
        eligibleIds: expect.arrayContaining([selectedGigId]),
      },
    });
    engine.resolveEffectTargetIds([selectedGigId], { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(selectedGigId);
    expect(engine.getEvents("gigStolen")).toContainEqual(
      expect.objectContaining({ dieId: selectedGigId, sourceCardId: attackerId }),
    );
    expect(engine.getEvents("actionLog")).toContainEqual(
      expect.objectContaining({
        messageKey: "trigger.stealGig",
        params: expect.objectContaining({
          cardName: "Appetite for Destruction",
          stolenGigs: "1 Gig (D8 with value 5)",
        }),
        cardIds: [appetiteId],
      }),
    );
    expect(engine.getState().G.activeEffects).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "nextFightWinGigSteal" })]),
    );

    engine.attackUnit(attackers[1]!.instanceId, defenders[1]!.instanceId, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getGigDice(P1).map((die) => die.id)).toEqual([selectedGigId]);
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d4");
  });

  it("does not consume the effect when a friendly Unit wins by less than 3 power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailAppetiteForDestruction],
        field: [
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            powerModifier: -1,
          },
        ],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );

    engine.playCard(welcomeToNightCityRetailAppetiteForDestruction, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getGigDice(P1)).toHaveLength(0);
    expect(engine.getState().G.activeEffects).toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "nextFightWinGigSteal" })]),
    );
  });

  it("expires at the end of the turn if no fight qualifies", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAppetiteForDestruction],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailAppetiteForDestruction, { as: P1 });
    engine.completeTurn({ as: P1 });

    expect(engine.getState().G.activeEffects).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ kind: "nextFightWinGigSteal" })]),
    );
  });
});
