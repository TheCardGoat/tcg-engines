import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wildRideRed } from "./wild-ride.ts";

describe("Wild Ride (EVR011) AAA", () => {
  it("happy: when this attacks it draws then discards a random card", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [wildRideRed],
        deck: [commandAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(wildRideRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.passBoth();

    expectFabCard(Rhinar, commandAndConquerRed).toBeIn("graveyard");
  });

  it("happy: discarding a 6+{p} card this way grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [wildRideRed],
        deck: [commandAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(wildRideRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords ?? []).toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveAP(1);
  });

  it("boundary: discarding a card with less than 6{p} does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [wildRideRed],
        deck: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(wildRideRed);
    game.passBoth();

    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveAP(0);
  });
});
