import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { fellingSwingRed } from "./felling-swing.ts";
import { hatchetOfBody } from "../weapons/hatchet-of-body.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// felling-swing-red (DYN082) — Warrior Action, cost 3, go again.
// Printed: "Your next axe attack this turn gains +6{p}."
// No Axe attack-action card exists in the catalog, so the recipient is a weapon
// attack: Hatchet of Body (BOL003), a Warrior Axe (1H) weapon with printed power 2.
describe("felling-swing family AAA", () => {
  it("happy: the next axe attack (weapon) gains +6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfBody],
        hand: [fellingSwingRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(fellingSwingRed);
    game.helpers.resolveUntilIdle();
    // Declare the axe weapon attack; it should consume the +6 buff on declaration.
    Boltyn.activate(hatchetOfBody);
    game.passBoth();

    // Hatchet of Body base power 2 + 6 from Felling Swing = 8.
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
  });

  it("boundary: a non-axe attack gets no buff", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [fellingSwingRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(fellingSwingRed);
    game.helpers.resolveUntilIdle();
    // Brutal Assault is a Generic Action Attack (not an Axe) — it must NOT get +6.
    Boltyn.attackWith(brutalAssaultBlue);

    // Brutal Assault base power 4, untouched by the axe-only Felling Swing buff.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Felling Swing", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [fellingSwingRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    expect(Boltyn.actionPoints()).toBe(1);
    Boltyn.play(fellingSwingRed);
    game.helpers.resolveUntilIdle();
    // −1 AP to play the Action, +1 AP from go again = still 1 (enables the follow-up axe attack).
    expect(Boltyn.actionPoints()).toBe(1);
  });
});
