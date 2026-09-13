import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { iyslander } from "../heroes/iyslander.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { constellaTiara } from "./constella-tiara.ts";

/**
 * Constella Tiara — Lightning Head d0.
 * Printed: "Instant - {r}{r}, destroy this: Prevent the next 1 damage that
 * would be dealt to you this turn. If you prevent damage this way, create a
 * Ponder token."
 */

describe("Constella Tiara AAA", () => {
  it("happy: the tiara prevents 1 of the hit and creates a Ponder token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: iyslander, head: [constellaTiara], hand: [], life: 20, resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    game.as(dash).pass();
    Iyslander.activate(constellaTiara);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Iyslander, constellaTiara).toBeIn("graveyard");

    game.as(dash).playAttack(snatchRed);
    Iyslander.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Iyslander).toHaveLife(17); // 4{p} minus the prevented 1
    expectFabToken(game, "ponder").toHaveCount(1);
  });

  it("boundary: unspent prevention creates no Ponder token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: iyslander, head: [constellaTiara], hand: [], life: 20, resourcePoints: 2, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: iyslander },
    );
    const Iyslander = game.as(iyslander);

    Iyslander.activate(constellaTiara);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Iyslander, constellaTiara).toBeIn("graveyard");

    Iyslander.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Iyslander, constellaTiara).toBeIn("graveyard");
    expectFabToken(game, "ponder").toHaveCount(0);
  });
});
