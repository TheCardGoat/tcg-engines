import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cerebellumProcessorBlue } from "../actions/cerebellum-processor.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { maxxNitro } from "../heroes/maxx-nitro.ts";
import { banksy } from "./banksy.ts";

/**
 * Banksy (EVO006) — Mechanologist Weapon Wrench 2H Maxx specialization, 3{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack. Activate this ability only if you've
 *   cranked this turn.
 *   When this hits a hero, put a steam counter on an item you control with
 *   crank.
 */

describe("Banksy (EVO006) AAA", () => {
  it("boundary: activating before cranking this turn is illegal", () => {
    // Arrange — no card has been cranked yet this turn.
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [banksy],
        hand: [cerebellumProcessorBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      // Partial assist config mirrors the proven crank gate (keyword-crank):
      // the manual harness answers the entry crank without stamping the flag.
      { autoPassPriority: false, autoPitch: false },
    );
    const Maxx = game.as(maxxNitro);

    // Act / Assert — the once-per-turn activate gate is unsatisfied.
    expect(() => Maxx.activateAttack(banksy)).toThrow();
  });

  it("happy: after cranking, the hit puts a steam counter on the crank item", () => {
    // Arrange — Cerebellum Processor enters with two steam counters; the
    // explicit crank removes one and grants an action point back.
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [banksy],
        hand: [cerebellumProcessorBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      // Partial assist config mirrors the proven crank gate (keyword-crank):
      // the manual harness answers the entry crank without stamping the flag.
      { autoPassPriority: false, autoPitch: false },
    );
    const Maxx = game.as(maxxNitro);
    const Dash = game.as(dash);

    // Act — crank first (the entry decision removes one steam and grants an
    // action point back once the play resolves), then Banksy is legal to swing.
    Maxx.play(cerebellumProcessorBlue);
    Maxx.must.passPriority();
    Dash.must.passPriority();
    expectFabCard(Maxx, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Maxx, cerebellumProcessorBlue).toHaveCounters(1, "steam");
    Maxx.activateAttack(banksy);
    game.closeCombat({ ordering: "listed" });

    // Assert — unblocked hit re-arms the item: 2 − 1 + 1 = 2 steam.
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Maxx, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Maxx, cerebellumProcessorBlue).toHaveCounters(2, "steam");
    expectFabPlayer(Maxx).toHaveAP(0); // play −1, crank +1, attack −1
  });

  it("boundary: a fully defended miss adds no steam counter", () => {
    // Arrange — two 2{d} blocks (4{d}) absorb the whole 3{p} swing.
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [banksy],
        hand: [cerebellumProcessorBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false },
    );
    const Maxx = game.as(maxxNitro);
    const Dash = game.as(dash);

    // Act — crank, swing into a full block (4{d} vs 3{p}).
    Maxx.play(cerebellumProcessorBlue);
    Maxx.must.passPriority();
    Dash.must.passPriority();
    Maxx.activateAttack(banksy);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    // Assert — no hit event, so the steam counter never lands.
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Maxx, cerebellumProcessorBlue).toHaveCounters(1, "steam");
  });
});
