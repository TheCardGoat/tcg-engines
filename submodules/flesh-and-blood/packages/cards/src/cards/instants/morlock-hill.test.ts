import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { minervaThemis } from "../mentors/minerva-themis.ts";
import { morlockHillBlue } from "./morlock-hill.ts";

/**
 * Morlock Hill (DTD209) — Warrior Instant, cost 0.
 *
 * Printed: The next time you would be dealt lethal damage this turn, you may
 * banish Minerva Themis from your hand or arsenal to prevent that damage.
 *
 * PIN (plan §5): prevention optionalCost is outside the admission whitelist,
 * so any pending damage throws "prevention shape is not yet canonical".
 */

describe("Morlock Hill (DTD209) AAA", () => {
  it("happy (engine gap): resolving the Instant throws non-canonical prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [morlockHillBlue, minervaThemis],
        life: 6,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(morlockHillBlue);
    expect(() => game.passBoth()).toThrow(/prevention shape is not yet canonical/);
    expectFabCard(Boltyn, minervaThemis).toBeIn("hand");
  });

  it("boundary: begin-play is legal; Minerva is not banished", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [morlockHillBlue, minervaThemis],
        life: 20,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(morlockHillBlue);
    expect(Boltyn.zone("hand")).not.toContain(morlockHillBlue.canonicalId);
    expectFabCard(Boltyn, minervaThemis).toBeIn("hand");
    expectFabPlayer(Boltyn).toHaveLife(20);
  });

  it("timing (engine gap): the throw does not need Minerva or a damage event", () => {
    const game = FabTestEngine.start(
      { hero: boltyn, hand: [morlockHillBlue], life: 20, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(morlockHillBlue);
    expect(() => game.passBoth()).toThrow(/prevention shape is not yet canonical/);
    expectFabPlayer(Boltyn).toHaveLife(20);
  });
});
