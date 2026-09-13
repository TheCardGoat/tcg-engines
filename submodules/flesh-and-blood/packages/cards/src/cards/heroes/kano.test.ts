import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { kano } from "./kano.ts";
import { crucibleOfAetherweave } from "../weapons/crucible-of-aetherweave.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { snatchRed } from "../actions/snatch.ts";
import { zapBlue } from "../actions/zap.ts";

/**
 * Hero behavior acceptance test — kano (ARC114).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: Instant {r}{r}{r} — look top, may banish non-attack action,
 *   may play it this turn as instant
 * - Core interaction: banished non-attack action playable from banish as instant
 * - Boundaries: attack action on top not banished, 15hp Young health
 *
 * Signature weapon: Crucible of Aetherweave (ARC115)
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// kano (ARC114) — Wizard/Young — 15hp
// Printed: "Instant - {r}{r}{r}: Look at the top card of your deck. If it's a
// 'non-attack' action card, you may banish it. If you do, you may play it this
// turn as though it were an instant."
// ---------------------------------------------------------------------------

describe("kano (ARC114)", () => {
  it("boundaries: hero defaults to 15 life (Young low-health boundary)", () => {
    const game = FabTestEngine.start({ hero: kano, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(kano)).toHaveLife(15);
  });

  it("core mechanic: pay 3 Instant — look top; may banish a non-attack action", () => {
    // Deck top is tome-of-fyendal (Generic Action, not Attack).
    const game = FabTestEngine.start(
      {
        hero: kano,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, tomeOfFyendalYellow],
        resourcePoints: 3,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Kano = game.as(kano);

    // Act — fluent activate + resolve.
    Kano.activate(kano);
    game.passBoth();

    // Accept optional banish (and nested optional play).
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.passBoth();

    // Assert — non-attack action banished; 3 resources spent.
    expect(Kano.zone("banished")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(Kano.resourcePoints()).toBe(0);
  });

  it("boundaries: attack action on top of deck is not banished", () => {
    // snatch-red is Attack Action; excludeSubtypes Attack filters it out.
    const game = FabTestEngine.start(
      {
        hero: kano,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        resourcePoints: 3,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Kano = game.as(kano);

    Kano.activate(kano);
    game.passBoth();

    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    game.passBoth();

    // Assert — attack stays in deck (not banished).
    expect(Kano.zone("banished")).not.toContain(snatchRed.canonicalId);
  });

  it("core interaction: after banishing, may play the non-attack action from banished this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, tomeOfFyendalYellow],
        resourcePoints: 4,
        hand: [],
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Kano = game.as(kano);

    Kano.activate(kano);
    game.passBoth();

    // Accept the optional banish, then the optional this-turn play permission.
    Kano.chooseBoolean(true);
    Kano.chooseBoolean(true);

    expect(Kano.zone("banished")).toContain(tomeOfFyendalYellow.canonicalId);

    // Play the banished card as though it were an instant this turn.
    game.helpers.passPriorityTo(Kano);

    Kano.play(tomeOfFyendalYellow, { from: "banished" });
    game.passBoth();

    // Assert — card left banish (resolved).
    expect(Kano.zone("banished")).not.toContain(tomeOfFyendalYellow.canonicalId);
  });

  it("signature weapon: Crucible of Aetherweave (ARC115) can be activated to buff next arcane damage", () => {
    // Crucible of Aetherweave — Once per Turn Instant — {r}:
    // The next card you play this turn that deals arcane damage deals +1.
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [crucibleOfAetherweave],
        hand: [zapBlue],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Kano = game.as(kano);

    // Act — fluent weapon activation.
    Kano.activate(crucibleOfAetherweave);
    game.passBoth();

    expect(Kano.resourcePoints()).toBe(0);
    Kano.play(zapBlue, { target: game.as(opponentHero).id });
    game.passBoth();
    expectFabPlayer(game.as(opponentHero)).toHaveLife(18);
  });
});
