import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bucklingBlowYellow } from "../actions/buckling-blow.ts";
import { awakeningBlue } from "./awakening.ts";

/**
 * Awakening (ELE006) — Elemental Guardian Instant, cost 2, Earth Fusion.
 *
 * Printed: "If you have less {h} than an opposing hero, create Seismic Surge
 * tokens equal to the difference. If Awakening was fused, instead create
 * twice that many Seismic Surge tokens. Search your deck for a Guardian
 * attack action card with cost less than or equal to the number of Seismic
 * Surge tokens you control, reveal it, put it into your hand, then shuffle."
 *
 * Pins: the `instead: true` conditional is not a `self-replacement` step, so
 * a fused play creates N then 2N (3N total) rather than replacing N with 2N.
 * Search uses a placeholder `name` filter that matches no card.
 */

describe("Awakening (ELE006) AAA", () => {
  it("happy: unfused with 4 less {h} creates 4 Seismic Surges", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [awakeningBlue],
        resourcePoints: 2,
        life: 16,
        deck: [bucklingBlowYellow, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.play(awakeningBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Oldhim.zone("arena").filter((c) => c === "token:seismic-surge")).toHaveLength(4);
    expectFabCard(Oldhim, awakeningBlue).toBeIn("graveyard");
  });

  it("boundary: equal life creates no Seismic Surges", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [awakeningBlue],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.play(awakeningBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Oldhim.zone("arena").filter((c) => c === "token:seismic-surge")).toHaveLength(0);
    expectFabCard(Oldhim, awakeningBlue).toBeIn("graveyard");
  });
});
