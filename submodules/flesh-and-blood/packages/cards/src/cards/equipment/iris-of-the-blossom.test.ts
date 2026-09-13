import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { dash } from "../heroes/dash.ts";
import { headJabYellow } from "../actions/head-jab.ts";
import { whirlingMistBlossomYellow } from "../actions/whirling-mist-blossom.ts";
import { irisOfTheBlossom } from "./iris-of-the-blossom.ts";

/**
 * Iris of the Blossom — Ninja Head d2 Blade Break.
 *
 * Printed: "Instant - {t}, discard a card: Search your deck for a Whirling Mist
 * Blossom, banish it, then shuffle. You may play it this turn. Activate this
 * only if you've hit this turn."
 *
 * "You may play it this turn" is the PEN277 play-card duration grant, not a
 * resolution optional.
 */

describe("Iris of the Blossom AAA", () => {
  it("happy: after a hit, tutors Whirling Mist Blossom and you may play it from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        head: [irisOfTheBlossom],
        hand: [headJabYellow, headJabYellow],
        deck: [whirlingMistBlossomYellow],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(headJabYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Ira.activate(irisOfTheBlossom);
    game.passBoth();
    Ira.target(whirlingMistBlossomYellow);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Ira, whirlingMistBlossomYellow).toBeBanished();
    expectFabCard(Ira, irisOfTheBlossom).toBeTapped();

    Ira.playAttack(whirlingMistBlossomYellow, { from: "banished" });
    expectCombat(game).toBeOpen();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Ira, whirlingMistBlossomYellow).toBeIn("graveyard");
  });

  it("boundary: without a hit this turn the Instant cannot be activated", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        head: [irisOfTheBlossom],
        hand: [headJabYellow],
        deck: [whirlingMistBlossomYellow],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.expectActivationRejected(irisOfTheBlossom);
    expect(Ira.zone("deck")).toContain(whirlingMistBlossomYellow.canonicalId);
  });

  it("timing: the tutored Blossom cannot be played from banished on the next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        head: [irisOfTheBlossom],
        hand: [headJabYellow, headJabYellow],
        deck: [whirlingMistBlossomYellow],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(headJabYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Ira.activate(irisOfTheBlossom);
    game.passBoth();
    Ira.target(whirlingMistBlossomYellow);
    game.untilIdle({ ordering: "listed" });
    Ira.endTurn();
    game.as(dash).endTurn();

    expectFabUnplayable(
      () => Ira.playAttack(whirlingMistBlossomYellow, { from: "banished" }),
      /Playing from banished requires a migrated permission effect/,
    );
    expectFabCard(Ira, whirlingMistBlossomYellow).toBeBanished();
  });
});
