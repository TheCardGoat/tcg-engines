import { describe, expect, it } from "vitest";
import { expectFabCard, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { inductionChamberRed as inductionChamber } from "../actions/induction-chamber.ts";
import { bravo } from "./bravo.ts";
import { talismanOfTithesBlue } from "../actions/talisman-of-tithes.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dashInventorExtraordinaire } from "./dash-inventor-extraordinaire.ts";

/**
 * Dash, Inventor Extraordinaire (ARC001) — Mechanologist Hero, 40{h}.
 *
 * Printed: You may start the game with a Mechanologist item with cost 2 or
 * less in the arena.
 */

const fillerDeck = [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed] as const;

describe("Dash, Inventor Extraordinaire (ARC001) AAA", () => {
  it("happy: a cost-2 Mechanologist item is placed in the arena from the starting deck", () => {
    const game = FabTestEngine.start(
      {
        hero: dashInventorExtraordinaire,
        deck: [...fillerDeck, inductionChamber],
        startGame: [inductionChamber],
      },
      { hero: bravo, deck: 6 },
    );
    const Dash = game.as(dashInventorExtraordinaire);

    expectFabPlayer(Dash).toHaveLife(40);
    expectFabCard(Dash, inductionChamber).toBeIn("arena");
    expect(Dash.zone("deck")).not.toContain(inductionChamber.canonicalId);
  });

  it("boundary: a Generic item does not match the start-game filter", () => {
    expect(() =>
      FabTestEngine.start(
        {
          hero: dashInventorExtraordinaire,
          deck: [...fillerDeck, talismanOfTithesBlue],
          startGame: [talismanOfTithesBlue],
        },
        { hero: bravo, deck: 6 },
      ),
    ).toThrow(/does not match any hero start-game filter/);
  });

  it("timing: declining the optional start-game selection leaves the arena empty", () => {
    const game = FabTestEngine.start(
      {
        hero: dashInventorExtraordinaire,
        deck: [...fillerDeck, inductionChamber],
        hand: [],
      },
      { hero: bravo, deck: 6 },
    );
    const Dash = game.as(dashInventorExtraordinaire);

    expect(Dash.zone("arena")).toHaveLength(0);
    expect(Dash.zone("deck")).toContain(inductionChamber.canonicalId);
  });
});
