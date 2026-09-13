import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { unwindingFinalityRed } from "./unwinding-finality.ts";

describe("Unwinding Finality (OMN004) AAA", () => {
  it("happy: when this hits, draw a card", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [unwindingFinalityRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.playAttack(unwindingFinalityRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Zyggy).toHaveHandCount(1);
    expectFabCard(Zyggy, unwindingFinalityRed).toBeIn("graveyard");
  });

  it("boundary: a miss does not draw", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [unwindingFinalityRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.playAttack(unwindingFinalityRed, { stopAt: "defend" });
    game.as(dash).defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabPlayer(Zyggy).toHaveHandCount(0);
  });

  it("timing: fragment on a 2+{d} defend does not skip the on-hit draw of an undefended attack", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [unwindingFinalityRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.playAttack(unwindingFinalityRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Zyggy).toHaveHandCount(1);
  });
});
