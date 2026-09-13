import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { channelMountIsenBlue as channelMountIsen } from "../actions/channel-mount-isen.ts";
import { waningMoon } from "../weapons/waning-moon.ts";
import { alluvionConstellas } from "./alluvion-constellas.ts";

/**
 * Alluvion Constellas (UPR166) — printed clauses under test:
 *
 * a1 "The first time Alluvion Constellas prevents arcane damage each turn, if it
 *     has less than 4 energy counters, you may put an energy counter on it."
 * a2 "Instant - Remove 2 energy counters from Alluvion Constellas: The next
 *     staff ability you activate this turn costs {r}{r}{r} less."
 * kb  "Arcane Barrier 1"
 *
 * Module fixed (FIX-5, plan §5): a2 was encoded as modify-numeric property
 * "cost", but activation quotes never consult the object's evaluated Cost, so
 * the printed discount could never land. Re-encoded to the engine's one-shot
 * activation-discount primitive (modify-activation-cost + appliesTo.next
 * latched on "activate" events, DTD004/CRU081 golden), the trio below proves
 * the discount end-to-end, the 2-counter cost boundary, and the this-turn
 * expiry.
 */

describe("Alluvion Constellas (UPR166) AAA", () => {
  it("happy: Arcane Barrier 1 prevents 1 and the a1 optional accrues an energy counter", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, resourcePoints: 1, chest: [alluvionConstellas], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.chooseOptions(Dash.expectDecision("option").options[0]!.id);
    // The a1 optional surfaces only once the prevent process has resolved.
    game.passBoth();
    Dash.accept(); // put an energy counter

    expectFabPlayer(Dash).toHaveLife(16); // 5 arcane - 1 prevented
    expectFabPlayer(Dash).toHaveResourceCount(0); // barrier payment
    expectFabCard(Dash, alluvionConstellas).toHaveCounters(1, "energy");
  });

  it("boundary: at 4 energy counters the accrual gate stays closed", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        resourcePoints: 1,
        chest: [{ card: alluvionConstellas, state: { namedCounters: { energy: 4 } } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.chooseOptions(Dash.expectDecision("option").options[0]!.id);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabCard(Dash, alluvionConstellas).toHaveCounters(4, "energy");
  });

  it("timing: declining the a1 optional still consumes the once-per-turn limit", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, resourcePoints: 2, chest: [alluvionConstellas], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    // First prevention this turn: decline the accrual.
    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.chooseOptions(Dash.expectDecision("option").options[0]!.id);
    game.passBoth();
    Dash.decline();
    expectFabCard(Dash, alluvionConstellas).toHaveCounters(0, "energy");
    expectFabPlayer(Dash).toHaveLife(16);

    // Second prevention this turn: no further a1 optional is offered.
    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.chooseOptions(Dash.expectDecision("option").options[0]!.id);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Dash, alluvionConstellas).toHaveCounters(0, "energy");
  });

  it("happy (a2): the next staff ability this turn costs {r}{r}{r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [channelMountIsen],
        weapon1: [waningMoon],
        chest: [{ card: alluvionConstellas, state: { namedCounters: { energy: 2 } } }],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(channelMountIsen); // non-attack action: opens the Waning Moon gate
    game.untilIdle();
    Blaze.activate(alluvionConstellas); // Instant — remove 2 energy counters
    game.passBoth();
    expectFabCard(Blaze, alluvionConstellas).toHaveCounters(0, "energy");

    Blaze.activate(waningMoon); // {r}{r} staff ability — discounted to 0
    Blaze.target(Dash);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18); // 2 arcane on own turn
    // Printed "{r}{r}{r} less": the {r}{r} staff cost is fully covered — no
    // resources were spent (module fixed to modify-activation-cost, FIX-5).
    expectFabPlayer(Blaze).toHaveResourceCount(2);
  });

  it("boundary (a2): fewer than 2 energy counters - the activation is rejected and the staff pays full price", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [channelMountIsen],
        weapon1: [waningMoon],
        chest: [{ card: alluvionConstellas, state: { namedCounters: { energy: 1 } } }],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(channelMountIsen);
    game.untilIdle();

    // The remove-2-counters cost cannot be paid from a single counter: the
    // activation is rejected and the counter is kept.
    expect(() => Blaze.activate(alluvionConstellas)).toThrow();
    expectFabCard(Blaze, alluvionConstellas).toHaveCounters(1, "energy");

    Blaze.activate(waningMoon); // no discount latched - full {r}{r}
    Blaze.target(Dash);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Blaze).toHaveResourceCount(0);
  });

  it("timing (a2): the discount expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [channelMountIsen, channelMountIsen],
        weapon1: [waningMoon],
        chest: [{ card: alluvionConstellas, state: { namedCounters: { energy: 2 } } }],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    // Arm the discount, but let the turn cycle without using it.
    Blaze.play(channelMountIsen);
    game.untilIdle();
    Blaze.activate(alluvionConstellas);
    game.passBoth();
    expectFabCard(Blaze, alluvionConstellas).toHaveCounters(0, "energy");

    Blaze.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    // Next turn: the gate re-opens (second non-attack action), the once-per-
    // turn limit resets, but the bank is empty — the full {r}{r} is now
    // unpayable. Had the discount survived the turn boundary, the cost would
    // be 0 and the activation would be accepted: the payment rejection is the
    // expiry proof.
    Blaze.play(channelMountIsen);
    game.untilIdle();
    expect(() => Blaze.activate(waningMoon)).toThrow(/The activation payment cannot be paid/);
    expectFabCard(Blaze, alluvionConstellas).toHaveCounters(0, "energy");
  });
});
