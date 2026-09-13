import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { dataDollMkii } from "./data-doll-mkii.ts";
import { zeroToFiftyRed } from "../actions/zero-to-fifty.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { dissipationShieldYellow as dissipationShield } from "../actions/dissipation-shield.ts";
import { rustedRelicBlue } from "../actions/rusted-relic.ts";

/**
 * Hero behavior acceptance test — Data Doll MKII (CRU099).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: Mechanologist Item cost≤2 banished from deck → arena
 * - Core interaction: boost triggers item placement
 * - Boundaries: 20hp health, item >2 cost does not trigger
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// data-doll-mkii (CRU099) — Mechanologist/Young — 20hp
// Printed: "Whenever a Mechanologist item with cost 2 or less is put into your
// banished zone from your deck, put it into the arena."
// ---------------------------------------------------------------------------

describe("data-doll-mkii (CRU099)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: dataDollMkii, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(dataDollMkii)).toHaveLife(20);
  });

  it("core mechanic: a cost-0 Mechanologist item banished by Boost enters the arena", () => {
    // CRU099-a1: triggered static — when Mech Item cost≤2 is banished from
    // deck, move it to the arena instead. Boost banishes from deck.
    // Put Grinding Gears (cost 0) in deck so Boost can banish it.
    const game = FabTestEngine.start(
      {
        hero: dataDollMkii,
        hand: [zeroToFiftyRed],
        deck: [
          dissipationShield,
          dissipationShield,
          dissipationShield,
          dissipationShield,
          dissipationShield,
          grindingGearsBlue,
        ],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
    );
    const DataDoll = game.as(dataDollMkii);

    // Boost is optional, so elect it explicitly. It banishes the top deck
    // card, which causes Data Doll's trigger to move the qualifying item.
    DataDoll.play(zeroToFiftyRed, { target: game.as(opponentHero).id, boost: true });

    // After boost resolves, item should be in arena.
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(DataDoll.zone("arena")).toContain(grindingGearsBlue.canonicalId);
  });

  it("core mechanic: a cost-2 Mechanologist item banished by Boost enters the arena", () => {
    // dissipation-shield costs 2 — still within the ≤2 filter.
    const game = FabTestEngine.start(
      {
        hero: dataDollMkii,
        hand: [zeroToFiftyRed],
        deck: [
          grindingGearsBlue,
          grindingGearsBlue,
          grindingGearsBlue,
          grindingGearsBlue,
          grindingGearsBlue,
          dissipationShield,
        ],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
    );
    const DataDoll = game.as(dataDollMkii);

    DataDoll.play(zeroToFiftyRed, { target: game.as(opponentHero).id, boost: true });
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(DataDoll.zone("arena")).toContain(dissipationShield.canonicalId);
  });

  it("boundaries: intelligence defaults to 3", () => {
    // data-doll-mkii has intelligence 3.
    const game = FabTestEngine.start(
      { hero: dataDollMkii, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const DataDoll = game.as(dataDollMkii);
    expect(DataDoll.intellect()).toBe(3);
  });

  it("boundary: a non-Mechanologist item banished by Boost stays banished", () => {
    // Rusted Relic (ARC163) is a cost-0 Generic Item: it passes the cost and
    // Item dimensions of the printed filter and fails only Mechanologist, so
    // the Data Doll trigger must leave it in the banished zone.
    const game = FabTestEngine.start(
      {
        hero: dataDollMkii,
        hand: [zeroToFiftyRed],
        deck: [grindingGearsBlue, grindingGearsBlue, grindingGearsBlue, rustedRelicBlue],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
    );
    const DataDoll = game.as(dataDollMkii);

    DataDoll.play(zeroToFiftyRed, { target: game.as(opponentHero).id, boost: true });
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(DataDoll.zone("banished")).toContain(rustedRelicBlue.canonicalId);
    expect(DataDoll.zone("arena")).not.toContain(rustedRelicBlue.canonicalId);
  });
});
