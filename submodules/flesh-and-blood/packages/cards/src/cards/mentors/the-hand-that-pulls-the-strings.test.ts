import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  seedResourcePoints,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { nixTheNimbleRed } from "../actions/nix-the-nimble.ts";
import { annihilateTheArmedRed } from "../actions/annihilate-the-armed.ts";
import { silver } from "../tokens/silver.ts";
import { theHandThatPullsTheStrings } from "./the-hand-that-pulls-the-strings.ts";

/**
 * The Hand that Pulls the Strings (ARK007) — Arakni Mentor.
 *
 * Printed: Once per Turn Attack Reaction — 0: Turn this face-up. Activate
 * this only while this is face-down in your arsenal. While this is face-up
 * in arsenal, your first attack with contract each turn gets go again. If
 * it's attacking a Royal hero, it gets +1{p}. At the beginning of your end
 * phase, destroy a Silver you control. If you don't, put this on the bottom
 * of your deck and draw a card.
 *
 * Go-again and the conditional Royal +1{p} share ONE appliesTo.next latch:
 * both bonuses attach to the first contract attack, and the Royal gate is an
 * in-sequence conditional evaluated with the latched attack as its subject
 * (the compiler routes attacking-* conditionals to the per-subject gate).
 * One latch means one consumption — a first contract attack that is not
 * targeting a Royal hero still consumes the whole grant.
 */

const faceUpMentor = {
  card: theHandThatPullsTheStrings,
  state: { faceDown: false },
} as const;

describe("The Hand that Pulls the Strings (ARK007) AAA", () => {
  it("happy: the first contract attack against a Royal hero is +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arsenal: [faceUpMentor],
        hand: [nixTheNimbleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fang, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ari = game.as(arakni);

    Ari.playAttack(nixTheNimbleRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: the first contract attack against a non-Royal hero stays printed {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arsenal: [faceUpMentor],
        hand: [nixTheNimbleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ari = game.as(arakni);

    Ari.playAttack(nixTheNimbleRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(5);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("timing: with no Silver to destroy she goes to the deck bottom and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arsenal: [theHandThatPullsTheStrings],
        hand: [nixTheNimbleRed, annihilateTheArmedRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ari = game.as(arakni);

    Ari.endTurn();
    game.untilIdle({ optionals: "decline" });

    expect(Ari.cardsIn("deck", theHandThatPullsTheStrings)).toHaveLength(1);
    expect(Ari.zone("arsenal")).toHaveLength(0);
    expectFabPlayer(Ari).toHaveHandCount(4);
  });

  it("timing: destroying Silver keeps her face-up in arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arsenal: [faceUpMentor],
        arena: [silver],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ari = game.as(arakni);

    Ari.endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Ari, theHandThatPullsTheStrings).toBeIn("arsenal").toBeFaceUp();
    expect(Ari.zone("arena")).not.toContain(silver.canonicalId);
  });

  it("timing: the first-contract bonuses rearm on the next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arsenal: [faceUpMentor],
        arena: [silver],
        hand: [nixTheNimbleRed, annihilateTheArmedRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fang, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ari = game.as(arakni);
    const Fang = game.as(fang);

    Ari.playAttack(nixTheNimbleRed, { optionals: "decline" });
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
    Fang.defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Ari.endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });
    Fang.endTurn();
    game.untilIdle({ optionals: "decline" });

    seedResourcePoints(game, 1, Ari);
    Ari.playAttack(annihilateTheArmedRed, { optionals: "decline" });
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
  });
});
