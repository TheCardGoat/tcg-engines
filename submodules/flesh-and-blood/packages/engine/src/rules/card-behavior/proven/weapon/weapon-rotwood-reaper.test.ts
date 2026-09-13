/**
 * FLR002 Rotwood Reaper — Earth Runeblade Sword 2H — power 2.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}: Attack
 *   a2: If you've played or created an aura this turn, this gets +2{p}.
 *
 * Reasoning (hand-authored):
 * 1. a1 (2{r} 2-power OPT attack) proven @ weapon-opt-attack-wave2; this
 *    file proves the a2 +2-power gate.
 * 2. a2: continuous static gated on NEW engine fact
 *    `playerPlayedOrCreatedAuraThisTurn` (play events on Aura-typed cards).
 *    NEW has-status branch `played-or-created-aura-this-turn`. The
 *    continuous condition evaluates via resolveSubjects → evaluateCondition
 *    (atom.condition path).
 * 3. Vehicle: Channel Mount Isen (AJV017, types Ice/Action/Aura, cost-0,
 *    go again) — playing it stamps the fact → Rotwood 2+2 = 4.
 *    Boundary: Rotwood alone → 2.
 *
 * Status: ✅ a2 played-or-created-aura → +2{p} proven; no-aura boundary.
 * NEW reusable engine fact for "played/created Aura this turn" family.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { rotwoodReaper } from "../../../../../../cards/src/cards/weapons/rotwood-reaper.ts";
import { channelMountIsenBlue } from "../../../../../../cards/src/cards/actions/channel-mount-isen.ts";

const LIFE = 40;

describe("rotwood-reaper (FLR002)", () => {
  it("a2: played an aura → +2{p} (2+2=4)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [rotwoodReaper],
        hand: [channelMountIsenBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Channel Mount Isen (Aura action) → stamps fact.
    Bravo.play(channelMountIsenBlue);
    game.helpers.resolveRestOfCombat(); // no combat (non-attack)

    // Rotwood: a2 condition met → 2+2 = 4
    Bravo.activate(rotwoodReaper);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 4);
  });

  it("a2 boundary: no aura → base power only (2)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [rotwoodReaper],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(rotwoodReaper);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 2);
  });
});
