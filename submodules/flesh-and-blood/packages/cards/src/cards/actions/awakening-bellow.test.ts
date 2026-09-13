import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { awakeningBellowRed, awakeningBellowYellow } from "./awakening-bellow.ts";
import { packHuntBlue } from "./pack-hunt.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

// awakening-bellow-red (RNR014) — Brute Action, cost 1, go again.
// Printed: "The next Brute attack action card you play this turn gains +3{p}."
describe("awakening-bellow-red (RNR014) AAA", () => {
  it("happy: the next Brute attack action card gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [awakeningBellowRed, packHuntBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(awakeningBellowRed);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(packHuntBlue);
    // Pack Hunt base power 4 + 3 from Awakening Bellow = 7.
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("color variant: the yellow member grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [awakeningBellowYellow, packHuntBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(awakeningBellowYellow);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(packHuntBlue);

    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: a non-Brute attack action card gets NO buff", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [awakeningBellowRed, brutalAssaultBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(awakeningBellowRed);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(brutalAssaultBlue);
    // Brutal Assault is Generic (not Brute), so Awakening Bellow does not apply: base power 4.
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the action point spent to play Awakening Bellow", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [awakeningBellowRed], resourcePoints: 6, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Rhinar = game.as(rhinar);

    expect(Rhinar.actionPoints()).toBe(1);
    Rhinar.play(awakeningBellowRed);
    game.helpers.resolveUntilIdle();
    // −1 AP to play the Action, +1 AP from go again = still 1 (enables the follow-up attack).
    expect(Rhinar.actionPoints()).toBe(1);
  });
});
