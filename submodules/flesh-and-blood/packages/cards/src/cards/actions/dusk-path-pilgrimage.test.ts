import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { snatchRed } from "./snatch.ts";
import { duskPathPilgrimageRed } from "./dusk-path-pilgrimage.ts";

/**
 * Dusk Path Pilgrimage (BOL029) — Warrior Action, cost 1, def 3.
 *
 * Printed text (i18n, source of truth):
 * "Your next weapon attack this turn gains +3{p} and "If this hits, you may
 * attack an additional time with this weapon this turn."
 * Go again"
 *
 * /fab-rules Mode B handoff (behavior constraints):
 * - The grant attaches to the NEXT WEAPON attack this turn only: +3{p} plus
 *   an on-hit trigger granting one additional activation of that weapon
 *   (lifting its once-per-turn activation limit by one).
 * - The additional attack is optional ("you may").
 * - Go again refunds the action point spent on this non-attack action.
 *
 * Module verdict: the authored `next weapon attack` grant implements the
 * printed behavior faithfully — +3{p} arms the next WEAPON attack only, and
 * the on-hit optional lifts the weapon's once-per-turn activation limit by
 * exactly one additional activation (proven against the engine's plain
 * `activation_limit` rejection without the buff).
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("dusk-path-pilgrimage family AAA", () => {
  it("buffs the next weapon attack by +3{p}: Cintari Saber hits for 5", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [duskPathPilgrimageRed],
        arena: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: kano, hand: [], deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);
    const Kano = game.as(kano);

    Boltyn.play(duskPathPilgrimageRed);
    game.helpers.resolveUntilIdle();
    // Go again refunds the action point the 1-cost action consumed.
    expect(Boltyn.actionPoints()).toBe(2);

    Boltyn.activateAttack(cintariSaber);
    // Decline the on-hit "attack an additional time" optional: this test
    // only proves the +3{p} half of the grant.
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

    // Saber (2 base) hit for its boosted 5: Kano (young, 15 life) -> 10.
    expect(Kano.life()).toBe(10);
    expect(Boltyn.zone("graveyard")).toContain(duskPathPilgrimageRed.canonicalId);
    // Weapons persist in the arena after attacking.
    expect(Boltyn.zone("arena")).toContain(cintariSaber.canonicalId);
  });

  it("on-hit optional grants exactly one additional saber activation this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [duskPathPilgrimageRed],
        arena: [cintariSaber],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: kano, hand: [], deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);
    const Kano = game.as(kano);

    Boltyn.play(duskPathPilgrimageRed);
    game.helpers.resolveUntilIdle();
    Boltyn.activateAttack(cintariSaber);
    // Accept the printed "you may attack an additional time" optional.
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });
    expect(Kano.life()).toBe(10); // First (buffed) saber attack: 2 + 3 = 5.

    // The once-per-turn limit is lifted by one: the second activation this
    // turn is accepted and resolves at the saber's plain 2 power.
    expect(Boltyn.resourcePoints()).toBeGreaterThanOrEqual(2);
    Boltyn.activateAttack(cintariSaber);
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
    expect(Kano.life()).toBe(8); // extra saber activation at printed 2{p}

    // The grant carried count: 1 — a third activation is limit-rejected
    // even though one resource point remains for its {r} cost.
    const rejection = Boltyn.expectActivationRejected(cintariSaber);
    expect(rejection.errorCode).toBe("activation_limit");
  });

  it("boundary: an attack action played first is not buffed; the grant waits for the weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [duskPathPilgrimageRed, snatchRed],
        arena: [cintariSaber],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: kano, hand: [], deck: 6 },
      manual,
    );
    const Boltyn = game.as(boltyn);
    const Kano = game.as(kano);

    Boltyn.play(duskPathPilgrimageRed);
    game.helpers.resolveUntilIdle();
    // Snatch resolves at its plain 4 power: the +3{p} grant only arms the
    // next WEAPON attack.
    Boltyn.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
    expect(Kano.life()).toBe(11); // 15 - 4

    // The grant then lands on the saber attack: 2 base + 3 = 5.
    Boltyn.activateAttack(cintariSaber);
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
    expect(Kano.life()).toBe(6); // 15 - 4 - 5
  });
});
