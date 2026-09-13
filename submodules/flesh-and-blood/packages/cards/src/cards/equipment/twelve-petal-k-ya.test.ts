import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dash } from "../heroes/dash.ts";
import { zen } from "../heroes/zen.ts";
import { homageToAncestorsBlue } from "../instants/homage-to-ancestors.ts";
import { twelvePetalKYa } from "./twelve-petal-k-ya.ts";

/**
 * Twelve Petal Kāṣāya (FAB227) — Mystic Ninja Equipment - Chest.
 *
 * Printed: Whenever you transcend, you may gain {r}.
 * Instant - {c}{c}{c}, destroy this: Create a Zen State token. Blade Break.
 */

describe("Twelve Petal Kāṣāya (FAB227) AAA", () => {
  it("happy: whenever you transcend, you may gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        chest: [twelvePetalKYa],
        hand: [nimblismBlue, homageToAncestorsBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(nimblismBlue);
    game.untilIdle();
    Zen.play(homageToAncestorsBlue);
    game.untilIdle({ optionals: "accept" });

    expectFabPlayer(Zen).toHaveResourceCount(1);
    expectFabCard(Zen, twelvePetalKYa).toBeIn("chest");
  });

  it("boundary: a non-transcend play does not offer {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        chest: [twelvePetalKYa],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Zen).toHaveResourceCount(0);
    expectFabCard(Zen, twelvePetalKYa).toBeIn("chest");
  });

  it("happy: paying {c}{c}{c} destroys this and creates a Zen State token", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        chest: [twelvePetalKYa],
        chiPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.activate(twelvePetalKYa);
    game.untilIdle();

    expectFabCard(Zen, twelvePetalKYa).toBeIn("graveyard");
    expectFabToken(game, "zen-state").toHaveCount(1);
  });

  it("boundary: with only 2 chi the Instant is illegal and the kāṣāya stays equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        chest: [twelvePetalKYa],
        chiPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.expectActivationRejected(twelvePetalKYa);

    expectFabCard(Zen, twelvePetalKYa).toBeIn("chest");
    expectFabToken(game, "zen-state").toHaveCount(0);
  });
});
