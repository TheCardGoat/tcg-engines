import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { clashOfAgilityYellow } from "../actions/clash-of-agility.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutusSummaRudis } from "./brutus-summa-rudis.ts";

/**
 * Brutus, Summa Rudis (JDG024) — Adjudicator Hero.
 *
 * Printed: If all heroes in a clash would fail to win, instead choose which
 * hero wins the clash. The replacement therefore stages a controller-owned
 * hero choice even in 1v1. Deckbuilding "any class clash" is pregame.
 */

describe("Brutus, Summa Rudis (JDG024) AAA", () => {
  it("happy: Brutus may choose himself to win a tied clash", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: brutusSummaRudis,
        hand: [clashOfAgilityYellow],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Brutus = game.as(brutusSummaRudis);

    game.as(dash).playAttack(snatchRed);
    Brutus.defendWith(clashOfAgilityYellow);
    game.advanceToDecision(Brutus, "entity-target");
    Brutus.target(Brutus);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Brutus);
    expectFabPlayer(Brutus).toHaveTokenCount("agility", 1);
  });

  it("happy: Brutus may choose the opposing hero to win a tied clash", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: brutusSummaRudis,
        hand: [clashOfAgilityYellow],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Brutus = game.as(brutusSummaRudis);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Brutus.defendWith(clashOfAgilityYellow);
    game.advanceToDecision(Brutus, "entity-target");
    Brutus.target(Dash);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Dash);
    expectFabPlayer(Brutus).toHaveTokenCount("agility", 0);
  });

  it("boundary: when the opponent already wins the clash, Brutus does not steal it", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [snatchRed],
      },
      {
        hero: brutusSummaRudis,
        hand: [clashOfAgilityYellow],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Brutus = game.as(brutusSummaRudis);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Brutus.defendWith(clashOfAgilityYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Dash);
    expectFabPlayer(Brutus).toHaveTokenCount("agility", 0);
  });

  it("timing: when Brutus already wins on power, the tie replacement does not fire twice", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: brutusSummaRudis,
        hand: [clashOfAgilityYellow],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Brutus = game.as(brutusSummaRudis);

    game.as(dash).playAttack(snatchRed);
    Brutus.defendWith(clashOfAgilityYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toHaveClashWinner(Brutus);
    expectFabPlayer(Brutus).toHaveTokenCount("agility", 1);
  });
});
