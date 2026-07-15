import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCaliberTotentanzSTopDog,
  theHeistRetailStarterDeckMt0d12Flathead,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Caliber - Totentanz's Top Dog", () => {
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
  });

  it("defines a defeated trigger that makes the rival discard", () => {
    expect(welcomeToNightCityRetailCaliberTotentanzSTopDog.abilities[1]!.trigger).toEqual({
      trigger: "defeated",
    });
  });

  it("has two discard effects, with the second tied to a matching friendly Gig value", () => {
    const effects = welcomeToNightCityRetailCaliberTotentanzSTopDog.abilities[1]!.effects;
    expect(effects.map((effect) => effect.effect)).toEqual(["discardFromHand", "discardFromHand"]);
    expect(effects[1]).toMatchObject({
      amount: 1,
      logReason: "costMatchedFriendlyGig",
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
});

function createDefeatedTriggerFixture(args: { friendlyGigValue: number }): CyberpunkTestEngine {
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
