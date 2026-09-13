import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { visitTheBlacksmithBlue } from "./visit-the-blacksmith.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// visit-the-blacksmith-blue (DVR022) — Generic Action, cost 0, go again.
// Printed: "Your next sword attack this turn gains +1{p}."
// "Sword attack" = attacking with a Sword weapon (Cintari Saber is a
// Warrior/Weapon/Sword; the engine buckets "Sword" into the weapon's subtypes,
// so the appliesTo.next.typeBox.subtypes:["Sword"] filter matches the weapon).
describe("visit-the-blacksmith-blue (DVR022) AAA", () => {
  it("happy: the next Sword weapon attack gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [cintariSaber],
        hand: [visitTheBlacksmithBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(visitTheBlacksmithBlue);
    game.helpers.resolveUntilIdle();
    Boltyn.activate(cintariSaber);
    game.passBoth();
    // Cintari Saber base power 2 + 1 from Visit the Blacksmith = 3.
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("boundary: without Visit the Blacksmith the Sword weapon attacks at base power", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activate(cintariSaber);
    game.passBoth();
    // No buff pending -> base power 2.
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });

  it("timing: go again refunds the action point spent to play Visit the Blacksmith", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [visitTheBlacksmithBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    expect(Boltyn.actionPoints()).toBe(1);
    Boltyn.play(visitTheBlacksmithBlue);
    game.helpers.resolveUntilIdle();
    // −1 AP to play the Action, +1 AP from go again = still 1.
    expect(Boltyn.actionPoints()).toBe(1);
  });
});
