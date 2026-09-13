import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { overLoopYellow } from "../actions/over-loop.ts";
import { bravo } from "../heroes/bravo.ts";
import { cogwerxBaseHead } from "../equipment/cogwerx-base-head.ts";
import { evoRecallBlue } from "./evo-recall.ts";

/**
 * Evo Recall Blue (MST228) — Mechanologist Instant Equipment Evo Head.
 *
 * Printed: If you have a base head equipped, transform it into this, then
 * equip this. When this is equipped, put up to 1 Mechanologist action card
 * from your banished zone on top of your deck. Arcane Barrier 1.
 */

describe("Evo Recall (MST228) AAA", () => {
  it("happy: transforms a base head into this and returns a banished Mechanologist action to the top", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [cogwerxBaseHead],
        hand: [evoRecallBlue],
        banished: [overLoopYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(evoRecallBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, evoRecallBlue).toBeIn("head");
  });

  it("boundary: without a base head this does not equip", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [evoRecallBlue], banished: [overLoopYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(evoRecallBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Dash.zone("head")).not.toContain(evoRecallBlue.canonicalId);
  });

  it("timing: declining the up-to-1 return leaves the Mechanologist action banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [cogwerxBaseHead],
        hand: [evoRecallBlue],
        banished: [overLoopYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(evoRecallBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Dash, evoRecallBlue).toBeIn("head");
    expectFabCard(Dash, overLoopYellow).toBeBanished();
  });
});
