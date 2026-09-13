import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { rakeTheEmbersRed } from "../actions/rake-the-embers.ts";
import { sashOfSandikai } from "./sash-of-sandikai.ts";

/**
 * Sash of Sandikai (FAI004) — Draconic Chest d0.
 *
 * Printed: "Instant - Destroy Sash of Sandikai: Gain {r}. Activate this ability
 * only if you've played a red card this turn."
 */

describe("Sash of Sandikai (FAI004) AAA", () => {
  it("happy: after playing a red card, destroying the sash gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        chest: [sashOfSandikai],
        hand: [rakeTheEmbersRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Dromai = game.as(dromai);

    Dromai.play(rakeTheEmbersRed);
    game.untilIdle({ entityTargets: "minimum" });

    Dromai.activate(sashOfSandikai);
    game.untilIdle();

    expectFabCard(Dromai, sashOfSandikai).toBeIn("graveyard");
    expectFabPlayer(Dromai).toHaveResourceCount(1); // 1 rake - 1 + 1 gain
  });

  it("boundary: without a red card played this turn the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        chest: [sashOfSandikai],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Dromai = game.as(dromai);

    Dromai.expectActivationRejected(sashOfSandikai);
    expectFabCard(Dromai, sashOfSandikai).toBeIn("chest");
    expectFabPlayer(Dromai).toHaveResourceCount(3);
  });
});
