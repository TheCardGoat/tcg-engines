import { describe, expect, it } from "vite-plus/test";
import { alphaVCorporateExile } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("V - Corporate Exile", () => {
  it("goes solo as a ready 8-power unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: alphaVCorporateExile, faceDown: false }],
      eddies: 5,
    });
    const vId = engine.findCardId(alphaVCorporateExile, "legendArea", P1);

    expect(engine.executeMove("goSolo", { args: { cardId: vId } }, P1)).toMatchObject({
      success: true,
    });
    const v = engine.getCard(alphaVCorporateExile, "field", P1);
    expect(getEffectivePower(engine.getState(), v.instanceId)).toBe(8);
    expect(v.meta.spent).toBe(false);
    expect(engine.attackRival(alphaVCorporateExile, { as: P1 })).toMatchObject({ success: true });
  });
});
