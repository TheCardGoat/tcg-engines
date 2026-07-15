import { describe, expect, it } from "vite-plus/test";
import { theHeistRetailStarterDeckVCorporateExile } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectAttackCandidate } from "../../../testing/index.ts";

describe("V - Corporate Exile (The Heist retail starter)", () => {
  it("goes solo from the legend area and can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
      eddies: 5,
    });
    const vId = engine.findCardId(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
    const v = engine.getCard(theHeistRetailStarterDeckVCorporateExile, "field", P1);
    expect(v.meta.spent).toBe(false);
    expect(v.meta.playedThisTurn).toBe(false);
    expectAttackCandidate(engine, theHeistRetailStarterDeckVCorporateExile, { as: P1 });
  });

  it("cannot go solo without enough available eddies", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
      eddies: 3,
    });
    const vId = engine.findCardId(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
    expect(
      engine.getCard(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1).meta.faceDown,
    ).toBe(false);
  });
});
