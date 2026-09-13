import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { barbedCastaway } from "../weapons/barbed-castaway.ts";
import { spireSnipingRed } from "./spire-sniping.ts";

/**
 * Spire Sniping, Red (AZL014) — Ranger Action - Arrow - Attack, cost 1,
 * 5{p}. (Base file shares the canonicalId; one suite covers both entries.)
 * Printed: "When Spire Sniping is put or turned face up in arsenal, look
 * at the top 2 cards of your deck, then put them back in any order."
 * The look rider is driven through Barbed Castaway's turn-face-up Instant:
 * the drain's `ordering: "listed"` policy answers the reorder partition, and
 * an explicit partition answer proves a chosen order reaches the deck
 * (harness/partition-decision-unanswerable). Bow legality + no-put boundary
 * covered here.
 */

describe("Spire Sniping, Red (AZL014) AAA", () => {
  it("legality: without a bow the arrow cannot be played from arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [spireSnipingRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    expect(() => Azalea.playAttack(spireSnipingRed, { from: "arsenal" })).toThrow(/bow/);
  });

  it("boundary: an arsenal-seated arrow that was never PUT face up skips the look and stays 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [spireSnipingRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(spireSnipingRed, { from: "arsenal" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
    expect(Azalea.zone("deck")).toHaveLength(6);
  });

  it("action: turned face up in arsenal looks at the top 2 and the listed drain puts them back in place", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [barbedCastaway],
        arsenal: [{ card: spireSnipingRed, state: { faceDown: true } }],
        resourcePoints: 1,
        deck: 4,
        deckTop: [searingShotRed, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(barbedCastaway, {
      abilityId: `${barbedCastaway.canonicalId}:oncePerTurnInstantResourceTurnFaceDownArrowArsenalFaceUpPutAimCounter`,
    });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Azalea, spireSnipingRed).toBeIn("arsenal").toBeFaceUp();
    expectFabCard(Azalea, spireSnipingRed).toHaveCounters(1, "aim");
    expect(Azalea.zone("deck").slice(-2)).toEqual([
      searingShotRed.canonicalId,
      nimblismBlue.canonicalId,
    ]);
  });

  it("action: naming the reorder flips the two looked cards on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [barbedCastaway],
        arsenal: [{ card: spireSnipingRed, state: { faceDown: true } }],
        resourcePoints: 1,
        deck: 4,
        deckTop: [searingShotRed, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(barbedCastaway, {
      abilityId: `${barbedCastaway.canonicalId}:oncePerTurnInstantResourceTurnFaceDownArrowArsenalFaceUpPutAimCounter`,
    });
    // The drain never names an order on its own: default ordering throws so
    // the test must answer the "put them back in any order" partition.
    expect(() => game.untilIdle({ optionals: "accept" })).toThrow(
      /requires an explicit answer for partition/,
    );

    const reorder = game.pendingDecision();
    if (reorder?.kind !== "partition") throw new Error("Expected the reorder partition.");
    const groupId = reorder.groups[0]!.id;
    // Entries are listed top-most first; the group consumes bottom-most first,
    // so submitting the listed order swaps the two cards.
    game.answerDecision(reorder.actorId, {
      kind: "partition",
      groups: { [groupId]: reorder.entries.map((entry) => entry.id) },
    });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Azalea, spireSnipingRed).toHaveCounters(1, "aim");
    expect(Azalea.zone("deck").slice(-2)).toEqual([
      nimblismBlue.canonicalId,
      searingShotRed.canonicalId,
    ]);
  });
});
