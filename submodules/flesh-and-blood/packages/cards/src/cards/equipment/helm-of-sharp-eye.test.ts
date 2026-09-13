import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { helmOfSharpEye } from "./helm-of-sharp-eye.ts";

/**
 * Helm of Sharp Eye (EVR053) — Warrior Head d1 Battleworn.
 *
 * Printed: "Attack Reaction — {r}, destroy this: Banish the top card of your
 * deck. You may play it this combat chain. Activate this only if you control a
 * weapon attack with {p} greater than twice its base."
 *
 * "You may play it this combat chain" is the Iris duration grant, never a
 * resolution optional wrapping play-card.
 */

describe("Helm of Sharp Eye (EVR053) AAA", () => {
  it("happy: banishes the deck-top Instant and you may play it this combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [helmOfSharpEye],
        weapon1: [{ card: dawnblade, state: { powerCounterTotal: 4 } }],
        hand: [],
        deckTop: [sigilOfSolaceRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(dawnblade);
    game.toReaction("attacker");
    Bravo.activate(helmOfSharpEye);
    game.passBoth();

    expectFabCard(Bravo, helmOfSharpEye).toBeIn("graveyard");
    expectFabCard(Bravo, sigilOfSolaceRed).toBeBanished();

    Bravo.play(sigilOfSolaceRed, { from: "banished" });
    game.passBoth();

    expectFabPlayer(Bravo).toHaveLife(23);
    expectFabCard(Bravo, sigilOfSolaceRed).toBeIn("graveyard");
    expectCombat(game).toBeOpen();
  });

  it("boundary: without {p} greater than twice base the Attack Reaction is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [helmOfSharpEye],
        weapon1: [dawnblade],
        hand: [],
        deckTop: [sigilOfSolaceRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(dawnblade);
    game.toReaction("attacker");
    Bravo.expectActivationRejected(helmOfSharpEye);
    expectFabCard(Bravo, helmOfSharpEye).toBeIn("head");
    expect(Bravo.zone("deck")).toContain(sigilOfSolaceRed.canonicalId);
  });

  it("timing: after the chain closes the banished card cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [helmOfSharpEye],
        weapon1: [{ card: dawnblade, state: { powerCounterTotal: 4 } }],
        hand: [],
        deckTop: [sigilOfSolaceRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(dawnblade);
    game.toReaction("attacker");
    Bravo.activate(helmOfSharpEye);
    game.closeCombat();

    expectFabCard(Bravo, sigilOfSolaceRed).toBeBanished();
    expectFabUnplayable(
      () => Bravo.play(sigilOfSolaceRed, { from: "banished" }),
      /Playing from banished requires a migrated permission effect/,
    );
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
