import { describe, expect, it } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailCyberpsychosis,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Cyberpsychosis", () => {
  it("has QUICK keyword and a play trigger that scales power by equipped Gear count", () => {
    const [quickAbility, triggeredAbility] = welcomeToNightCityRetailCyberpsychosis.abilities;
    expect(quickAbility?.kind).toBe("keyword");
    expect(quickAbility?.keyword).toBe("quick");

    expect(triggeredAbility?.kind).toBe("triggered");
    expect(triggeredAbility?.trigger).toMatchObject({ trigger: "play" });
    expect(triggeredAbility?.effects.map((effect) => effect.effect)).toEqual([
      "modifyPower",
      "defeatAtEndOfTurnIfAttacks",
    ]);
    expect(triggeredAbility?.effects[0]).toMatchObject({
      value: {
        type: "perCount",
        multiplier: 3,
      },
    });
  });

  it("keeps the selected equipped unit available as a concrete fixture target", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailCyberpsychosis],
      field: [
        {
          card: alphaSwordwiseHuscle,
          spent: false,
          playedThisTurn: false,
          attachedGears: [alphaKiroshiOptics, alphaMantisBlades],
        },
      ],
      eddies: 2,
    });

    const host = engine.getCard(alphaSwordwiseHuscle, "field", P1);
    expect(host.meta.attachedGearIds).toHaveLength(2);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCyberpsychosis.id,
    );
  });
});
