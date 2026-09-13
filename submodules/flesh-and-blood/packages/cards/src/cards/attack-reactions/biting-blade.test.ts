import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bitingBladeRed } from "./biting-blade.ts";

/**
 * Biting Blade (TEA008) — Warrior Attack Reaction.
 *
 * Printed: Target weapon attack gains +3{p}.
 * Reprise - If the defending hero has defended with a card from their hand
 * this chain link, weapons you control gain +1{p} until end of turn.
 */

describe("biting-blade family AAA", () => {
  it("happy: target weapon attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [bitingBladeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.passBoth();
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(bitingBladeRed);
    game.passBoth();

    // Cintari Saber base 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, bitingBladeRed).toBeIn("graveyard");
  });

  it("boundary: cannot play targeting a non-weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [bitingBladeRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Kassai.play(bitingBladeRed));
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, bitingBladeRed).toBeIn("hand");
  });

  it("timing: Reprise gives weapons you control +1{p} after a hand defense", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [bitingBladeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.activate(cintariSaber);
    game.passBoth();
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(bitingBladeRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Kassai, bitingBladeRed).toBeIn("graveyard");
  });
});
