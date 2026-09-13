import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";

describe("Brutal Assault (CRU192) AAA", () => {
  it("happy: attacks for 6", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [brutalAssaultRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Bravo, brutalAssaultRed).toBeIn("graveyard");
  });

  it("boundary: a 2{d} block leaves 4 damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [brutalAssaultRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(brutalAssaultRed);
    Dash.defendWith(nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: a vanilla attack has no go again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [brutalAssaultRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(brutalAssaultRed);
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
