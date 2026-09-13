import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { descendIntoMadnessBlue } from "./descend-into-madness.ts";

/**
 * Descend into Madness (PEN278) — Chaos Attack Reaction, cost 0.
 *
 * Printed: Banish a random card from the defending hero's hand, then they
 * draw a card.
 */

describe("Descend into Madness (PEN278) AAA", () => {
  it("happy: banishes the defending hero's only hand card then they draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, descendIntoMadnessBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(descendIntoMadnessBlue);
    game.passBoth();

    expectFabCard(Dash, brutalAssaultBlue).toBeBanished();
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Bravo, descendIntoMadnessBlue).toBeIn("graveyard");
  });

  it("boundary: cannot play the attack reaction outside combat", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [descendIntoMadnessBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.must.playReaction(descendIntoMadnessBlue)).toThrow();
    expectFabCard(Bravo, descendIntoMadnessBlue).toBeIn("hand");
  });

  it("timing: an empty defending hand still draws after the random banish misses", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, descendIntoMadnessBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(descendIntoMadnessBlue);
    game.passBoth();

    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Bravo, descendIntoMadnessBlue).toBeIn("graveyard");
  });
});
