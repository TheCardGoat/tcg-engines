import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailWestbrookNetrunner,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const westbrook = welcomeToNightCityRetailWestbrookNetrunner;

describe("Westbrook Netrunner", () => {
  it("grants a until-next-turn steal restriction on Play", () => {
    expect(westbrook.abilities[0]?.effects[0]).toMatchObject({
      effect: "grantRule",
      rule: "cantStealGigBelowPower",
      duration: "untilSourceNextTurn",
    });

    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [westbrook],
      eddies: 4,
    });
    engine.playCard(westbrook, { as: P1 });
    const instance = engine.getCard(westbrook, "field", P1);
    expect(getEffectiveRules(engine.getState(), instance.instanceId as string)).toContain(
      "cantStealGigBelowPower",
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
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailJackieWellesMamaSFavorite, { as: P2 });
    engine.resolveFullSteal({ as: P2 });

    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d4");
    expect(engine.getGigDice(P2).map((die) => die.dieType)).not.toContain("d4");
  });

  it("still allows a rival Legend to steal a Gig valued at least its power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [westbrook],
        eddies: 4,
        gigArea: [{ dieType: "d12", faceValue: 12 }],
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

    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d12");
  });
});
