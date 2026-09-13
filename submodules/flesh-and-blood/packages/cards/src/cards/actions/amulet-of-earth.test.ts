import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { briar } from "../heroes/briar.ts";
import { stirTheWildwoodRed } from "./stir-the-wildwood.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { amuletOfEarthBlue } from "./amulet-of-earth.ts";

/**
 * Amulet of Earth (ELE143) — printed:
 * "Go again
 * Instant - Destroy Amulet of Earth: Attack action cards you control gain
 * +1{p} and +1{d} this turn. Activate this ability only if you have Earth
 * fused this turn."
 *
 * Mode B (fab-rules): CR 1.13 instants cost no action point and may be
 * activated during the reaction window by their controller; CR 5.2
 * destroy-self is paid at activation; CR 8.3.17 fusion — revealing an Earth
 * card as the fuse cost of an Earth-fusion card marks "Earth fused this
 * turn"; the +1{p}/+1{d} modification applies to attack action cards the
 * controller owns on the chain at resolution and lasts until end of turn.
 * (Stir the Wildwood's own fused rider is +2{p}, folded into the math.)
 */
describe("Amulet of Earth (ELE143) AAA", () => {
  it("happy: with Earth fused this turn, destroy the amulet mid-chain for +1{p} and +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [amuletOfEarthBlue, stirTheWildwoodRed, weaveEarthRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Play the item (cost 0, go again refunds the action point).
    Briar.play(amuletOfEarthBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, amuletOfEarthBlue).toBeIn("arena");

    // Earth-fusion attack with a revealed Earth card: 5{p} base +2{p} fused.
    Briar.attackWith(stirTheWildwoodRed, { fuse: true, fuseCards: [weaveEarthRed] });
    game.advanceCombatTo("reaction");
    expectCombat(game).toHaveAttackPower(7);

    // Instant destroy: the on-chain attack action gains +1{p} and +1{d}.
    Briar.activate(amuletOfEarthBlue);
    game.passBoth();
    expectFabCard(Briar, amuletOfEarthBlue).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Briar, stirTheWildwoodRed).toHaveDefense(4);

    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(12);
    expectFabCard(Briar, weaveEarthRed).toBeIn("hand");
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: without Earth fused this turn the instant cannot be activated at all", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [amuletOfEarthBlue, stirTheWildwoodRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(amuletOfEarthBlue);
    game.helpers.resolveUntilIdle();

    // Earth attack played unfused: no Earth fusion exists this turn.
    Briar.attackWith(stirTheWildwoodRed);
    game.advanceCombatTo("reaction");
    expectCombat(game).toHaveAttackPower(5);

    Briar.expectActivationRejected(amuletOfEarthBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Briar, amuletOfEarthBlue).toBeIn("arena");
    expect(Dash.life()).toBe(15);
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("timing: the +1{p} boost expires at end of turn — next turn's attack hits for base power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [
          amuletOfEarthBlue,
          stirTheWildwoodRed,
          weaveEarthRed,
          heartOfFyendalBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(amuletOfEarthBlue);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(stirTheWildwoodRed, { fuse: true, fuseCards: [weaveEarthRed] });
    game.advanceCombatTo("reaction");
    Briar.activate(amuletOfEarthBlue);
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(12);

    game.helpers.passPriorityTo(Briar);
    Briar.endTurn();
    game.as(dash).endTurn();

    // Next turn: the amulet is gone and its boost expired — base 4{p} only.
    game.helpers.untilIdle();
    Briar.attackWith(brutalAssaultBlue, { pitch: [heartOfFyendalBlue] });
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Briar, amuletOfEarthBlue).toBeIn("graveyard");
    expect(Dash.life()).toBe(8);
  });
});
