import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { swordmasterSPathBlue } from "./swordmaster-s-path.ts";
import { swordmasterSPathRed } from "./swordmaster-s-path.ts";

/**
 * Swordmaster's Path (AHA025) — Warrior Action (blue).
 *
 * Printed:
 *   Your next sword attack this turn gets +1{p}.
 *   The next time you would sharpen a sword this turn, instead sharpen it an
 *   additional time.
 *   Go again
 *
 * fab-rules Mode B handoff:
 *   citations: CR 6.2 (latched modify-numeric bound to the next matching
 *     attack), CR 7.6.2 / glossary "Go again" (action point at layer/chain-link
 *     resolution), CR 8.5.58 / glossary "Sharpen" (one +1{p} counter per
 *     sharpen), CR 1.9 (replacement effects modify the sharpen event itself),
 *     CR 2.9 (power).
 *   behaviorConstraints:
 *     - The printed text has NO "Sharpen." keyword line: playing the Action
 *       sharpens nothing by itself (the module once carried an unprinted
 *       `sharpen` keyword that auto-sharpened on play — W1-FIX, plan §5).
 *     - The +1{p} latches onto the controller's NEXT sword attack this turn;
 *       a non-sword attack neither receives it nor consumes the latch.
 *     - The replacement doubles only the FIRST qualifying sword sharpen this
 *       turn (sharpen "an additional time" = one extra +1{p} counter).
 *     - Both latches are "this turn" scoped.
 *   testImplications:
 *     - After playing the Path, Zenith Blade carries 0 +1{p} counters.
 *     - Zenith Blade's attack link reads 3 base + 1 latch; 3 + 2 + 1 once a
 *       doubled sharpen has landed.
 *     - A non-sword attack stays at its base power and leaves the latch live.
 *     - Without the Path in play, a Hala sharpen places exactly 1 counter.
 *     - After the turn ends, both latches are gone (fresh sword attack base,
 *       fresh sharpen single).
 */

