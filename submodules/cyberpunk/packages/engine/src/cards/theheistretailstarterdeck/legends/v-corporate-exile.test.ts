import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailAnimalsWrecker,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, expectAttackCandidate } from "../../../testing/index.ts";

describe("V - Corporate Exile (The Heist retail starter)", () => {
  it("has the exact blue Corpo/Merc GO SOLO identity", () => {
    expect(theHeistRetailStarterDeckVCorporateExile).toMatchObject({
      canonicalId: "v-corporate-exile",
      slug: "v-corporate-exile",
      name: "V",
      subname: "Corporate Exile",
      displayName: "V: Corporate Exile",
      type: "legend",
      color: "blue",
      classifications: ["Corpo", "Merc"],
      cost: 5,
      power: 8,
      ram: 2,
      hasSellTag: true,
      rarity: "Epic",
      printNumber: "012",
      keywords: ["goSolo"],
      rulesText:
        "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. When it leaves the field, remove it from the game.)",
      abilities: [
        {
          kind: "keyword",
          keyword: "goSolo",
          source: { selector: "self" },
          effects: [],
          text: "Go Solo (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. When it leaves the field, remove it from the game.)",
        },
      ],
    });
  });

  it("goes solo from the legend area and can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
      eddies: 5,
    });
    const vId = engine.findCardId(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
    expect(engine.getEddies(P1)).toBe(1);
    const v = engine.getCard(theHeistRetailStarterDeckVCorporateExile, "field", P1);
    expect(v.meta.spent).toBe(false);
    expect(v.meta.hasLag).toBe(false);
    expectAttackCandidate(engine, theHeistRetailStarterDeckVCorporateExile, { as: P1 });
  });

  it("uses its own Sell Tag but rejects GO SOLO one Eddie below the exact cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
      eddies: 3,
    });
    const vId = engine.findCardId(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
    expect(engine.getEddies(P1)).toBe(3);
    expect(
      engine.getCard(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1).meta.faceDown,
    ).toBe(false);
  });

  it("cannot GO SOLO while face-down", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: true }],
      eddies: 5,
    });
    const vId = engine.findCardId(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1);
    expect(engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1)).toMatchObject({
      success: false,
      errorCode: "CARD_FACE_DOWN",
    });
    expect(
      engine.getCard(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1).meta.faceDown,
    ).toBe(true);
  });

  it("is removed from the game rather than trashed after leaving the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
        eddies: 5,
      },
      { field: [{ card: welcomeToNightCityRetailAnimalsWrecker, spent: true, hasLag: false }] },
    );
    const vId = engine.findCardId(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1);
    engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);
    engine.attackUnit(
      theHeistRetailStarterDeckVCorporateExile,
      welcomeToNightCityRetailAnimalsWrecker,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("removedFromGame", P1).map((card) => card.definitionId)).toContain(
      theHeistRetailStarterDeckVCorporateExile.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      theHeistRetailStarterDeckVCorporateExile.id,
    );
  });
});
