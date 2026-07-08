import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRoycePsychoOnTheEdge,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";

describe("Royce - Psycho on the Edge", () => {
  it("goes solo as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
      eddies: 6,
    });
    const royceId = engine.findCardId(
      welcomeToNightCityRetailRoycePsychoOnTheEdge,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: royceId as string } }, P1);

    expect(result.success).toBe(true);
    expectAttackCandidate(engine, welcomeToNightCityRetailRoycePsychoOnTheEdge, { as: P1 });
  });

  it("gets +2 power per attached Gear only during your turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailRoycePsychoOnTheEdge,
          faceDown: false,
          spent: false,
          playedThisTurn: false,
          attachedGears: [
            welcomeToNightCityRetailMantisBlades,
            welcomeToNightCityRetailZetatechFaceplate,
          ],
        },
      ],
    });
    const royceId = engine.findCardId(welcomeToNightCityRetailRoycePsychoOnTheEdge, "field", P1);
    const attachedGearPower =
      welcomeToNightCityRetailMantisBlades.power + welcomeToNightCityRetailZetatechFaceplate.power;

    engine.judgeSetTurnMetadata({ activePlayerId: P1 }, { as: P1 });
    engine.judgeRecomputeActiveEffects({ as: P1 });

    expect(getEffectivePower(engine.getState(), royceId)).toBe(
      welcomeToNightCityRetailRoycePsychoOnTheEdge.power + attachedGearPower + 4,
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.judgeRecomputeActiveEffects({ as: P1 });

    expect(getEffectivePower(engine.getState(), royceId)).toBe(
      welcomeToNightCityRetailRoycePsychoOnTheEdge.power + attachedGearPower,
    );
  });
});
