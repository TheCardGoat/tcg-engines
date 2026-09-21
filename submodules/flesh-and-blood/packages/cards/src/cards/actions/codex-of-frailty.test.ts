import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { headJabRed } from "./head-jab.ts";
import { codexOfFrailtyYellow } from "./codex-of-frailty.ts";

describe("Codex of Frailty (OUT160) AAA", () => {
  it("lets each hero choose their own graveyard attack when played from arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arsenal: [codexOfFrailtyYellow],
        hand: [nimblismBlue],
        graveyard: [snatchRed, headJabRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], graveyard: [headJabRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfFrailtyYellow, { from: "arsenal" });
    game.passBoth();
    // Each-hero asks iterate in turn order starting left of the controller
    // (CR 1.10.2b): Dash chooses before Arakni.
    Dash.chooseTargets(Dash.cardIn("graveyard", snatchRed));
    Arakni.chooseTargets(Arakni.cardIn("graveyard", headJabRed));
    game.untilIdle();

    expectFabCard(Arakni, headJabRed).toBeIn("arsenal").toBeFaceDown();
    expectFabCard(Dash, snatchRed).toBeIn("arsenal").toBeFaceDown();
    expectFabCard(Arakni, snatchRed).toBeIn("graveyard");
    expectFabCard(Dash, headJabRed).toBeIn("graveyard");
    expectFabCard(Arakni, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Arakni).toHaveAP(1).toHaveTokenCount("ponder", 1);
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
  });

  it("happy: each hero puts an attack action from graveyard face-down into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [codexOfFrailtyYellow, nimblismBlue],
        graveyard: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        graveyard: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfFrailtyYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Arakni, snatchRed).toBeIn("arsenal");
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expectFabCard(Arakni, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: a hero with no attack action in graveyard skips the arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [codexOfFrailtyYellow, nimblismBlue],
        graveyard: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], graveyard: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfFrailtyYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Arakni.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("arsenal")).toHaveLength(0);
    expect(Arakni.zone("hand")).toContain(nimblismBlue.canonicalId);
  });

  it("timing: each hero that arsenals this way discards; create Ponder and Frailty", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [codexOfFrailtyYellow, nimblismBlue],
        graveyard: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], graveyard: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(codexOfFrailtyYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Arakni, snatchRed).toBeIn("arsenal");
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expectFabToken(game, "ponder").toHaveCount(1);
    expectFabToken(game, "frailty").toHaveCount(1);
    expect(Arakni.zone("arena")).toContain("token:ponder");
    expect(Dash.zone("arena")).toContain("token:frailty");
  });
});
