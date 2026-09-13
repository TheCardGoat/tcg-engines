/**
 * TCC028 Hammer of Havenhold — Guardian Hammer 1H — power 3.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}{r}: Attack
 *   a2: If you have a Chivalry in your pitch zone, this gets +1{p}.
 *
 * Status: 🟡→✅. a1 (3 RP OPT 3-power) proven @ weapon-pure-opt-attack.
 * This file proves a2 through public combat: with a real Chivalry (TCC048
 * blue) in the pitch zone, the weapon attacks at 3+1=4 power; without a
 * Chivalry (non-Chivalry card pitched) it stays at 3.
 *
 * ENGINE NOTE: the model previously referenced the unwired has-status
 * `chivalry-card-in-pitch-zone`; the printed rule is a pitch-zone presence
 * gate, which the engine already evaluates via the wired `pitch-zone-has`
 * condition (SUP125 gauntlets-of-tyrannical-rex pattern). Card-model fix
 * only — no engine change required.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, rattleBonesRed, bravo } from "../../../fixtures.ts";

import { hammerOfHavenhold } from "../../../../../../cards/src/cards/weapons/hammer-of-havenhold.ts";
import { chivalryBlue } from "../../../../../../cards/src/cards/blocks/chivalry.ts";

const LIFE = 20;

describe("hammer-of-havenhold (TCC028)", () => {
  it("a2: Chivalry in pitch zone → weapon attacks at 3+1=4 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [hammerOfHavenhold],
        hand: [],
        pitch: [chivalryBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    expect(Bravo.zone("pitch")).toContain(chivalryBlue.canonicalId);

    Bravo.activate(hammerOfHavenhold);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 4);
  });

  it("a2 boundary: non-Chivalry card in pitch → weapon stays at 3 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [hammerOfHavenhold],
        hand: [],
        pitch: [rattleBonesRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(hammerOfHavenhold);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 3);
  });
});
