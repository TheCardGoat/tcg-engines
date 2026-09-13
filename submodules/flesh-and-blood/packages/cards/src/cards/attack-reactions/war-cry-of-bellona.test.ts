import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { orbitoclast } from "../weapons/orbitoclast.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { serBoltynBreakerOfDawn } from "../heroes/ser-boltyn-breaker-of-dawn.ts";
import { warCryOfBellonaYellow } from "./war-cry-of-bellona.ts";

/**
 * War Cry of Bellona (HNT258) — Light Warrior Attack Reaction yellow.
 *
 * Printed Instant: Discard this, banish X cards from your soul: The next time
 * target weapon deals X or less damage to you this turn, deal that much damage
 * to its controller and that damage can't be prevented.
 */

describe("War Cry of Bellona (HNT258) AAA", () => {
  it("happy: the chosen weapon's qualifying damage is reflected and can't be prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [nerveScalpel],
        arena: [spectralShield],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: serBoltynBreakerOfDawn,
        hand: [warCryOfBellonaYellow],
        soul: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    Dash.pass();
    Boltyn.activate(warCryOfBellonaYellow);
    Boltyn.chooseNumeric(1);
    Boltyn.targetRequired(nimblismBlue);
    Boltyn.targetRequired(nerveScalpel);
    game.passBoth();

    Dash.activateAttack(nerveScalpel);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Boltyn).toHaveLife(19);
    expectFabPlayer(Dash).toHaveLife(19);
    // CR 6.4.10h: Ward still applies and pays its destroy cost, but prevents 0.
    expectFabToken(game, "spectral-shield").toHaveCount(0);
    expectFabCard(Boltyn, warCryOfBellonaYellow).toBeIn("graveyard");
    expectFabCard(Boltyn, nimblismBlue).toBeBanished();
  });

  it("boundary: X=0 is legal, but 1 damage does not satisfy X or less", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [nerveScalpel],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: serBoltynBreakerOfDawn,
        hand: [warCryOfBellonaYellow],
        soul: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    Dash.pass();
    Boltyn.activate(warCryOfBellonaYellow);
    game.passBoth();

    Dash.activateAttack(nerveScalpel);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Boltyn).toHaveLife(19);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: another weapon's damage neither triggers nor consumes the chosen-weapon latch", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [nerveScalpel],
        weapon2: [orbitoclast],
        resourcePoints: 4,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: serBoltynBreakerOfDawn,
        hand: [warCryOfBellonaYellow],
        soul: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    Dash.pass();
    Boltyn.activate(warCryOfBellonaYellow);
    Boltyn.chooseNumeric(1);
    Boltyn.targetRequired(nimblismBlue);
    Boltyn.targetRequired(nerveScalpel);
    game.passBoth();

    Dash.activateAttack(orbitoclast);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Boltyn).toHaveLife(19);
    expectFabPlayer(Dash).toHaveLife(20);

    Dash.activateAttack(nerveScalpel);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Boltyn).toHaveLife(18);
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