describe("Swordmaster's Path (AHA025) AAA", () => {
  it("happy: playing this sharpens nothing and the next sword attack gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathBlue],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.play(swordmasterSPathBlue);
    game.untilIdle();

    // Printed text sharpens nothing by itself: 0 +1{p} counters on the sword.
    expectFabCard(Hala, zenithBlade).toHaveCounters(0);
    // "Go again" refunds the action point at layer resolution.
    expectFabPlayer(Hala).toHaveAP(2);

    Hala.activateAttack(zenithBlade);
    // Zenith Blade base 3 + 1 from the latched "next sword attack" buff.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: a non-sword attack neither gains nor consumes the +1{p} latch", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathBlue, brutalAssaultBlue],
        actionPoints: 3,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.play(swordmasterSPathBlue);
    game.untilIdle();

    // Brutal Assault is a Generic action, not a sword: base 4, no +1.
    Hala.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    // The latch waited for the next SWORD attack: Zenith reads 3 + 1.
    Hala.activateAttack(zenithBlade);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("replacement: the first sword sharpen this turn happens an additional time", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathBlue],
        actionPoints: 2,
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.play(swordmasterSPathBlue);
    game.untilIdle();

    // Hala's "Action - {r}{r}{r}, {t}: Sharpen target sword you control" —
    // the sole seated sword is the forced target, so activate() drains it.
    Hala.activate(halaBladesaintOfTheVow);
    game.untilIdle();

    // One sharpen, replaced to happen an additional time: 2 +1{p} counters.
    expectFabCard(Hala, zenithBlade).toHaveCounters(2);

    // The doubled sword attack carries both counters plus the +1 latch.
    Hala.activateAttack(zenithBlade);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("contrast: without the Path, a Hala sharpen places exactly one +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activate(halaBladesaintOfTheVow);
    game.untilIdle();

    // No replacement latched: exactly one +1{p} counter (CR 8.5.58).
    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
  });

  it("timing: the +1{p} latch expires with the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathBlue, brutalAssaultBlue],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(swordmasterSPathBlue);
    Hala.activateAttack(zenithBlade);
    // Turn 1: Zenith base 3 + 1 from the latched "next sword attack" buff.
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(16);

    Hala.endTurn();
    Dash.endTurn();

    // Turn 3: the latch was "this turn" — a fresh sword attack hits for the
    // printed base 3 only (the {r} is pitched from Brutal Assault).
    Hala.activate(zenithBlade);
    game.helpers.resolveUntilIdle({ paymentCanonicalId: brutalAssaultBlue.canonicalId });
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("timing: the sharpen-replacement latch expires with the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathBlue, brutalAssaultBlue],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(swordmasterSPathBlue);
    game.untilIdle();

    Hala.endTurn();
    Dash.endTurn();

    // Turn 3: the replacement was "this turn" — a fresh sharpen is single
    // (exactly one +1{p} counter, CR 8.5.58; pitched via Brutal Assault).
    Hala.activate(halaBladesaintOfTheVow);
    game.helpers.resolveUntilIdle({ paymentCanonicalId: brutalAssaultBlue.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
  });
});

/**
 * Swordmaster's Path (AHA014) — Warrior Action (red).
 *
 * Printed:
 *   Your next sword attack this turn gets +3{p}.
 *   The next time you would sharpen a sword this turn, instead sharpen it an
 *   additional time.
 *   Go again
 *
 * fab-rules Mode B handoff:
 *   citations: CR 6.2 (latched modify-numeric bound to the next matching
 *     attack), CR 7.6.2 / glossary "Go again" (action point at layer/chain-link
 *     resolution), CR 8.5.58 / glossary "Sharpen" (one +1{p} counter per
 *     sharpen, all +1{p} counters removed at end of turn), CR 1.9 (replacement
 *     effects modify the sharpen event itself), CR 2.9 (power).
 *   behaviorConstraints:
 *     - The printed text has NO "Sharpen." keyword line: playing the Action
 *       sharpens nothing by itself (the module once carried an unprinted
 *       `sharpen` keyword that auto-sharpened on play — W1-FIX, plan §5).
 *     - The +3{p} latches onto the controller's NEXT sword attack this turn;
 *       a non-sword attack neither receives it nor consumes the latch.
 *     - The replacement doubles only the FIRST qualifying sword sharpen this
 *       turn (sharpen "an additional time" = one extra +1{p} counter).
 *     - Sharpen +1{p} counters are removed at end of turn (CR 8.5.58).
 *   testImplications:
 *     - After playing the Path, Zenith Blade carries 0 +1{p} counters.
 *     - Zenith Blade's attack link reads 3 base + 3 latch; 3 + 2 + 3 once a
 *       doubled sharpen has landed.
 *     - A non-sword attack stays at its base power and leaves the latch live.
 *     - Without the Path in play, a Hala sharpen places exactly 1 counter.
 *     - After the turn ends, the counters are gone and a fresh-turn sharpen
 *       is no longer doubled.
 */

describe("Swordmaster's Path (AHA014) AAA", () => {
  it("happy: playing this sharpens nothing and the next sword attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.play(swordmasterSPathRed);
    game.untilIdle();

    // Printed text sharpens nothing by itself: 0 +1{p} counters on the sword.
    expectFabCard(Hala, zenithBlade).toHaveCounters(0);
    // "Go again" refunds the action point at layer resolution.
    expectFabPlayer(Hala).toHaveAP(2);

    Hala.activateAttack(zenithBlade);
    // Zenith Blade base 3 + 3 from the latched "next sword attack" buff.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-sword attack neither gains nor consumes the +3{p} latch", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathRed, brutalAssaultBlue],
        actionPoints: 3,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.play(swordmasterSPathRed);
    game.untilIdle();

    // Brutal Assault is a Generic action, not a sword: base 4, no +3.
    Hala.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    // The latch waited for the next SWORD attack: Zenith reads 3 + 3.
    Hala.activateAttack(zenithBlade);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("replacement: the first sword sharpen this turn happens an additional time", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathRed],
        actionPoints: 2,
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.must.play(swordmasterSPathRed);
    game.untilIdle();

    // Hala's "Action - {r}{r}{r}, {t}: Sharpen target sword you control" —
    // the sole seated sword is the forced target, so activate() drains it.
    Hala.activate(halaBladesaintOfTheVow);
    game.untilIdle();

    // One sharpen, replaced to happen an additional time: 2 +1{p} counters.
    expectFabCard(Hala, zenithBlade).toHaveCounters(2);

    // The doubled sword attack carries both counters plus the +3 latch.
    Hala.activateAttack(zenithBlade);
    expectCombat(game).toHaveAttackPower(8);
  });

  it("contrast: without the Path, a Hala sharpen places exactly one +1{p} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activate(halaBladesaintOfTheVow);
    game.untilIdle();

    // No replacement latched: exactly one +1{p} counter (CR 8.5.58).
    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
  });

  it("timing: the +3{p} latch expires with the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathRed, brutalAssaultBlue],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(swordmasterSPathRed);
    Hala.activateAttack(zenithBlade);
    // Turn 1: Zenith base 3 + 3 from the latched "next sword attack" buff.
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(14);

    Hala.endTurn();
    Dash.endTurn();

    // Turn 3: the latch was "this turn" — a fresh sword attack hits for the
    // printed base 3 only (the {r} is pitched from Brutal Assault).
    Hala.activate(zenithBlade);
    game.helpers.resolveUntilIdle({ paymentCanonicalId: brutalAssaultBlue.canonicalId });
    expectFabPlayer(Dash).toHaveLife(11);
  });

  it("timing: the sharpen-replacement latch expires with the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [zenithBlade],
        hand: [swordmasterSPathRed, brutalAssaultBlue],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Hala.play(swordmasterSPathRed);
    game.untilIdle();

    Hala.endTurn();
    Dash.endTurn();

    // Turn 3: the replacement was "this turn" — a fresh sharpen is single
    // (exactly one +1{p} counter, CR 8.5.58; pitched via Brutal Assault).
    Hala.activate(halaBladesaintOfTheVow);
    game.helpers.resolveUntilIdle({ paymentCanonicalId: brutalAssaultBlue.canonicalId });
    expectFabCard(Hala, zenithBlade).toHaveCounters(1);
  });
});
