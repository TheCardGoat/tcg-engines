import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { tectonicInstabilityBlue } from "./tectonic-instability.ts";

describe("Tectonic Instability (MPG046) AAA", () => {
  it("happy: each hero with an arsenal puts it on the bottom and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tectonicInstabilityBlue],
        arsenal: [nimblismBlue],
        deckTop: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arsenal: [nimblismBlue],
        deckTop: [snatchRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(tectonicInstabilityBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Bravo.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("arsenal")).toHaveLength(0);
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabToken(game, "seismic-surge").toHaveCount(2);
  });

  it("boundary: a hero with no arsenal does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tectonicInstabilityBlue],
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(tectonicInstabilityBlue);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("hand")).not.toContain(snatchRed.canonicalId);
    expect(Dash.zone("hand")).not.toContain(snatchRed.canonicalId);
    expectFabToken(game, "seismic-surge").toHaveCount(0);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("timing: Seismic Surges equal cards drawn this way", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [tectonicInstabilityBlue],
        arsenal: [nimblismBlue],
        deckTop: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(tectonicInstabilityBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    expectFabToken(game, "seismic-surge").toHaveCount(1);
  });
});
