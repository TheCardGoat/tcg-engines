import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailPeaceOffering,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectAttackCandidate } from "../../../testing/index.ts";

describe("V - Streetkid", () => {
  it("goes solo as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
      eddies: 5,
    });
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
    expectAttackCandidate(engine, welcomeToNightCityRetailVStreetkid, { as: P1 });
  });

  it("trashes 3 on call and returns a Braindance Program from trash to hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        trash: [welcomeToNightCityRetailPeaceOffering],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailPeaceOffering, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailPeaceOffering.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorpoSecurity.id,
        welcomeToNightCityRetailDelamainCab.id,
      ]),
    );
  });

  it("does not leave a pending choice when the trashed cards include no Braindance Program", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailDelamainCab,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getHandCount(P1)).toBe(0);
  });
});
