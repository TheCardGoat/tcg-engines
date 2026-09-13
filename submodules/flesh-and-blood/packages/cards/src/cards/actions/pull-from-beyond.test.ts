import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pullFromBeyondRed } from "./pull-from-beyond.ts";

/**
 * Pull from Beyond Red (IAR212) — Shadow Action, cost 0, 3{d}, Opt 2, go again.
 *
 * Printed: Opt 2. Banish the top card of your deck. If it's red, create a
 * Gate to i'Arathael token. Go again
 */

describe("Pull from Beyond (IAR212) AAA", () => {
  it("happy: Opt 2 restacks, then banishing the new red top creates a Gate", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [pullFromBeyondRed],
        actionPoints: 1,
        // Last is seated top. Opt 2 + optBottom 2 buries both looked blues;
        // the remaining red becomes the new top and is banished.
        deck: [snatchRed, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(pullFromBeyondRed);
    game.untilIdle({ optBottom: 2 });

    expect(Chane.zone("banished")).toContain(snatchRed.canonicalId);
    expect(Chane.zone("arena")).toContain("token:gate-to-i-arathael");
    expectFabCard(Chane, pullFromBeyondRed).toBeIn("graveyard");
  });

  it("boundary: Opt 2 restacks so a seated red top is buried and no Gate is created", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [pullFromBeyondRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(pullFromBeyondRed);
    game.untilIdle({ optBottom: 2 });

    expect(Chane.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Chane.zone("banished")).not.toContain(snatchRed.canonicalId);
    expect(Chane.zone("arena")).not.toContain("token:gate-to-i-arathael");
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [pullFromBeyondRed],
        actionPoints: 1,
        deck: [snatchRed, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    expectFabPlayer(Chane).toHaveAP(1);
    Chane.play(pullFromBeyondRed);
    game.untilIdle({ optBottom: 2 });
    expectFabPlayer(Chane).toHaveAP(1);
  });
});
