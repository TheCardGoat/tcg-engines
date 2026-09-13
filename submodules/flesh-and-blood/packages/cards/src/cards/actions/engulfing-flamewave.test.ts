import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { engulfingFlamewaveRed } from "./engulfing-flamewave.ts";

/**
 * Engulfing Flamewave (UPR051) — on hit reveal top; banish it if AAC cost < Draconic chain links.
 */

describe("Engulfing Flamewave (UPR051) AAA", () => {
  it("happy: a hit reveals a cost-0 AAC and banishes it (cost < 1 Draconic link)", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [engulfingFlamewaveRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(engulfingFlamewaveRed);
    game.untilIdle({ ordering: "listed", optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Fai, snatchRed).toBeBanished();
    expectFabCard(Fai, engulfingFlamewaveRed).toBeIn("graveyard");
  });

  it("boundary: a miss does not banish the top card", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [engulfingFlamewaveRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(engulfingFlamewaveRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.untilIdle({ ordering: "listed", optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Fai.cardsIn("deck", snatchRed).length).toBeGreaterThan(0);
  });

  it("timing: a revealed non-attack stays on top of deck", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [engulfingFlamewaveRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(engulfingFlamewaveRed);
    game.untilIdle({ ordering: "listed", optionals: "decline" });

    expect(Fai.cardsIn("deck", nimblismBlue).length).toBeGreaterThan(0);
    expect(Fai.zone("banished")).not.toContain(nimblismBlue.canonicalId);
  });
});
