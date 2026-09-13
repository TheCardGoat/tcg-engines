import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gigawattRed } from "./gigawatt.ts";
import { urgentDeliveryRed } from "./urgent-delivery.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// gigawatt-red (EVO156) — Mechanologist Action, cost 1, go again.
// Printed: "Your next Mechanologist attack this turn gets +4{p}."
describe("gigawatt-red (EVO156) AAA", () => {
  it("happy: the next Mechanologist attack gains +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [gigawattRed, urgentDeliveryRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);

    Dash.play(gigawattRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(urgentDeliveryRed);
    // Urgent Delivery base power 4 + 4 from Gigawatt = 8.
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
  });

  it("boundary: a non-Mechanologist attack gets NO buff", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [gigawattRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);

    Dash.play(gigawattRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(brutalAssaultBlue);
    // Brutal Assault is Generic (not Mechanologist) — buff does not apply: base power 4.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Gigawatt", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [gigawattRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);

    expect(Dash.actionPoints()).toBe(1);
    Dash.play(gigawattRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    // −1 AP to play the Action, +1 AP from go again = still 1 (enables the follow-up attack).
    expect(Dash.actionPoints()).toBe(1);
  });
});
