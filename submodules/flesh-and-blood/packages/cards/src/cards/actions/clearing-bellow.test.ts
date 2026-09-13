import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { clearingBellowBlue } from "./clearing-bellow.ts";

/**
 * Clearing Bellow (RVD025) — Brute Action, cost 0, 3{d}. Printed: Intimidate / Go again.
 */

describe("Clearing Bellow (RVD025) AAA", () => {
  it("happy: resolving refunds leftover AP (go again)", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [clearingBellowBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(clearingBellowBlue);

    expectFabPlayer(Rhinar).toHaveAP(1);
    // Printed Intimidate: Dash banishes a random hand card face-down
    // (returned at end phase), so their hand is one smaller.
    expectFabPlayer(game.as(dash)).toHaveHandCount(0);
    // The drained card is face-down in the banished zone (Intimidate), not
    // discarded: it returns when the turn ends.
    expect(game.as(dash).zone("banished")).toHaveLength(1);
  });

  it("boundary: empty opposing hand still refunds AP", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [clearingBellowBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(clearingBellowBlue);

    expectFabPlayer(Rhinar).toHaveAP(1);
    expect(game.as(dash).zone("banished")).toHaveLength(0);
  });

  it("timing: illegal as an instant during the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue, clearingBellowBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    expectFabUnplayable(
      () => Dash.must.playReaction(clearingBellowBlue),
      /action card is not legal|arrow can only be played/i,
    );
    expectFabCard(Dash, clearingBellowBlue).toBeIn("hand");
  });
});
