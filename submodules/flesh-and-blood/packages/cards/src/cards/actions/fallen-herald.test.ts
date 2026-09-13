import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { fallenHeraldYellow } from "./fallen-herald.ts";

/**
 * Fallen Herald — Shadow Action - Attack, cost 2, 6{p}.
 *
 * Printed: Instant - Banish this from your hand: Prevent the next 4 damage
 * that would be dealt to you this turn. Blood Debt
 */

describe("Fallen Herald AAA", () => {
  it("happy: banishing this from hand prevents the next 4 damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: chane,
        hand: [fallenHeraldYellow],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Chane = game.as(chane);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Chane.activate(fallenHeraldYellow);
    game.closeCombat();

    expectFabCard(Chane, fallenHeraldYellow).toBeBanished();
    expectFabPlayer(Chane).toHaveLife(20);
  });

  it("boundary: without activating, Snatch deals its printed 4", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: chane,
        hand: [fallenHeraldYellow],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Chane = game.as(chane);

    Dash.playAttack(snatchRed);
    Chane.defendWith();
    game.closeCombat();

    expectFabCard(Chane, fallenHeraldYellow).toBeIn("hand");
    expectFabPlayer(Chane).toHaveLife(16);
  });

  it("boundary: leftover prevention carries to a later damage event this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: chane,
        hand: [fallenHeraldYellow, nimblismBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Chane = game.as(chane);

    Dash.playAttack(snatchRed);
    Chane.defendWith(nimblismBlue);
    game.toReaction("defender");
    Chane.activate(fallenHeraldYellow);
    game.closeCombat();
    expectFabPlayer(Chane).toHaveLife(20);

    Dash.playAttack(snatchRed);
    Chane.defendWith();
    game.closeCombat();
    expectFabCard(Chane, fallenHeraldYellow).toBeBanished();
    expectFabPlayer(Chane).toHaveLife(18);
  });
});
