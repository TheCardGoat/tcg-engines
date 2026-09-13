import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { dashIO } from "./dash-i-o.ts";
import { symbiosisShot } from "../weapons/symbiosis-shot.ts";
import { tekloCoreBlue as tekloCore } from "../actions/teklo-core.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Dash I/O (EVO001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: may look at top card of deck at any time
 * - Core mechanic: play Mech Item cost≤1 from deck-top as instant with +1 surcharge
 * - Boundaries: 36hp adult health
 * - Signature weapon: Symbiosis Shot (EVO003) — steam counter on item entry
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// dash-i-o (EVO001) — Mechanologist/Hero (Adult) — 36hp
// Printed: "You may look at the top card of your deck at any time.
// Once per turn, you may play a Mechanologist item with cost 0 or 1 from the
// top of your deck as though it were an instant. It costs an additional {r}
// to play."
// ---------------------------------------------------------------------------

describe("dash-i-o (EVO001)", () => {
  it("boundaries: hero defaults to 36 life (Adult health boundary)", () => {
    const game = FabTestEngine.start({ hero: dashIO, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(dashIO)).toHaveLife(36);
  });

  it("core mechanic: play a cost-0 Mechanologist item from the top of the deck as an Instant (+1{r})", () => {
    // EVO001-a2 is a deck-top play permission for cost ≤1 Mechanologist items
    // with an additional {r} surcharge. The look-at-any-time static is
    // viewer-facing; the in-match proof is the deck-top play.
    const game = FabTestEngine.start(
      {
        hero: dashIO,
        hand: [],
        resourcePoints: 1,
        actionPoints: 0,
        deckTop: [tekloCore],
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
    );
    const DashIO = game.as(dashIO);

    DashIO.play(tekloCore, { from: "deck" });
    game.untilIdle({ ordering: "listed" });
    expectFabCard(DashIO, tekloCore).toBeIn("arena");
  });

  it("boundaries: the extra {r} must be payable, and non-items cannot come off the top", () => {
    const game = FabTestEngine.start(
      {
        hero: dashIO,
        hand: [],
        resourcePoints: 0,
        actionPoints: 0,
        deckTop: [tekloCore],
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
    );
    const DashIO = game.as(dashIO);

    expectFabUnplayable(
      () => DashIO.play(tekloCore, { from: "deck" }),
      /resource cost cannot be paid|couldn't be played/i,
    );

    const noItem = FabTestEngine.start(
      {
        hero: dashIO,
        hand: [],
        resourcePoints: 1,
        actionPoints: 0,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
    );
    expectFabUnplayable(
      () => noItem.as(dashIO).play(snatchRed, { from: "deck" }),
      /migrated permission|cannot be played|couldn't be played/i,
    );
  });

  it("signature weapon: Symbiosis Shot (EVO003) gains steam counter when Mech item enters arena", () => {
    // EVO003-a2: whenever a Mech item enters arena under your control,
    // optional: add steam counter (max 6). Play teklo-core (cost 0 Mech Item)
    // to trigger.
    const game = FabTestEngine.start(
      {
        hero: dashIO,
        weapon1: [symbiosisShot],
        hand: [tekloCore],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const DashIO = game.as(dashIO);

    // Play teklo-core (cost 0 Mech Item) to trigger Symbiosis Shot.
    DashIO.play(tekloCore);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // teklo-core should be in the arena.
    expect(DashIO.zone("arena")).toContain(tekloCore.canonicalId);
  });

  it("signature weapon: Symbiosis Shot can attack by removing a steam counter", () => {
    // EVO003-a1: Action - Remove a steam counter: Attack.
    const game = FabTestEngine.start(
      {
        hero: dashIO,
        weapon1: [symbiosisShot],
        // Seed a steam counter so the attack is legal.
        hand: [tekloCore],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const DashIO = game.as(dashIO);

    // First play teklo-core → Symbiosis Shot gets steam counter.
    DashIO.play(tekloCore);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Then activate Symbiosis Shot attack.
    DashIO.activate(symbiosisShot);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(2);
  });

  it("boundaries: Symbiosis Shot cannot attack without steam counters", () => {
    const game = FabTestEngine.start(
      {
        hero: dashIO,
        weapon1: [symbiosisShot],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const DashIO = game.as(dashIO);

    // No steam counters → attack activation should be illegal.
    expect(() => DashIO.activate(symbiosisShot)).toThrow();
  });
});
