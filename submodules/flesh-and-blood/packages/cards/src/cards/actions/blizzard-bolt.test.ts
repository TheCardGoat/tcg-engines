import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { lexi } from "../heroes/lexi.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { blizzardBoltRed } from "./blizzard-bolt.ts";

/**
 * Blizzard Bolt (ELE044) — printed:
 * "Ice Fusion
 * If Blizzard Bolt was fused, whenever an attack deals damage to a hero this
 * turn, create a Frostbite token under their control."
 *
 * Mode B (fab-rules): CR 8.3.17 fusion is an optional additional cost —
 * reveal an Ice card from hand; the rider schedules at play resolution only
 * when fused (CR 8.3.17c "was fused"); the window is every attack dealing
 * damage to a hero THIS TURN (multi-fire, turn-scoped); the token is created
 * under the control of the hero who was dealt the damage. Arrows fire only
 * from arsenal with a bow (CR 8.2.6a) and pay their printed cost the same
 * turn.
 *
 * Turn scoping (W3-FIX4 2026-08-18, plan §5 defect row): the module now
 * authors the engine-supported multi-fire shape `policy: { kind: "windowed",
 * duration: "this-turn", matching: "every" }` (golden: AIO004 heavy-industry
 * power plant), so the rider re-fires on EVERY damaging attack this turn and
 * expires at turn end. The timing test asserts both boundaries directly.
 */

describe("Blizzard Bolt (ELE044) AAA", () => {
  it("happy: fused from arsenal — the hit deals 5 and creates a Frostbite under the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [blizzardBoltRed],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    // Ice Fusion paid by revealing an Ice card (it stays in hand, CR 8.3.17).
    Lexi.attackWith(blizzardBoltRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    // The delayed clause fires at its printed future point — damage dealt.
    expect(Dash.zone("arena")).toContain("token:frostbite");
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
    expectFabCard(Lexi, weaveIceRed).toBeIn("hand");
  });

  it("boundary: unfused, the bolt deals its damage but creates no Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [blizzardBoltRed],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    // Declining the optional fusion cost leaves the rider unregistered.
    Lexi.attackWith(blizzardBoltRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expect(Dash.zone("arena")).not.toContain("token:frostbite");
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
  });

  it("timing: nothing at play time, the token lands at damage — then re-fires on a second attack and expires at turn end", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [blizzardBoltRed],
        hand: [
          weaveIceRed,
          heartOfFyendalBlue,
          heartOfFyendalBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    // The delay itself: at the reaction step nothing has fired yet.
    Lexi.attackWith(blizzardBoltRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.advanceCombatTo("reaction");
    expect(Dash.zone("arena")).not.toContain("token:frostbite");
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);

    // Printed "whenever ... this turn" re-fires on the second damaging
    // attack: a second Frostbite lands (count 2, life 11).
    Lexi.attackWith(brutalAssaultBlue, { pitch: [heartOfFyendalBlue] });
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(11);
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 2);

    // Turn boundary: the "this turn" window has expired. Dash's end phase
    // destroys their two Frostbites (ELE111), so a next-turn damaging attack
    // must NOT mint a third (count 0 — a surviving window would re-fire and
    // leave count 1; life drops a plain 4 to 7).
    Lexi.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle({ ordering: "listed" });
    Lexi.attackWith(brutalAssaultBlue, { pitch: [heartOfFyendalBlue] });
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(7);
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
  });
});
