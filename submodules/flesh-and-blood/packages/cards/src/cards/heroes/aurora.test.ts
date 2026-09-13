import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { aurora } from "./aurora.ts";
import { starFall } from "../weapons/star-fall.ts";
import { electrifyRed as electrify } from "../actions/electrify.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Aurora (AUR001).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: Once per Turn Instant — pay {r}{r} to create an
 *   Embodiment of Lightning token, gated on having played a Lightning
 *   card this turn
 * - Core interaction: Star Fall gets +1{p} and go again after playing
 *   a Lightning card
 * - Boundaries: no Lightning card played = illegal activation,
 *   OPT limit
 *
 * Signature weapon: Star Fall (AUR002)
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// aurora (AUR001) — Elemental/Runeblade/Young — 20hp
// Printed: "Once per Turn Instant - {r}{r}: Create an Embodiment of Lightning
// token. Activate this only if you've played a Lightning card this turn."
// ---------------------------------------------------------------------------

describe("aurora (AUR001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: aurora, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(aurora)).toHaveLife(20);
  });

  it("core mechanic: pay 2 RP to create Embodiment of Lightning after playing a Lightning card", () => {
    // Arrange — Aurora with a Lightning card and enough resources.
    // electrify (ELE198) is a Lightning non-attack Action with Go Again.
    const game = FabTestEngine.start(
      {
        hero: aurora,
        hand: [electrify],
        deck: 6,
        resourcePoints: 3,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Aurora = game.as(aurora);

    // Act — play the Lightning card (costs 1 RP), then activate the ability (2 RP).
    Aurora.must.play(electrify);
    Aurora.activate(aurora);

    // Assert — Embodiment of Lightning token created, 0 RP remains (3 − 1 − 2).
    expectFabPlayer(Aurora).toHaveTokenCount("embodiment-of-lightning", 1);
    expect(Aurora.resourcePoints()).toBe(0);
  });

  it("boundaries: cannot activate without playing a Lightning card first", () => {
    // Arrange — Aurora with resources but no Lightning card played yet.
    const game = FabTestEngine.start(
      {
        hero: aurora,
        hand: [tomeOfFyendalYellow],
        deck: 6,
        resourcePoints: 3,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Aurora = game.as(aurora);

    // Act — attempt to activate the ability without playing a Lightning card.
    // Assert — the activation is rejected because the condition is not met.
    Aurora.expectActivationRejected(aurora);
  });

  it("boundaries: once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        hand: [electrify],
        deck: 6,
        resourcePoints: 5,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Aurora = game.as(aurora);

    Aurora.must.play(electrify);
    Aurora.activate(aurora);
    expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");

    // Second activation same turn must fail.
    Aurora.expectActivationRejected(aurora);
  });

  it("signature weapon boundary: without Lightning, Star Fall attacks for base 1 and has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        weapon1: [starFall],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Aurora = game.as(aurora);

    Aurora.activate(starFall);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(1).notToHaveKeyword("go-again");

    game.helpers.resolveRestOfCombat();
    expect(Aurora.actionPoints()).toBe(0);
  });

  it("signature weapon core: after Lightning, only Star Fall's attack gets +1{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        weapon1: [starFall],
        hand: [electrify],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Aurora = game.as(aurora);
    const Opponent = game.as(opponentHero);

    Aurora.must.play(electrify);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Aurora.activate(starFall);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(2).toHaveKeyword("go-again");

    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(18);
    expect(Aurora.actionPoints()).toBe(1);
  });

  it("signature weapon boundary: Lightning does not buff or grant go again to an unrelated attack", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        weapon1: [starFall],
        hand: [electrify, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Aurora = game.as(aurora);
    const Opponent = game.as(opponentHero);

    Aurora.must.play(electrify);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Aurora.attackWith(snatchRed);

    expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("go-again");

    // The Snatch hit also resolves Electrify's printed rider (3 damage) —
    // the listed ordering answers the stacked-trigger decision it opens.
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(13);
    expect(Aurora.actionPoints()).toBe(0);
  });

  it("signature weapon boundary: the Lightning condition resets before Aurora's next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: aurora,
        weapon1: [starFall],
        hand: [electrify, tomeOfFyendalYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: true },
    );
    const Aurora = game.as(aurora);
    const Opponent = game.as(opponentHero);

    Aurora.must.play(electrify);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Aurora.activate(starFall);
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(18);

    Aurora.endTurn();
    Opponent.endTurn();
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      optionals: "decline",
      entityTargets: "minimum",
      ordering: "listed",
    });

    Aurora.activate(starFall);
    Aurora.pitchFirst(); // answer the "pitch to pay for Star Fall" prompt
    game.passBoth();
    expectCombat(game).toBeOpen().toHaveAttackPower(1).notToHaveKeyword("go-again");
  });
});
