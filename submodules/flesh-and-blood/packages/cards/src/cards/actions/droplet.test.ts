import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { nimblismBlue } from "./nimblism.ts";
import { dropletBlue } from "./droplet.ts";

/**
 * Droplet, Blue (MST087) — Mystic Action - Attack, cost 0, 2{p}, 2{d}.
 *
 * Printed: "If you've played another blue card this turn, this gets +2{p}."
 */

describe("Droplet (MST087) AAA", () => {
  it("happy: after another blue card this turn this gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [brutalAssaultBlue, dropletBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.attackWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();
    Enigma.attackWith(dropletBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: as the first blue card this turn it stays printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [dropletBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.attackWith(dropletBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: a blue in the pitch zone does not count as playing one", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [dropletBlue],
        pitch: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.attackWith(dropletBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
  });
});
