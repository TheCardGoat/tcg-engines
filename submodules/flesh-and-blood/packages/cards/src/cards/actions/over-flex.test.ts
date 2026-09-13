import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { overFlexRed } from "./over-flex.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// over-flex-red (ELE219) — Ranger Action, cost 1, go again, reload.
// Printed: "Your next arrow attack this turn gains +4{p}."
describe("over-flex-red (ELE219) AAA", () => {
  it("happy: the next arrow attack gains +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [overFlexRed],
        arsenal: [searingShotRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);

    Azalea.play(overFlexRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // Searing Shot base power 4 + 4 from Over Flex = 8.
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
  });

  it("boundary: without Over Flex the arrow attacks at its printed base power", () => {
    const game = FabTestEngine.start(
      { hero: azalea, weapon1: [deathDealer], arsenal: [searingShotRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Over Flex", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [overFlexRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);

    expect(Azalea.actionPoints()).toBe(1);
    Azalea.play(overFlexRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    // −1 AP to play the Action, +1 AP from go again = still 1.
    expect(Azalea.actionPoints()).toBe(1);
  });
});
