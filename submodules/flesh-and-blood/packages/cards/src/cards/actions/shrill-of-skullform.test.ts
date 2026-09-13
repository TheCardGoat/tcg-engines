import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { channelMountIsenBlue } from "./channel-mount-isen.ts";
import { shrillOfSkullformRed } from "./shrill-of-skullform.ts";

/**
 * Shrill of Skullform (EVR116) — Runeblade Action-Attack, cost 2, 4{p}, 3{d}.
 *
 * Printed: "If you have played or created an aura this turn, Shrill of
 * Skullform gains +3{p}."
 */

describe("Shrill of Skullform (EVR116) AAA", () => {
  it("happy: after playing an aura this turn, the attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelMountIsenBlue, shrillOfSkullformRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(channelMountIsenBlue);
    game.helpers.resolveUntilIdle();

    Briar.must.playAttack(shrillOfSkullformRed);
    game.advanceCombatTo("defend");
    // Base 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: with no aura played this turn the attack stays at 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [shrillOfSkullformRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.must.playAttack(shrillOfSkullformRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +3{p} carries into the damage step", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelMountIsenBlue, shrillOfSkullformRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(channelMountIsenBlue);
    game.helpers.resolveUntilIdle();
    Briar.must.playAttack(shrillOfSkullformRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13);
  });
});
