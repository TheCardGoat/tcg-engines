import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { grimFeastRed } from "../actions/grim-feast.ts";
import { sevenSinNebula } from "./seven-sin-nebula.ts";

/**
 * Seven-Sin Nebula (IAR108) — Shadow Runeblade 2H Sword.
 *
 * Printed: Action - {r}, {t}: Attack. Activate this only if you've played a
 * card from a banished zone this turn.
 * When this hits a hero, create a Runechant token.
 */

describe("Seven-Sin Nebula (IAR108) AAA", () => {
  it("happy: a real card played from banished unlocks the attack and its hit creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        weapon1: [sevenSinNebula],
        banished: [grimFeastRed],
        // Grim Feast's separate from-banished discount gap currently charges
        // its full 3; keep 1 more resource for Seven-Sin's attack cost.
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(grimFeastRed, { from: "banished" });
    game.helpers.resolveUntilIdle();
    Chane.activateAttack(sevenSinNebula);

    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Chane.zone("arena").some((id) => /runechant/i.test(String(id)))).toBe(true);
  });

  it("boundary: cold, the activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        weapon1: [sevenSinNebula],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.expectActivationRejected(sevenSinNebula);
    expect(Chane.zone("weapon1")).toContain(sevenSinNebula.canonicalId);
  });
});
