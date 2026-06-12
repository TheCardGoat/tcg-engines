import { describe, expect, it } from "vite-plus/test";
import {
  alphaGoroTakemuraLosingHisWay,
  alphaSaburoArasakaStubbornPatriach,
  alphaVCorporateExile,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Goro Takemura - Losing His Way", () => {
  it("gets +1 power for each face-up friendly Legend during your turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaGoroTakemuraLosingHisWay, spent: false }],
      legendArea: [
        { card: alphaVCorporateExile, faceDown: false },
        { card: alphaSaburoArasakaStubbornPatriach, faceDown: false },
      ],
    });

    const goro = engine.getCard(alphaGoroTakemuraLosingHisWay, "field", P1);

    expect(getEffectivePower(engine.getState(), goro.instanceId)).toBe(7);
  });

  it("ignores face-down Legends and turns off during the rival's turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaGoroTakemuraLosingHisWay, spent: false }],
      legendArea: [
        { card: alphaVCorporateExile, faceDown: false },
        { card: alphaSaburoArasakaStubbornPatriach, faceDown: true },
      ],
    });
    const goro = engine.getCard(alphaGoroTakemuraLosingHisWay, "field", P1);
    expect(getEffectivePower(engine.getState(), goro.instanceId)).toBe(6);

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.judgeRecomputeActiveEffects({ as: P1 });

    expect(getEffectivePower(engine.getState(), goro.instanceId)).toBe(5);
  });
});
