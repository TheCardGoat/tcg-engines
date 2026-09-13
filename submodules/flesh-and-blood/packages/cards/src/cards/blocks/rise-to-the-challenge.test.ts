import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchBlue } from "../actions/snatch.ts";
import { snatchRed } from "../actions/snatch.ts";
import { wreckerRompRed } from "../actions/wrecker-romp.ts";
import { riseToTheChallengeRed } from "./rise-to-the-challenge.ts";

describe("Rise to the Challenge AAA", () => {
  it("happy: revealing 6+ base {p} while defending gives this +2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: rhinar,
        hand: [riseToTheChallengeRed],
        deck: [wreckerRompRed],
        life: 20,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    Rhinar.defendWith(riseToTheChallengeRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Rhinar).toHaveLife(20);
    expect(Rhinar.zone("deck").at(-1)).toBe(wreckerRompRed.canonicalId);
  });

  it("boundary: revealing a low-power card puts it on the bottom and keeps printed {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: rhinar,
        hand: [riseToTheChallengeRed],
        deckTop: [snatchBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    Rhinar.defendWith(riseToTheChallengeRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Rhinar).toHaveLife(19);
    expect(Rhinar.zone("deck")[0]).toBe(snatchBlue.canonicalId);
  });

  it("happy: discarding this from hand gives the next attack +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [riseToTheChallengeRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activate(riseToTheChallengeRed);
    game.untilIdle();
    expectFabCard(Rhinar, riseToTheChallengeRed).toBeIn("graveyard");

    Rhinar.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(6);
  });
});
