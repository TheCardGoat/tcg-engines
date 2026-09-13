import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { trounceRed } from "./trounce.ts";

/**
 * Trounce (HVY061) — Guardian Block.
 * Printed: When this defends, clash with the attacking hero. Put the revealed
 * cards on the bottom of their owner's deck, then clash again. If a hero wins
 * both clashes, they create a Gold, Might, and Vigor token.
 */

describe("Trounce (HVY061) AAA", () => {
  it("happy: winning both clashes would mint Gold, Might, and Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        deck: [commandAndConquerRed, commandAndConquerRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 1);
  });

  it("boundary: a split clash pair does not mint the token trio", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        // Last entry is top: first clash reveals Nimblism, second Command and Conquer.
        deck: [commandAndConquerRed, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        // Last entry is top: first clash reveals Command and Conquer, second Nimblism.
        deck: [nimblismBlue, commandAndConquerRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 0);
  });

  it("happy: the attacking hero winning both clashes mints the token trio", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [commandAndConquerRed, commandAndConquerRed],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        deck: [nimblismBlue, nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("gold", 1);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
  });

  it("boundary: a first-clash tie then a second clash mints nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [commandAndConquerRed, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [trounceRed],
        deck: [commandAndConquerRed, nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(trounceRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("gold", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("vigor", 0);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
    expectFabPlayer(Dash).toHaveTokenCount("vigor", 0);
  });
});
