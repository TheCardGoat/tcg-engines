import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { doubleStrikeRed } from "./double-strike.ts";

describe("Double Strike (UPR160) AAA", () => {
  it("happy: printed go again refunds AP after the first 1{p} hit", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [doubleStrikeRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(doubleStrikeRed, { stopAt: "defend" });
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, doubleStrikeRed).toBeIn("banished");
  });

  it("boundary: a 2{d} block misses the 1{p} attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [doubleStrikeRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(doubleStrikeRed);
    Dash.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(game.as(bravo), doubleStrikeRed).toBeIn("banished");
  });
});
