import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { brutalAssaultYellow, brutalAssaultRed } from "../actions/brutal-assault.ts";
import { ragingOnslaughtRed } from "../actions/raging-onslaught.ts";
import { bloodDrippingFrenzyBlue } from "../actions/blood-dripping-frenzy.ts";
import { snatchRed } from "../actions/snatch.ts";
import { gorgingShadowbeastRed } from "../actions/gorging-shadowbeast.ts";
import { barragingBeatdownYellow } from "../actions/barraging-beatdown.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { leaveNoWitnessesRed } from "../actions/leave-no-witnesses.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { leviaShadowbornAbomination } from "../heroes/levia-shadowborn-abomination.ts";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { hoovesOfTheShadowbeast } from "./hooves-of-the-shadowbeast.ts";

// Official Hooves text: optional destruction after a 6+ power card enters your banished zone.
describe("Hooves of the Shadowbeast", () => {
  for (const [label, banishedCard] of [
    ["six", brutalAssaultRed],
    ["seven", ragingOnslaughtRed],
  ] as const) {
    it(`accepts the trigger from ${label} power banished as a real additional cost`, () => {
      const game = FabTestEngine.start(
        {
          hero: levia,
          legs: [hoovesOfTheShadowbeast],
          hand: [bloodDrippingFrenzyBlue, banishedCard],
          resourcePoints: 2,
          deck: [snatchRed, snatchRed],
        },
        { hero: dash, hand: [], deck: [snatchRed, snatchRed] },
        { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
      );
      const Levia = game.as(levia);
      const Dash = game.as(dash);
      Levia.play(bloodDrippingFrenzyBlue);
      Levia.pass();
      Dash.pass();
      expectWait(game).toHaveDecision("boolean");
      expectFabCard(Levia, hoovesOfTheShadowbeast).toBeIn("legs");
      Levia.accept();
      game.untilIdle();
      expectFabCard(Levia, banishedCard).toBeBanished();
      expectFabCard(Levia, hoovesOfTheShadowbeast).toBeIn("graveyard");
      expectFabPlayer(Levia).toHaveAP(2).toHaveHandCount(0).toHaveResourceCount(0);
      expectFabPlayer(Dash).toHaveLife(20).toHaveHandCount(0);
    });
  }

  it("declines the qualifying trigger and gains no extra action point", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        legs: [hoovesOfTheShadowbeast],
        hand: [bloodDrippingFrenzyBlue, brutalAssaultRed],
        resourcePoints: 2,
        deck: [snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: [snatchRed, snatchRed] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);
    Levia.play(bloodDrippingFrenzyBlue);
    Levia.pass();
    game.as(dash).pass();
    expectWait(game).toHaveDecision("boolean");
    Levia.decline();
    game.untilIdle();
    expectFabCard(Levia, brutalAssaultRed).toBeBanished();
    expectFabCard(Levia, hoovesOfTheShadowbeast).toBeIn("legs");
    expectFabPlayer(Levia).toHaveAP(1).toHaveHandCount(0);
  });

  it("five power is below the banish trigger threshold", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        legs: [hoovesOfTheShadowbeast],
        hand: [bloodDrippingFrenzyBlue, brutalAssaultYellow],
        resourcePoints: 2,
        deck: [snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: [snatchRed, snatchRed] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);
    Levia.play(bloodDrippingFrenzyBlue);
    game.untilIdle();
    expectFabCard(Levia, brutalAssaultYellow).toBeBanished();
    expectFabCard(Levia, hoovesOfTheShadowbeast).toBeIn("legs");
    expectFabPlayer(Levia).toHaveAP(1).toHaveHandCount(0);
    expectWait(game).notToHaveDecision();
  });

  it("triggers when an on-attack banish moves a six-power card from the private deck", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        legs: [hoovesOfTheShadowbeast],
        hand: [gorgingShadowbeastRed],
        resourcePoints: 2,
        deck: [snatchRed, brutalAssaultRed],
      },
      { hero: dash, hand: [], deck: [snatchRed, snatchRed] },
      { ...FAB_MANUAL_HARNESS, firstPlayer: levia },
    );
    const Levia = game.as(levia);
    Levia.playAttack(gorgingShadowbeastRed, { stopAt: "on-attack" });
    expectWait(game).toHaveDecision("boolean");
    Levia.accept();
    game.closeCombat();
    expectFabCard(Levia, brutalAssaultRed).toBeBanished().toBeFaceUp();
    expectFabCard(Levia, hoovesOfTheShadowbeast).toBeIn("graveyard");
    expectFabPlayer(Levia).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("does not trigger from a private card intimidated face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barragingBeatdownYellow],
        resourcePoints: 0,
        deck: [snatchRed, snatchRed],
      },
      {
        hero: levia,
        legs: [hoovesOfTheShadowbeast],
        hand: [brutalAssaultRed],
        actionPoints: 0,
        deck: [snatchRed, snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: rhinar },
    );
    const Rhinar = game.as(rhinar);
    const Levia = game.as(levia);
    Rhinar.play(barragingBeatdownYellow);
    game.untilIdle();
    expectFabCard(Levia, brutalAssaultRed).toBeBanished().toBeFaceDown();
    expectFabCard(Levia, hoovesOfTheShadowbeast).toBeIn("legs");
    expectFabPlayer(Levia).toHaveAP(0).toHaveHandCount(0);
    expectFabPlayer(Rhinar).toHaveAP(1);
    expectWait(game).notToHaveDecision();
  });

  it("counts a card put in its owner's banished zone by an opponent's hit", () => {
    const game = FabTestEngine.start(
      { hero: uzuri, hand: [leaveNoWitnessesRed], resourcePoints: 0, deck: [snatchRed, snatchRed] },
      {
        hero: levia,
        legs: [hoovesOfTheShadowbeast],
        hand: [],
        actionPoints: 0,
        deck: [snatchRed, brutalAssaultRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: uzuri },
    );
    const Uzuri = game.as(uzuri);
    const Levia = game.as(levia);
    Uzuri.playAttack(leaveNoWitnessesRed);
    // The only optional resolution here is Hooves' destruction; there are no arsenal cards.
    game.closeCombat({ optionals: "accept" });
    expectFabCard(Levia, brutalAssaultRed).toBeBanished();
    expectFabCard(Levia, hoovesOfTheShadowbeast).toBeIn("graveyard");
    // CR 1.13.2b: the trigger still works, but non-turn players cannot gain AP.
    expectFabPlayer(Levia).toHaveLife(16).toHaveAP(0);
  });

  it("does not trigger for six power entering the opponent's banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [bloodDrippingFrenzyBlue, brutalAssaultRed],
        resourcePoints: 2,
        deck: [snatchRed, snatchRed],
      },
      {
        hero: levia,
        legs: [hoovesOfTheShadowbeast],
        hand: [],
        actionPoints: 0,
        deck: [snatchRed, snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: leviaShadowbornAbomination },
    );
    const Opponent = game.as(leviaShadowbornAbomination);
    const Levia = game.as(levia);
    Opponent.play(bloodDrippingFrenzyBlue);
    game.untilIdle();
    expectFabCard(Opponent, brutalAssaultRed).toBeBanished();
    expectFabCard(Levia, hoovesOfTheShadowbeast).toBeIn("legs");
    expectFabPlayer(Levia).toHaveAP(0);
    expectFabPlayer(Opponent).toHaveAP(1);
    expectWait(game).notToHaveDecision();
  });
});
