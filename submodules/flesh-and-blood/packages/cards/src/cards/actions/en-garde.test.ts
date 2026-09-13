import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { enGardeRed } from "./en-garde.ts";
import { hatchetOfBody } from "../weapons/hatchet-of-body.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// en-garde-red (DVR009) — Warrior Action, cost 1, go again.
// Printed: "Your next weapon attack this turn gains +3{p}."
// (appliesTo.next.typeBox.types:["Weapon"]). No Axe/weapon attack-action card
// exists in the catalog, so the recipient is a weapon attack: Hatchet of Body
// (BOL003), a Warrior Axe (1H) weapon with printed power 2.
describe("en-garde-red (DVR009) AAA", () => {
  it("happy: the next weapon attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfBody],
        hand: [enGardeRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(enGardeRed);
    game.helpers.resolveUntilIdle();
    // Declare the weapon attack; it consumes the +3 buff on declaration.
    Boltyn.activate(hatchetOfBody);
    game.passBoth();

    // Hatchet of Body base power 2 + 3 from En Garde = 5.
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("boundary: a non-weapon attack gets no buff", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [enGardeRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(enGardeRed);
    game.helpers.resolveUntilIdle();
    // Brutal Assault is a Generic Action Attack (not a Weapon) — no +3.
    Boltyn.attackWith(brutalAssaultBlue);

    // Brutal Assault base power 4, untouched by the weapon-only En Garde buff.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play En Garde", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [enGardeRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);

    expect(Boltyn.actionPoints()).toBe(1);
    Boltyn.play(enGardeRed);
    game.helpers.resolveUntilIdle();
    // −1 AP to play the Action, +1 AP from go again = still 1.
    expect(Boltyn.actionPoints()).toBe(1);
  });
});
