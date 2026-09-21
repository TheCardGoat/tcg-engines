import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailDumDumMaelstromTriggerman,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../testing/index.ts";

const v = theHeistRetailStarterDeckVCorporateExile; // GO SOLO, cost 5, sell tag
const jackiePure = welcomeToNightCityRetailJackieWellesMamaSFavorite; // sell tag, no spend ability
const dumDum = welcomeToNightCityRetailDumDumMaelstromTriggerman; // sell tag, SPEND ability
const jackieFlipped = theHeistRetailStarterDeckJackieWellesPourOneOutForMe; // sell tag, no spend ability

describe("automatic eddie payment priority", () => {
  it("go solo spends the legend itself before the eddie pool", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: v, faceDown: false },
        { card: jackiePure, faceDown: false },
      ],
      eddies: 5,
    });
    const vId = engine.findCardId(v, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
    const fieldV = engine.getCard(v, "field", P1);
    expect(fieldV.meta.spent).toBe(false);
    expect(fieldV.meta.hasLag).toBe(false);
    // V funded 1 €$ of its own cost, so only 4 eddies were drained.
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getCard(jackiePure, "legendArea", P1).meta.spent).toBe(false);
  });

  it("go solo fills the remainder with eddies, then a pure-resource legend before an ability legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: v, faceDown: false },
        { card: jackiePure, faceDown: false },
        { card: dumDum, faceDown: false },
      ],
      eddies: 3,
    });
    const vId = engine.findCardId(v, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
    // 5 = V (1) + 3 eddies + 1 legend; the ability-less Jackie pays before Dum Dum.
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(jackiePure, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getCard(dumDum, "legendArea", P1).meta.spent).toBe(false);
    expect(engine.getCard(v, "field", P1).meta.spent).toBe(false);
  });

  it("taps face-down legends in zone order without inspecting their hidden contents", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: v, faceDown: false },
        // Dum Dum is face-down here: its hidden SPEND ability must be ignored
        // and its zone position alone decides — otherwise the auto-payment
        // would leak face-down card contents through the ordering.
        { card: dumDum, faceDown: true },
        { card: jackieFlipped, faceDown: true },
      ],
      eddies: 3,
    });
    const vId = engine.findCardId(v, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
    // 5 = V (1) + 3 eddies + 1 face-down legend: the first in the zone array pays.
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(dumDum, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getCard(jackieFlipped, "legendArea", P1).meta.spent).toBe(false);
  });

  it("playing a card drains eddies first and leaves legends untouched", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSwordwiseHuscle],
      legendArea: [
        { card: jackiePure, faceDown: false },
        { card: dumDum, faceDown: false },
      ],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailSwordwiseHuscle);

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(jackiePure, "legendArea", P1).meta.spent).toBe(false);
    expect(engine.getCard(dumDum, "legendArea", P1).meta.spent).toBe(false);
  });

  it("playing a card taps a pure-resource legend before a legend with a spend ability", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSwordwiseHuscle],
      legendArea: [
        { card: jackiePure, faceDown: false },
        { card: dumDum, faceDown: false },
      ],
      eddies: 2,
    });

    engine.playCard(welcomeToNightCityRetailSwordwiseHuscle);

    // 3 = 2 eddies + 1 legend; Jackie (no spend ability) pays before Dum Dum.
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(jackiePure, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getCard(dumDum, "legendArea", P1).meta.spent).toBe(false);
  });

  it("calling a legend pays its eddie cost from eddies first", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: dumDum, faceDown: true },
        { card: jackiePure, faceDown: false },
      ],
      eddies: 1,
    });

    engine.callLegend(dumDum);

    expect(engine.getEddies(P1)).toBe(0);
    const called = engine.getCard(dumDum, "legendArea", P1).meta;
    expect(called.faceDown).toBe(false);
    expect(called.spent).toBe(false);
    expect(engine.getCard(jackiePure, "legendArea", P1).meta.spent).toBe(false);
  });

  it("calling a legend with no eddies taps a pure-resource legend and keeps the called legend ready", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: dumDum, faceDown: true },
        { card: jackiePure, faceDown: false },
      ],
      eddies: 0,
    });

    engine.callLegend(dumDum);

    const called = engine.getCard(dumDum, "legendArea", P1).meta;
    expect(called.faceDown).toBe(false);
    expect(called.spent).toBe(false);
    expect(engine.getCard(jackiePure, "legendArea", P1).meta.spent).toBe(true);
  });

  it("a spent go solo legend cannot fund itself and leaves the eddie pool intact", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: v, faceDown: false }],
      eddies: 5,
    });
    const vId = engine.findCardId(v, "legendArea", P1);
    engine.judgeSpendCard(v, { as: P1 });

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(v, "field", P1).meta.spent).toBe(false);
  });
});
