import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "../actions/autumn-s-touch.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rootboundCarapaceRed } from "./rootbound-carapace.ts";

/**
 * Rootbound Carapace Red (FLR011) — Earth Defense Reaction.
 *
 * Printed: Decompose — You may banish 2 Earth cards and an action card from
 * your graveyard. If you do, this gets +1{d}.
 */

describe("Rootbound Carapace family AAA", () => {
  it("happy: paying Decompose gives +1 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oldhim,
        hand: [rootboundCarapaceRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhim);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Oldhim.play(rootboundCarapaceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Oldhim).toHaveLife(20);
    expect(Oldhim.zone("banished")).toHaveLength(3);
    expectFabCard(Oldhim, rootboundCarapaceRed).toBeIn("graveyard");
  });

  it("boundary: declining Decompose leaves printed defense 3", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oldhim,
        hand: [rootboundCarapaceRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oldhim = game.as(oldhim);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Oldhim.play(rootboundCarapaceRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Oldhim).toHaveLife(19);
    expect(Oldhim.zone("banished")).toHaveLength(0);
    expect(
      Oldhim.zone("graveyard").filter((card) => card === autumnSTouchBlue.canonicalId),
    ).toHaveLength(2);
  });
});
