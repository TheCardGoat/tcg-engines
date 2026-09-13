import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { prowlBlue } from "./prowl.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { mauvrionSkiesBlue } from "./mauvrion-skies.ts";
import { tempestuousKissRed } from "./tempestuous-kiss.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Tempestuous Kiss (OMN051) AAA", () => {
  it("with go again gets +1, deals 1 arcane on attack, and discards only once across both damage packets", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [mauvrionSkiesBlue, tempestuousKissRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [prowlBlue, prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(mauvrionSkiesBlue);
    game.passBoth();
    Bravo.attackWith(tempestuousKissRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Dash.life()).toBe(13);
    expect(Dash.zone("hand")).toHaveLength(1);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("without go again stays at 5 and has no on-attack arcane packet", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [tempestuousKissRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(tempestuousKissRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(15);
    expect(Dash.zone("hand")).toHaveLength(0);
  });
});
