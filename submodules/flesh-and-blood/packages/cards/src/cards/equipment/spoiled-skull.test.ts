import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { spoiledSkull } from "./spoiled-skull.ts";
import { packHuntYellow } from "../actions/pack-hunt.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { snatchYellow } from "../actions/snatch.ts";

/**
 * Spoiled Skull (DTD106) — Shadow Brute Equipment - Head.
 *
 * Printed: "Action - {r}, banish this: Target 3 action cards with different
 * names in your banished zone and choose one at random. You may play it this
 * turn. Go again / Arcane Barrier 1 / Blood Debt"
 *
 * "You may play it this turn" is the PEN277 play-card duration grant.
 * "Different names" is printed-name identity (Snatch Red and Snatch Yellow
 * share a name).
 */

describe("Spoiled Skull (DTD106) AAA", () => {
  it("happy: banishing itself refunds go again and the random banished action is playable this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [spoiledSkull],
        banished: [packHuntYellow, nimblismBlue, snatchRed],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(spoiledSkull);
    Rhinar.target(packHuntYellow, nimblismBlue, snatchRed);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Rhinar, spoiledSkull).toBeBanished();
    expectFabPlayer(Rhinar).toHaveAP(1);

    const pool = [snatchRed, packHuntYellow, nimblismBlue] as const;
    let played = 0;
    for (const card of pool) {
      try {
        if (card === nimblismBlue) {
          Rhinar.play(card, { from: "banished" });
          game.untilIdle({ ordering: "listed" });
        } else {
          Rhinar.playAttack(card, { from: "banished" });
          expectCombat(game).toBeOpen();
          game.closeCombat({ optionals: "decline", ordering: "listed" });
        }
        played += 1;
      } catch {
        expectFabCard(Rhinar, card).toBeBanished();
      }
    }
    expect(played).toBe(1);

    Rhinar.endTurn();
    game.untilIdle({ ordering: "listed" });
    expectFabPlayer(Rhinar).toHaveLife(19);
  });

  it("boundary: with fewer than three banished action cards the activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [spoiledSkull],
        banished: [packHuntYellow, snatchRed],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.expectActivationRejected(spoiledSkull);
    expectFabCard(Rhinar, spoiledSkull).toBeIn("head");
  });

  it("boundary: two Snatch printings count as one name, so three cards are not three different names", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [spoiledSkull],
        banished: [snatchRed, snatchYellow, packHuntYellow],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.expectActivationRejected(spoiledSkull);
    expectFabCard(Rhinar, spoiledSkull).toBeIn("head");
  });

  it("boundary: a four-card pool still rejects picking two Snatch printings", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [spoiledSkull],
        banished: [snatchRed, snatchYellow, packHuntYellow, nimblismBlue],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(spoiledSkull);
    expect(() => Rhinar.target(snatchRed, snatchYellow, packHuntYellow)).toThrow(
      /different names/i,
    );
    expectFabCard(Rhinar, spoiledSkull).toBeIn("head");
  });
});
