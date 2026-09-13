import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue, deathDealer } from "../shared/test-recipients.ts";
import { salvageShotRed } from "./salvage-shot.ts";

describe("Salvage Shot (ARC066) AAA", () => {
  it("happy: a hit puts this on the bottom of its owner's deck", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: salvageShotRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(salvageShotRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expect(Azalea.cardsIn("deck", salvageShotRed).length).toBe(1);
    expect(Azalea.zone("deck")[0]).toBe(salvageShotRed.canonicalId);
  });

  it("boundary: a miss leaves this in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: salvageShotRed, state: { faceDown: false } }],
        resourcePoints: 1,
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

    Azalea.playAttack(salvageShotRed, { from: "arsenal" });
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Azalea, salvageShotRed).toBeIn("graveyard");
    expect(Azalea.cardsIn("deck", salvageShotRed).length).toBe(0);
  });
});
