import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue, deathDealer } from "../shared/test-recipients.ts";
import { endlessArrowRed } from "./endless-arrow.ts";

describe("Endless Arrow (ARC045) AAA", () => {
  it("happy: a hit puts this into its owner's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: endlessArrowRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(endlessArrowRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Azalea, endlessArrowRed).toBeIn("hand");
  });

  it("boundary: a miss leaves this in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: endlessArrowRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(endlessArrowRed, { from: "arsenal" });
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Azalea, endlessArrowRed).toBeIn("graveyard");
  });
});
