import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { zyggy } from "../heroes/zyggy.ts";
import { glideThroughStarlightRed } from "./glide-through-starlight.ts";

/**
 * Glide Through Starlight (OMN169) — Lightning Action Attack, red.
 *
 * Printed Instant: {r}, discard this: Prevent the next 1 damage that would
 * be dealt to you this turn. If you prevent damage this way, create a
 * Lightning Flow token.
 */

describe("Glide Through Starlight (OMN169) AAA", () => {
  it("happy: preventing 1 of Snatch's 4 creates a Lightning Flow", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zyggy,
        hand: [glideThroughStarlightRed],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zyggy = game.as(zyggy);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Zyggy.activate(glideThroughStarlightRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Zyggy).toHaveLife(17);
    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 1);
    expectFabCard(Zyggy, glideThroughStarlightRed).toBeIn("graveyard");
  });

  it("boundary: without {r} the Instant is unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [glideThroughStarlightRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(zyggy).expectActivationRejected(glideThroughStarlightRed);
  });

  it("timing: without incoming damage this turn no Lightning Flow is created", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [glideThroughStarlightRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.activate(glideThroughStarlightRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Zyggy, glideThroughStarlightRed).toBeIn("graveyard");
    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 0);
  });
});
