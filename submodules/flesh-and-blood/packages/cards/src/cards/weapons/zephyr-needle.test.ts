import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { zephyrNeedle } from "./zephyr-needle.ts";

/**
 * Zephyr Needle (1HP093) — Ninja Weapon - Dagger (1H), 2{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack. Go again
 *   When this is defended by a card with {d} greater than this weapon
 *   attack's {p}, destroy this when the combat chain closes.
 */

describe("Zephyr Needle (1HP093) AAA", () => {
  it("happy: defended by 4{d} > 2{p}, the needle is destroyed when the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [zephyrNeedle],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [sinkBelowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.activateAttack(zephyrNeedle);
    expectCombat(game).toHaveKeyword("go-again");
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    Dash.defendWith();
    game.toReaction("defender");
    Dash.must.playReaction(sinkBelowRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Katsu, zephyrNeedle).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("boundary: defended by {d} not greater than its {p}, the needle survives", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [zephyrNeedle],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.activateAttack(zephyrNeedle);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    Dash.defendWith(nimblismBlue); // 2{d} is not greater than 2{p}
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Katsu, zephyrNeedle).toBeIn("weapon1");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
