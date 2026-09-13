import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { evoRecallBlue } from "../instants/evo-recall.ts";
import { synapseSparkcap } from "./synapse-sparkcap.ts";

describe("Synapse Sparkcap (PEN057) AAA", () => {
  it("happy: tap and banish an Evo from hand to create a Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [synapseSparkcap],
        hand: [evoRecallBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(synapseSparkcap);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, evoRecallBlue).toBeBanished();
    expectFabCard(Dash, synapseSparkcap).toBeIn("head");
    expectFabCard(Dash, synapseSparkcap).toBeTapped();
    expectFabPlayer(Dash).toHaveTokenCount("ponder", 1);
  });

  it("boundary: without an Evo in hand the activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [synapseSparkcap],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(synapseSparkcap);
    expectFabCard(Dash, synapseSparkcap).toBeIn("head");
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("timing: a second activate is illegal while tapped", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [synapseSparkcap],
        hand: [evoRecallBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(synapseSparkcap);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Dash.expectActivationRejected(synapseSparkcap);
    expectFabPlayer(Dash).toHaveTokenCount("ponder", 1);
  });
});
