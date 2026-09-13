import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { infiltrateRed } from "./infiltrate.ts";

/**
 * Infiltrate (OUT012) — Assassin Attack. Red 0-cost 3{p}/3{d}. Stealth.
 * When this hits a hero, banish the top card of their deck. You may play it until the end of your next turn.
 */

describe("Infiltrate (OUT012) AAA", () => {
  it("happy: when this hits a hero, banish the top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [infiltrateRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.playAttack(infiltrateRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("boundary: a blocked miss does not banish their deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [infiltrateRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.playAttack(infiltrateRed);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("timing: the banished card may not be played after the following turn ends", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [infiltrateRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.playAttack(infiltrateRed);
    game.closeCombat({ optionals: "decline" });
    Uzuri.endTurn();
    game.as(dash).endTurn();
    Uzuri.endTurn();
    game.as(dash).endTurn();

    expect(() => Uzuri.attackWith(snatchRed, { from: "banished" })).toThrow();
    expectFabCard(game.as(dash), snatchRed).toBeBanished();
  });
});
