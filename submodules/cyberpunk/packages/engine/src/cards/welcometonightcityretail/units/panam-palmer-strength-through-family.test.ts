import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailPanamPalmerStrengthThroughFamily,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { playerHasCallLegendFree } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const panam = welcomeToNightCityRetailPanamPalmerStrengthThroughFamily;

describe("Panam Palmer — Strength Through Family", () => {
  it("is a green Aldecado/Merc/Nomad unit", () => {
    expect(panam).toMatchObject({
      type: "unit",
      color: "green",
      classifications: ["Aldecado", "Merc", "Nomad"],
      cost: 6,
      power: 6,
      printNumber: "085",
    });
  });

  it("lets you Call a Legend for free during your turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: panam, spent: false, hasLag: false }],
      legendArea: [
        { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
        { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
      ],
      eddies: 0,
    });

    expect(playerHasCallLegendFree(engine.getState(), P1)).toBe(true);
    const legendId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);
    expect(
      engine.executeMove("callLegend", { args: { legendId: legendId as string } }, P1).success,
    ).toBe(true);
    expect(engine.getCard(welcomeToNightCityRetailVStreetkid, "legendArea", P1).meta.faceDown).toBe(
      false,
    );
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("on Attack discards 1 then draws 1 per friendly face-up Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: panam, spent: false, hasLag: false }],
      hand: [welcomeToNightCityRetailCorpoSecurity],
      deck: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailCorpoSecurity,
      ],
      legendArea: [
        { card: welcomeToNightCityRetailVStreetkid, faceDown: false },
        { card: welcomeToNightCityRetailVStreetkid, faceDown: false },
      ],
    });

    engine.attackRival(panam, { as: P1 });
    engine.resolveDiscardFromHand([welcomeToNightCityRetailCorpoSecurity], { as: P1 });

    expect(engine.getCardsInZone("hand", P1).length).toBeGreaterThanOrEqual(2);
  });

  it("does not draw on Attack if you decline the discard", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: panam, spent: false, hasLag: false }],
      hand: [welcomeToNightCityRetailCorpoSecurity],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
    });
    const handBefore = engine.getHandCount(P1);
    engine.attackRival(panam, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type === "chooseTarget") {
      engine.executeMove("resolveDiscardFromHand", { args: { pass: true } }, P1);
    }
    expect(engine.getHandCount(P1)).toBe(handBefore);
  });
});
