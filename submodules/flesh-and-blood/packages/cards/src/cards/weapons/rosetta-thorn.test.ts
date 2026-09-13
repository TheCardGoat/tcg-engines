import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { rosettaThorn } from "./rosetta-thorn.ts";
import { electrifyRed as electrify } from "../actions/electrify.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Weapon behavior acceptance test — Rosetta Thorn (ELE222).
 *
 * AAA trio:
 * - Happy: 1{r} attack with base power 2 and arcane 2
 * - Boundary: trigger deals 2 arcane damage when attack+non-attack condition met
 * - Timing: once per turn
 *
 * Trigger: "Whenever you attack with Rosetta Thorn, if you've played an
 * attack action card and a 'non-attack' action card this turn, deal 2 arcane
 * damage to target hero."
 *
 * Hero: Briar (ELE063) — Elemental/Runeblade/Young
 * FLUENT API ONLY.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Rosetta Thorn (ELE222) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate costs 1 resource, opens combat with power 2", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [rosettaThorn],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );

    game.as(briar).activate(rosettaThorn);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });

  // ── Trigger: 2 arcane damage on attack+non-attack condition ─────────────────

  it("happy: trigger deals 2 arcane damage when attack+non-attack condition met", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [rosettaThorn],
        hand: [electrify, snatchRed],
        resourcePoints: 5,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
    );
    const Briar = game.as(briar);
    const Opponent = game.as(dash);

    // Play non-attack action (electrify).
    Briar.must.play(electrify);

    // Play attack action (snatchRed, power 4) and resolve combat.
    Briar.must.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Electrify's printed rider ("The next time an attack action card hits a
    // hero this turn, it deals 3 damage to them") also fires on the Snatch
    // hit: 20 − 4 (snatchRed) − 3 (rider) = 13.
    expectFabPlayer(Opponent).toHaveLife(13);

    // Activate Rosetta Thorn — trigger fires on attack declaration.
    Briar.activate(rosettaThorn);
    game.passBoth();

    // Rosetta Thorn has arcane: 2, dealing 2 arcane damage on attack
    // declaration. The trigger also fires (condition met), dealing 2 more.
    // 13 − 2 (arcane on-hit) − 2 (trigger arcane) = 9.
    expectFabPlayer(Opponent).toHaveLife(9);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no trigger fires without attack+non-attack condition", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [rosettaThorn],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
    );
    const Opponent = game.as(dash);

    game.as(briar).activate(rosettaThorn);
    game.passBoth();

    // No trigger fires, but Rosetta Thorn has arcane: 2 which deals 2 arcane
    // damage on attack declaration. 20 − 2 = 18.
    expectFabPlayer(Opponent).toHaveLife(18);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: once per turn — second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [rosettaThorn],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Briar = game.as(briar);

    Briar.activate(rosettaThorn);
    game.helpers.resolveRestOfCombat();

    Briar.expectActivationRejected(rosettaThorn);
  });
});
