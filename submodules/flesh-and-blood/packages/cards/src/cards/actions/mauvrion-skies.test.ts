import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { prowlBlue } from "./prowl.ts";
import { hocusPocusYellow } from "./hocus-pocus.ts";
import { snatchRed } from "./snatch.ts";
import { mauvrionSkiesRed } from "./mauvrion-skies.ts";
import { mauvrionSkiesYellow, mauvrionSkiesBlue } from "./mauvrion-skies.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe.each([
  ["red", mauvrionSkiesRed, 3],
  ["yellow", mauvrionSkiesYellow, 2],
  ["blue", mauvrionSkiesBlue, 1],
] as const)("Mauvrion Skies %s AAA", (_color, skies, created) => {
  it(`gives the next Runeblade attack go again and creates ${created} Runechant on hit`, () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [skies, hocusPocusYellow], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    Bravo.play(skies);
    game.passBoth();
    Bravo.attackWith(hocusPocusYellow);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(18);
    expect(Bravo.zone("arena").filter((card) => card === "token:runechant")).toHaveLength(
      created + 1,
    );
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("does not create the hit Runechants when the attack is fully defended", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [skies, hocusPocusYellow], deck: 6 },
      { hero: dash, hand: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(skies);
    game.passBoth();
    Bravo.attackWith(hocusPocusYellow);
    Dash.defendWith(prowlBlue);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(20);
    expect(Bravo.zone("arena").filter((card) => card === "token:runechant")).toHaveLength(1);
  });

  it("does not apply either granted property to a non-Runeblade attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [skies, snatchRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    Bravo.play(skies);
    game.passBoth();
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(16);
    expect(Bravo.zone("arena")).not.toContain("token:runechant");
    expect(Bravo.actionPoints()).toBe(0);
  });
});
