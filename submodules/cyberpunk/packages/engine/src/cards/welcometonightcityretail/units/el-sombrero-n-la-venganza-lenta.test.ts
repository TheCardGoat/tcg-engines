import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailElSombreroNLaVenganzaLenta,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, type GigFixtureEntry } from "../../../testing/index.ts";

describe("El Sombreron - La Venganza Lenta", () => {
  function attackSpentCorpoSecurityWithSombrero(p1: {
    eddies: number;
    gigArea?: GigFixtureEntry[];
    spendLegends?: boolean;
  }) {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        eddies: p1.eddies,
        gigArea: p1.gigArea,
        field: [
          {
            card: welcomeToNightCityRetailElSombreroNLaVenganzaLenta,
            spent: false,
            playedThisTurn: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    if (p1.spendLegends) {
      for (const legend of engine.getCardsInZone("legendArea", P1)) {
        engine.judgeSpendCard(legend, { as: P1 });
      }
    }

    engine.attackUnit(
      welcomeToNightCityRetailElSombreroNLaVenganzaLenta,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    return engine;
  }

  function resolveSombreroAttackTrigger(engine: CyberpunkTestEngine) {
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTrigger");
    if (!choice || choice.type !== "chooseTrigger") {
      throw new Error("Expected El Sombreron's optional attack trigger to be pending");
    }

    expect(choice.payload.canPass).toBe(true);
    expect(choice.payload.options).toHaveLength(1);

    const triggerId = choice.payload.options[0]!.triggerId;
    const result = engine.executeMove("resolveTrigger", { args: { triggerId } }, P1);
    expect(result).toMatchObject({ success: true });
  }

  it("pays 2 Eddies to gain power equal to the highest friendly Gig", () => {
    const engine = attackSpentCorpoSecurityWithSombrero({
      eddies: 2,
      gigArea: [
        { dieType: "d4", faceValue: 3 },
        { dieType: "d8", faceValue: 7 },
      ],
    });
    const sombrero = engine.getCard(welcomeToNightCityRetailElSombreroNLaVenganzaLenta);

    resolveSombreroAttackTrigger(engine);

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(11);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("skips the optional attack trigger automatically when the controller cannot pay 2 Eddies", () => {
    const engine = attackSpentCorpoSecurityWithSombrero({
      eddies: 0,
      gigArea: [{ dieType: "d8", faceValue: 7 }],
      spendLegends: true,
    });
    const sombrero = engine.getCard(welcomeToNightCityRetailElSombreroNLaVenganzaLenta);

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.players[P1].spentEddies).toBe(0);
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(4);
  });

  it("pays 2 Eddies but gains no extra power when the controller has no Gigs", () => {
    const engine = attackSpentCorpoSecurityWithSombrero({
      eddies: 2,
      gigArea: [],
    });
    const sombrero = engine.getCard(welcomeToNightCityRetailElSombreroNLaVenganzaLenta);

    resolveSombreroAttackTrigger(engine);

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);
    expect(engine.getGigCount(P1)).toBe(0);
    expect(getEffectivePower(engine.getState(), sombrero.instanceId)).toBe(4);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
