import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { dash } from "../heroes/dash.ts";
import { floodOfForceYellow } from "../actions/flood-of-force.ts";
import { craneDanceBlue } from "../actions/crane-dance.ts";
import { craneDanceRed } from "../actions/crane-dance.ts";
import { maskOfThePouncingLynx } from "./mask-of-the-pouncing-lynx.ts";

/**
 * Mask of the Pouncing Lynx — Ninja Head d2 Blade Break.
 *
 * Printed: "When an attack action card you control hits, you may destroy Mask
 * of the Pouncing Lynx. If you do, search your deck for an attack action card
 * with 2 or less {p}, banish it, then shuffle. You may play it this turn."
 *
 * "You may play it this turn" is the PEN277 play-card duration grant.
 */

describe("Mask of the Pouncing Lynx AAA", () => {
  it("happy: on a hit, destroy the mask, banish a 1{p} attack, and play it from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        head: [maskOfThePouncingLynx],
        hand: [floodOfForceYellow],
        deck: [craneDanceBlue],
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(floodOfForceYellow);
    game.closeCombat({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    Katsu.target(craneDanceBlue);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Katsu, maskOfThePouncingLynx).toBeIn("graveyard");
    expectFabCard(Katsu, Katsu.cardIn("banished", craneDanceBlue)).toBeBanished();

    Katsu.playAttack(craneDanceBlue, { from: "banished" });
    expectCombat(game).toBeOpen();
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Katsu, craneDanceBlue).toBeIn("graveyard");
  });

  it("boundary: declining the destroy keeps the mask equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        head: [maskOfThePouncingLynx],
        hand: [floodOfForceYellow],
        deck: [craneDanceBlue],
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(floodOfForceYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Katsu, maskOfThePouncingLynx).toBeIn("head");
    expect(Katsu.zone("deck")).toContain(craneDanceBlue.canonicalId);
  });

  it("boundary: a deck with only 3{p} attacks yields no banish even though the mask dies", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        head: [maskOfThePouncingLynx],
        hand: [floodOfForceYellow],
        deck: [craneDanceRed],
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(floodOfForceYellow);
    game.closeCombat({ optionals: "accept", entityTargets: "pause", ordering: "listed" });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Katsu, maskOfThePouncingLynx).toBeIn("graveyard");
    expect(Katsu.zone("banished")).toHaveLength(0);
    expect(Katsu.zone("deck")).toContain(craneDanceRed.canonicalId);
  });
});
