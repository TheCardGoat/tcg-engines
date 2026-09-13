import { describe, expect, it } from "vitest";

import { FAB_MANUAL_HARNESS, FabTestEngine } from "../../../testing/index.ts";
import { dash } from "../../../../../cards/src/cards/heroes/dash.ts";
import { boltyn } from "../../../../../cards/src/cards/heroes/boltyn.ts";
import { glistenRed } from "../../../../../cards/src/cards/instants/glisten.ts";
import { raydnDuskbane } from "../../../../../cards/src/cards/weapons/raydn-duskbane.ts";

describe("distribute-counters proposal", () => {
  it("emits numeric counter events and applies +1{p} to a weapon", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [raydnDuskbane],
        hand: [glistenRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    const Boltyn = game.as(boltyn);
    Boltyn.play(glistenRed);
    game.untilIdle({ entityTargets: "maximum" });

    expect(Boltyn.zone("graveyard")).toContain(glistenRed.canonicalId);
    expect(game.committedEvents()).toContainEqual(
      expect.objectContaining({
        name: "numeric-counter-added",
        data: expect.objectContaining({ property: "power", value: 1, count: 4 }),
      }),
    );
  });
});
