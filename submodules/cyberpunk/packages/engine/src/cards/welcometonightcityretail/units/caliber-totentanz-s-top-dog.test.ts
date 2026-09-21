import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCaliberTotentanzSTopDog,
  theHeistRetailStarterDeckMt0d12Flathead,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOverTheEdge,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Caliber - Totentanz's Top Dog", () => {
  it("is a 5-cost 5-power yellow Ganger Maelstrom Unit with both printed triggers", () => {
    expect(welcomeToNightCityRetailCaliberTotentanzSTopDog).toMatchObject({
      type: "unit",
      color: "yellow",
      classifications: ["Ganger", "Maelstrom"],
      cost: 5,
      power: 5,
      ram: 2,
      hasSellTag: false,
      timingTriggers: ["play", "defeated"],
    });
    expect(welcomeToNightCityRetailCaliberTotentanzSTopDog.abilities).toHaveLength(2);
  });

  it("on play defeats a rival unit with cost two or less", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCaliberTotentanzSTopDog],
        eddies: 5,
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailCaliberTotentanzSTopDog, { as: P1 });
    expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCaliberTotentanzSTopDog.id,
    );
  });

  it("does not target a friendly Unit or a rival Unit above the inclusive cost-2 boundary", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCaliberTotentanzSTopDog],
        field: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 5,
      },
      { field: [welcomeToNightCityRetailMoxInciters] },
    );

    engine.playCard(welcomeToNightCityRetailCaliberTotentanzSTopDog, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorpoSecurity.id,
        welcomeToNightCityRetailCaliberTotentanzSTopDog.id,
      ]),
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
  });

  it("defines a defeated trigger that makes the rival discard", () => {
    expect(welcomeToNightCityRetailCaliberTotentanzSTopDog.abilities[1]!.trigger).toEqual({
      trigger: "defeated",
    });
  });

  it("has two discard effects, with the second tied to a matching friendly Gig value", () => {
    const effects = welcomeToNightCityRetailCaliberTotentanzSTopDog.abilities[1]!.effects;
    expect(effects.map((effect) => effect.effect)).toEqual(["discardFromHand", "discardFromHand"]);
    expect(effects[0]).toMatchObject({ player: "rival", amount: 1 });
    expect(effects[1]).toMatchObject({
      player: "rival",
      amount: 1,
      logReason: "costMatchedFriendlyGig",
      conditions: [
        {
          condition: "costMatchesGig",
          target: { selector: "context", key: "discardedCards" },
          controller: "friendly",
        },
      ],
    });
  });

  it("logs only one discard when the discarded card cost does not match a friendly Gig", () => {
    const engine = createDefeatedTriggerFixture({ friendlyGigValue: 5 });

    defeatCaliber(engine);
    const discardResult = engine.resolveDiscardFromHand([welcomeToNightCityRetailMoxInciters], {
      as: P2,
    });

    expect(discardResult.moveLogs).toContainEqual(
      expect.objectContaining({
        type: "resolveDiscardFromHand",
        discardedCount: 1,
        reason: undefined,
      }),
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailMoxInciters.id,
    ]);
  });

  it("logs the additional discard when the discarded card cost matches a friendly Gig", () => {
    const engine = createDefeatedTriggerFixture({ friendlyGigValue: 5 });

    defeatCaliber(engine);
    const firstDiscardResult = engine.resolveDiscardFromHand(
      [theHeistRetailStarterDeckMt0d12Flathead],
      { as: P2 },
    );
    expect(firstDiscardResult.moveLogs).toContainEqual(
      expect.objectContaining({
        type: "resolveDiscardFromHand",
        discardedCount: 1,
        reason: undefined,
      }),
    );
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");

    const bonusDiscardResult = engine.resolveDiscardFromHand(
      [welcomeToNightCityRetailCorpoSecurity],
      {
        as: P2,
      },
    );

    expect(bonusDiscardResult.moveLogs).toContainEqual(
      expect.objectContaining({
        type: "resolveDiscardFromHand",
        discardedCount: 1,
        reason: "costMatchedFriendlyGig",
      }),
    );
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toEqual([
      theHeistRetailStarterDeckMt0d12Flathead.id,
      welcomeToNightCityRetailCorpoSecurity.id,
    ]);
  });

  it("does not use a rival Gig value to qualify the additional discard", () => {
    const engine = createDefeatedTriggerFixture({
      friendlyGigValue: 4,
      rivalGigValue: 5,
    });

    defeatCaliber(engine);
    engine.resolveDiscardFromHand([theHeistRetailStarterDeckMt0d12Flathead], { as: P2 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toEqual([
      theHeistRetailStarterDeckMt0d12Flathead.id,
    ]);
  });

  it("resolves as much as possible when the Rival has no cards to discard", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailCaliberTotentanzSTopDog, hasLag: false }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      {
        hand: [],
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: true }],
      },
    );

    defeatCaliber(engine);

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCaliberTotentanzSTopDog.id,
    );
  });

  it("triggers when an opposing card effect defeats Caliber", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailCaliberTotentanzSTopDog, hasLag: false }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      {
        hand: [
          welcomeToNightCityRetailOverTheEdge,
          theHeistRetailStarterDeckMt0d12Flathead,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 3,
        gigArea: [{ dieType: "d20", faceValue: 5 }],
        fixerDice: [],
      },
      { activePlayerId: P2 },
    );

    engine.playCard(welcomeToNightCityRetailOverTheEdge, { as: P2 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCaliberTotentanzSTopDog, {
      as: P2,
      allowPendingChoice: true,
      reason: "Caliber's Defeated trigger requires the Rival to discard",
    });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCaliberTotentanzSTopDog.id,
    );
    expect(engine.getPrompt(P2).choice).toMatchObject({
      type: "chooseTarget",
      payload: { type: "discardFromHand", amount: 1 },
    });
    engine.resolveDiscardFromHand([theHeistRetailStarterDeckMt0d12Flathead], { as: P2 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailOverTheEdge.id,
        theHeistRetailStarterDeckMt0d12Flathead.id,
        welcomeToNightCityRetailCorpoSecurity.id,
      ]),
    );
  });
});

function createDefeatedTriggerFixture(args: {
  friendlyGigValue: number;
  rivalGigValue?: number;
}): CyberpunkTestEngine {
  return CyberpunkTestEngine.createWithFixture(
    {
      field: [
        {
          card: welcomeToNightCityRetailCaliberTotentanzSTopDog,
          spent: false,
          hasLag: false,
        },
      ],
      gigArea: [{ dieType: "d6", faceValue: args.friendlyGigValue }],
    },
    {
      hand: [
        theHeistRetailStarterDeckMt0d12Flathead,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailMoxInciters,
      ],
      field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: true }],
      gigArea:
        args.rivalGigValue === undefined ? [] : [{ dieType: "d6", faceValue: args.rivalGigValue }],
    },
  );
}

function defeatCaliber(engine: CyberpunkTestEngine): void {
  engine.attackUnit(
    welcomeToNightCityRetailCaliberTotentanzSTopDog,
    embracingPowerRetailStarterDeckMinotaur,
    {
      as: P1,
    },
  );
  engine.resolveAttack({ as: P1 });
  engine.resolveAttack({ as: P2, pass: true });
  engine.resolveAttack({ as: P1 });
}
