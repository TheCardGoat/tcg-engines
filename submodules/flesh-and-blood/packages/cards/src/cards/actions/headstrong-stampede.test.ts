import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { nimblismBlue } from "./nimblism.ts";
import { headstrongStampedeRed } from "./headstrong-stampede.ts";

/**
 * Headstrong Stampede (IAR047) — Brute Action - Attack, cost 2.
 *
 * Printed: When this attacks, reveal the top card of your deck. If the
 * revealed card has 6 or more base {p}, this gets go again.
 */

describe("Headstrong Stampede (IAR047) AAA", () => {
  it("happy: revealing a 6+ base {p} card grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [headstrongStampedeRed],
        deckTop: [wreckerRompRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(headstrongStampedeRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveAP(1);
    expectFabCard(Rhinar, headstrongStampedeRed).toBeIn("graveyard");
  });

  it("boundary: revealing a low-power card does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [headstrongStampedeRed],
        deckTop: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(headstrongStampedeRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveAP(0);
  });
});
