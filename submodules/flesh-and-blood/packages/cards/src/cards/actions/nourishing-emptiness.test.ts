import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { prowlBlue } from "./prowl.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nourishingEmptinessRed } from "./nourishing-emptiness.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Nourishing Emptiness (MON246) AAA", () => {
  it("has dominate and grants +1 intellect on hit with no attack action in graveyard", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nourishingEmptinessRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [prowlBlue, prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(nourishingEmptinessRed);
    expect(() => Dash.defendWith([prowlBlue, prowlBlue])).toThrow();
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(14);
    expect(Bravo.intellect()).toBe(5);
  });

  it("loses both conditional benefits when an attack action is already in graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nourishingEmptinessRed],
        graveyard: [snatchRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [prowlBlue, prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(nourishingEmptinessRed);
    Dash.defendWith([prowlBlue, prowlBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(20);
    expect(Bravo.intellect()).toBe(4);
  });
});
