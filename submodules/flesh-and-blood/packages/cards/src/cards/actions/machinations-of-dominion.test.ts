import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { maleficIncantationRed } from "./malefic-incantation.ts";
import { hocusPocusYellow } from "./hocus-pocus.ts";
import { machinationsOfDominionBlue } from "./machinations-of-dominion.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Machinations of Dominion (ROS118) AAA", () => {
  it("gives overpower and, after a real aura was played, go again to the next Runeblade attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [maleficIncantationRed, machinationsOfDominionBlue, hocusPocusYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    Bravo.play(maleficIncantationRed);
    game.passBoth();
    Bravo.play(machinationsOfDominionBlue);
    game.passBoth();
    Bravo.attackWith(hocusPocusYellow);
    expect(game.combat()?.activeLink?.keywords).toContain("overpower");
    game.helpers.resolveRestOfCombat();

    expect(Bravo.actionPoints()).toBe(1);
  });

  it("without an aura still grants overpower but not go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [machinationsOfDominionBlue, hocusPocusYellow], deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    Bravo.play(machinationsOfDominionBlue);
    game.passBoth();
    Bravo.attackWith(hocusPocusYellow);
    expect(game.combat()?.activeLink?.keywords).toContain("overpower");
    game.helpers.resolveRestOfCombat();
    expect(Bravo.actionPoints()).toBe(0);
  });
});
