import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { kano } from "../heroes/kano.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { seedsOfTomorrowBlue as seedsOfTomorrow } from "./seeds-of-tomorrow.ts";

/**
 * Seeds of Tomorrow (ROS035) — Instant.
 *
 * Printed: As an additional cost to play this, put a card from your
 * arsenal on the bottom of your deck.
 * Prevent the next 5 damage that would be dealt to you this turn.
 *
 * Unique arsenal card auto-binds the move-to-deck cost.
 */

describe("Seeds of Tomorrow (ROS035) AAA", () => {
  it("happy: bottoms the arsenal card and prevents the next 5 damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: kano,
        hand: [seedsOfTomorrow],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Kano = game.as(kano);

    Bravo.playAttack(brutalAssaultBlue);
    Kano.defendWith();
    Bravo.pass();
    Kano.play(seedsOfTomorrow);
    game.helpers.resolveRestOfCombat();

    expect(Kano.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
    expectFabCard(Kano, seedsOfTomorrow).toBeIn("graveyard");
    expectFabPlayer(Kano).toHaveLife(20);
  });

  it("boundary: with an empty arsenal this is unplayable", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: kano,
        hand: [seedsOfTomorrow],
        arsenal: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Kano = game.as(kano);

    Bravo.playAttack(brutalAssaultBlue);
    Kano.defendWith();
    Bravo.pass();
    expectFabUnplayable(() => Kano.play(seedsOfTomorrow));
    expectFabCard(Kano, seedsOfTomorrow).toBeIn("hand");
  });

  it("timing: the 5-damage shield still covers a later hit this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kano,
        hand: [seedsOfTomorrow],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Kano = game.as(kano);

    game.helpers.passPriorityTo(Kano);
    Kano.play(seedsOfTomorrow);
    game.untilIdle();
    Bravo.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Kano).toHaveLife(20);
  });
});
