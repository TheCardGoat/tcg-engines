import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { bravo } from "../heroes/bravo.ts";
import { constructNitroMechanoidYellow } from "./construct-nitro-mechanoid.ts";
import { hyperDriverYellow } from "./hyper-driver.ts";
import { hyperDriverBlue } from "./hyper-driver.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { supercellBlue } from "./supercell.ts";

/**
 * Supercell (MST227) — Mechanologist Action, printed cost X.
 *
 * Printed: Put X steam counters on X target Hyper Drivers you control.
 * Create a Hyper Driver token with X steam counters. If X is 3 or greater,
 * you may shuffle a Construct Nitro Mechanoid from your banished zone into
 * your deck.
 *
 * Catalog omits numeric `cost`; `{ type: "x" }` binds the play-time
 * `play({ xValue })` payment (usesPrintedXResourceCost).
 */

describe("Supercell (MST227) AAA", () => {
  it("happy: X=1 puts a steam counter on the targeted Hyper Driver and creates one with 1 steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverRed, supercellBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverRed);
    game.untilIdle({ ordering: "listed" });
    Teklo.play(supercellBlue, { xValue: 1 });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena").toHaveCounters(4, "steam");
    expectFabPlayer(Teklo).toHaveTokenCount("hyper-driver", 1);
    expectFabCard(Teklo, supercellBlue).toBeIn("graveyard");
  });

  it("boundary: X=0 does not add steam and the 0-steam token does not stay", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverRed, supercellBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverRed);
    game.untilIdle({ ordering: "listed" });
    Teklo.play(supercellBlue, { xValue: 0 });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena").toHaveCounters(3, "steam");
    expectFabPlayer(Teklo).toHaveTokenCount("hyper-driver", 0);
    expectFabCard(Teklo, supercellBlue).toBeIn("graveyard");
  });

  it("timing: X=3 may shuffle Construct Nitro Mechanoid from banished into the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [supercellBlue],
        arena: [
          { card: hyperDriverRed, state: { steamCounters: 3 } },
          { card: hyperDriverYellow, state: { steamCounters: 3 } },
          { card: hyperDriverBlue, state: { steamCounters: 3 } },
        ],
        banished: [constructNitroMechanoidYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const instanceId = Teklo.findCardInZone("hand", supercellBlue);

    game.playInstance(Teklo.id, instanceId, { xValue: 3 }, "explicit");
    game.untilIdle({ optionals: "accept", entityTargets: "maximum", ordering: "listed" });

    expect(Teklo.zone("banished")).not.toContain(constructNitroMechanoidYellow.canonicalId);
    expect(Teklo.zone("deck")).toContain(constructNitroMechanoidYellow.canonicalId);
    expectFabPlayer(Teklo).toHaveTokenCount("hyper-driver", 1);
  });
});
