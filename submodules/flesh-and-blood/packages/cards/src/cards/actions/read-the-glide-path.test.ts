import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { readTheGlidePathRed } from "./read-the-glide-path.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// read-the-glide-path-red (EVR100) — Ranger Action, cost 0, go again.
// Printed: "Your next arrow attack this turn gains +3{p}."
describe("read-the-glide-path-red (EVR100) AAA", () => {
  it("happy: the next arrow attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [readTheGlidePathRed],
        weapon1: [deathDealer],
        arsenal: [searingShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);

    Azalea.play(readTheGlidePathRed);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // Searing Shot base power 4 + 3 from Read the Glide Path = 7.
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: without Read the Glide Path the arrow attacks at its printed base power", () => {
    const game = FabTestEngine.start(
      { hero: azalea, weapon1: [deathDealer], arsenal: [searingShotRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Read the Glide Path", () => {
    const game = FabTestEngine.start(
      { hero: azalea, hand: [readTheGlidePathRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);

    expect(Azalea.actionPoints()).toBe(1);
    Azalea.play(readTheGlidePathRed);
    game.helpers.resolveUntilIdle();
    // −1 AP to play the Action, +1 AP from go again = still 1.
    expect(Azalea.actionPoints()).toBe(1);
  });
});
