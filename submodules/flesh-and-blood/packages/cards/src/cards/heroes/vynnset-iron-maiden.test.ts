import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { funeralMoonRed } from "../actions/funeral-moon.ts";
import { snatchRed } from "../actions/snatch.ts";
import { vynnsetIronMaiden } from "./vynnset-iron-maiden.ts";
import { mauvrionSkiesBlue } from "../actions/mauvrion-skies.ts";
import { hocusPocusYellow } from "../actions/hocus-pocus.ts";

describe("Vynnset, Iron Maiden (DTD133) AAA", () => {
  it("has adult life and start-of-turn banishes a hand card to create Runechant", () => {
    const game = FabTestEngine.start(
      { hero: vynnsetIronMaiden, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Vynnset = game.as(vynnsetIronMaiden);
    expectFabPlayer(Vynnset).toHaveLife(40);
    Vynnset.endTurn();
    game.as(dash).endTurn();
    game.advanceToDecision(Vynnset, "entity-target");
    Vynnset.chooseTargets(Vynnset.cardIn("hand", snatchRed));
    game.helpers.resolveUntilIdle();
    expectFabCard(Vynnset, snatchRed).toBeIn("banished");
  });

  it("offers and charges the optional life payment after a Shadow non-attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnsetIronMaiden,
        hand: [funeralMoonRed, mauvrionSkiesBlue, hocusPocusYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Vynnset = game.as(vynnsetIronMaiden);
    Vynnset.play(funeralMoonRed);
    game.advanceToDecision(Vynnset, "boolean");
    Vynnset.chooseBoolean(true);
    game.helpers.resolveUntilIdle();
    // The optional 1 life payment was made.
    expect(Vynnset.life()).toBe(39);
  });
});
