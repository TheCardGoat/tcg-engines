import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { roaringBeamYellow } from "./roaring-beam.ts";

/**
 * Roaring Beam (PEN178) — Light Warrior Attack Reaction, cost 0.
 * Printed: Create a Courage token. If there are no cards in your soul,
 * return this to its owner's hand, then charge your soul.
 */

describe("Roaring Beam (Yellow) (PEN178) AAA", () => {
  it("happy: creates Courage and, with an empty soul, returns to hand then charges", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [brutalAssaultBlue, roaringBeamYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Boltyn.play(roaringBeamYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
    expectFabCard(Boltyn, roaringBeamYellow).toBeIn("hand");
  });

  it("boundary: with a card already in soul, this stays in graveyard and does not charge", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [brutalAssaultBlue, roaringBeamYellow],
        soul: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Boltyn.play(roaringBeamYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
    expectFabCard(Boltyn, roaringBeamYellow).toBeIn("graveyard");
  });

  it("boundary: cannot be played outside the reaction window", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [roaringBeamYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    expect(() => Boltyn.play(roaringBeamYellow)).toThrow();
    expectFabCard(Boltyn, roaringBeamYellow).toBeIn("hand");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
  });
});
