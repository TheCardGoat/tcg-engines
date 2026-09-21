import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailWestbrookNetrunner,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const westbrook = welcomeToNightCityRetailWestbrookNetrunner;

describe("Westbrook Netrunner", () => {
  it("has the exact blue Netrunner identity and until-next-turn restriction DSL", () => {
    expect(westbrook).toMatchObject({
      canonicalId: "westbrook-netrunner",
      slug: "westbrook-netrunner",
      name: "Westbrook Netrunner",
      displayName: "Westbrook Netrunner",
      type: "unit",
      color: "blue",
      classifications: ["Netrunner"],
      cost: 4,
      power: 5,
      ram: 2,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "127",
      timingTriggers: ["play"],
      rulesText:
        "{Play} Until your next turn, rival Legends can't steal friendly Gigs with value less than their power.",
      abilities: [
        {
          kind: "triggered",
          text: "{Play} Until your next turn, rival Legends can't steal friendly Gigs with value less than their power.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "grantRule",
              target: { selector: "self" },
              rule: "cantStealGigBelowPower",
              duration: "untilSourceNextTurn",
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 4, enters with Lag, and rejects one less", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [westbrook],
      eddies: 4,
    });
    engine.spendAllLegends();
    engine.playCard(westbrook, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    const instance = engine.getCard(westbrook, "field", P1);
    expect(instance.meta.hasLag).toBe(true);
    expect(getEffectiveRules(engine.getState(), instance.instanceId as string)).toContain(
      "cantStealGigBelowPower",
    );

    const short = CyberpunkTestEngine.createWithFixture({ hand: [westbrook], eddies: 3 });
    short.spendAllLegends();
    expect(short.expectFailure(() => short.playCard(westbrook, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("stops a rival Legend from stealing a Gig valued less than its power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [westbrook],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            spent: false,
            hasLag: false,
          },
        ],
      },
    );
    engine.playCard(westbrook, { as: P1 });
    engine.completeTurn({ as: P1 });
    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P2 });
    engine.resolveFullSteal({ as: P2 });

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d4");
    expect(engine.getGigDice(P2).map((die) => die.dieType)).not.toContain("d4");
  });

  it("still allows a rival Legend to steal a Gig valued exactly equal to its power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [westbrook],
        eddies: 4,
        gigArea: [{ dieType: "d8", faceValue: 8 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
            spent: false,
            hasLag: false,
          },
        ],
      },
    );
    engine.playCard(westbrook, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P2 });
    engine.resolveFullSteal({ as: P2 });

    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d8");
  });

  it("does not stop a rival Unit from stealing a below-power Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [westbrook],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }] },
    );
    engine.playCard(westbrook, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveFullSteal({ as: P2 });
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d4");
  });

  it("expires at the start of its controller's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [westbrook],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailJackieWellesMamaSFavorite, spent: false, hasLag: false },
        ],
      },
    );
    engine.playCard(westbrook, { as: P1 });
    engine.completeTurn({ as: P1 });
    engine.completeTurn({ as: P2 });
    engine.judgeReadyCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P2 });
    engine.resolveFullSteal({ as: P2 });
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d4");
  });
});
