import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Hanako Arasaka - Daughter of the Emperor", () => {
  it("is the exact green Arasaka Corpo Netrunner Legend with swap and start-turn pair draw", () => {
    const hanako = welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor;

    expect(hanako).toMatchObject({
      canonicalId: "hanako-arasaka-daughter-of-the-emperor",
      slug: "hanako-arasaka-daughter-of-the-emperor",
      name: "Hanako Arasaka",
      subname: "Daughter of the Emperor",
      displayName: "Hanako Arasaka: Daughter of the Emperor",
      type: "legend",
      color: "green",
      classifications: ["Arasaka", "Corpo", "Netrunner"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "072",
      rarity: "Rare",
      rulesText:
        "{Spend} Swap a friendly Gig with a rival Gig.\nAt the start of your turn, draw 1 for each friendly value-pair of Gigs.",
    });
    expect(hanako.abilities).toHaveLength(2);
    expect(hanako.abilities[0]).toMatchObject({
      trigger: { trigger: "activated" },
      bindings: [
        {
          id: "friendlyGig",
          target: {
            selector: "gig",
            controller: "friendly",
            amount: 1,
            selection: { min: 1, max: 1 },
          },
        },
        {
          id: "rivalGig",
          target: {
            selector: "gig",
            controller: "rival",
            amount: 1,
            selection: { min: 1, max: 1 },
          },
        },
      ],
      costs: [{ cost: "spend", target: { selector: "self" } }],
      effects: [
        {
          effect: "swapGigs",
          friendly: { selector: "bound", id: "friendlyGig" },
          rival: { selector: "bound", id: "rivalGig" },
        },
      ],
    });
    expect(hanako.abilities[1]).toMatchObject({
      trigger: { trigger: "event", event: { event: "turnStarted", player: "friendly" } },
      effects: [
        {
          effect: "forEachFriendlyGigPair",
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });
  });

  it("spends to swap a chosen friendly Gig with a chosen rival Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
            spent: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 4 },
        ],
      },
      {
        gigArea: [
          { dieType: "d8", faceValue: 6 },
          { dieType: "d10", faceValue: 8 },
        ],
      },
    );
    const friendlyGigId = engine.findGigIdByType(P1, "d4");
    const rivalGigId = engine.findGigIdByType(P2, "d8");

    engine.activateAbility(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, 0, {
      as: P1,
    });
    const friendlyChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (!friendlyChoice || friendlyChoice.type !== "chooseTarget") {
      throw new Error("Expected friendly Gig choice.");
    }
    expect(friendlyChoice.chooserId).toBe(P1);
    expect(friendlyChoice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(friendlyChoice.payload.eligibleIds).toEqual(engine.getGigDice(P1).map((die) => die.id));
    expect(friendlyChoice.payload.eligibleIds).not.toContain(rivalGigId);
    expect(
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [rivalGigId] } }, P1),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
    engine.resolveEffectTargetIds([friendlyGigId], {
      as: P1,
      allowPendingChoice: true,
      reason: "Hanako still needs the rival Gig to swap",
    });
    const rivalChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (!rivalChoice || rivalChoice.type !== "chooseTarget") {
      throw new Error("Expected rival Gig choice.");
    }
    expect(rivalChoice.chooserId).toBe(P1);
    expect(rivalChoice.payload.eligibleIds).toEqual(engine.getGigDice(P2).map((die) => die.id));
    expect(rivalChoice.payload.eligibleIds).not.toContain(friendlyGigId);
    expect(
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [friendlyGigId] } }, P1),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
    engine.resolveEffectTargetIds([rivalGigId], { as: P1 });

    expect(engine.getGigDice(P1).map((die) => die.id)).toEqual([
      engine.findGigIdByType(P1, "d6"),
      rivalGigId,
    ]);
    expect(engine.getGigDice(P2).map((die) => die.id)).toEqual([
      engine.findGigIdByType(P2, "d10"),
      friendlyGigId,
    ]);
    expect(
      engine.getCard(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, "legendArea", P1)
        .meta.spent,
    ).toBe(true);
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
  });

  it("cannot activate the swap without both a friendly and rival Gig and does not spend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
          faceDown: false,
          spent: false,
        },
      ],
      gigArea: [{ dieType: "d4", faceValue: 2 }],
    });

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, 0, {
        as: P1,
      }),
    );

    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(
      engine.getCard(welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor, "legendArea", P1)
        .meta.spent,
    ).toBe(false);
    expect(engine.getGigDice(P1)).toHaveLength(1);
    expect(engine.getGigDice(P2)).toHaveLength(0);
  });

  it("does not reuse any of three equal Gigs across value-pairs at turn start", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailMoxInciters,
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {},
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P2 });

    // CR 6.5.1: a Gig can count toward only one value-pair. Three equal Gigs
    // therefore make one pair, followed by the normal turn draw.
    expect(engine.getHandCount(P1)).toBe(2);
  });

  it("draws once for each disjoint friendly value-pair at turn start", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailFieldOperator,
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 4 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
      {},
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P2 });

    expect(engine.getHandCount(P1)).toBe(3);
  });

  it("draws only the normal turn card when no friendly Gig values form a pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      {},
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P2 });

    expect(engine.getHandCount(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not trigger when the Rival starts their turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      { deck: [welcomeToNightCityRetailDelamainCab] },
      { activePlayerId: P1, autoGainGig: false, preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(0);
    expect(engine.getHandCount(P2)).toBe(1);
  });

  it("does not trigger while Hanako is face-down in the Legend area", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailDelamainCab],
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: true,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      {},
      { activePlayerId: P2, autoGainGig: false, preserveDeckOrder: true },
    );

    engine.completeTurn({ as: P2 });

    expect(engine.getHandCount(P1)).toBe(1);
  });

  it("does not draw before its controller wins for starting the turn with 7 Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
            faceDown: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
          { dieType: "d12", faceValue: 5 },
          { dieType: "d20", faceValue: 6 },
        ],
      },
      { gigArea: [{ dieType: "d4", faceValue: 2 }] },
      { activePlayerId: P2, autoGainGig: false },
    );
    engine.judgeMoveGigToPlayer(engine.findGigIdByType(P2, "d4"), P1, { as: P1 });

    engine.completeTurn({ as: P2 });

    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P1);
    expect(engine.getWinReason()).toBe("gig_victory");
    expect(engine.getHandCount(P1)).toBe(0);
  });
});
