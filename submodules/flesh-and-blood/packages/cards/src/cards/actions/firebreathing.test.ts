import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { firebreathingRed } from "./firebreathing.ts";

describe("Firebreathing (EVR157) AAA", () => {
  it("happy: attacks at printed 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [firebreathingRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(firebreathingRed);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("happy: while attacking, the Instant grants +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [firebreathingRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(firebreathingRed);
    game.advanceCombatTo("reaction");
    Dash.activate(firebreathingRed, {
      abilityId: `${firebreathingRed.canonicalId}:instantFirebreathingGains1ActivateAbilityOnlyWhileFirebreathing`,
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: the Instant cannot activate after combat closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [firebreathingRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(firebreathingRed);
    game.closeCombat();
    expect(Dash.expectActivationRejected(firebreathingRed).errorCode).toBe(
      "invalid_activation_source",
    );
  });

  it("timing: printed 3{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [firebreathingRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(firebreathingRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabCard(Dash, firebreathingRed).toBeIn("graveyard");
  });
});
