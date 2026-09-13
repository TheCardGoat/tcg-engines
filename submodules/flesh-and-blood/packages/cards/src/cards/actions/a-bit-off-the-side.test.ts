import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { hatchetOfBody } from "../weapons/hatchet-of-body.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { aBitOffTheSideRed } from "./a-bit-off-the-side.ts";

/**
 * A Bit Off the Side (OMN243) — axes you control gain on-hit discard EOT.
 */

describe("A Bit Off the Side (OMN243) AAA", () => {
  it("happy: an axe hit discards after this resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfBody],
        hand: [aBitOffTheSideRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.play(aBitOffTheSideRed);
    game.helpers.resolveUntilIdle();
    Boltyn.must.activate(hatchetOfBody);
    game.closeCombat({ ordering: "listed" });
    expect(Dash.zone("hand")).toHaveLength(0);
  });

  it("boundary: without this, an axe hit does not discard", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfBody],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.must.activate(hatchetOfBody);
    game.closeCombat({ ordering: "listed" });
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [aBitOffTheSideRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([aBitOffTheSideRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(19);
  });
});
