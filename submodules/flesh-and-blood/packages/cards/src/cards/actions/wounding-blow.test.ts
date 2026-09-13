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
import { woundingBlowRed } from "./wounding-blow.ts";

describe("Wounding Blow (TEA015) family behavior AAA", () => {
  it("happy: a red Wounding Blow deals its printed 4 damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [woundingBlowRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(woundingBlowRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(16);
    expectFabCard(Dash, woundingBlowRed).toBeIn("graveyard");
  });

  it("boundary: two 2-defense blocks fully prevent a red Wounding Blow", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [woundingBlowRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(woundingBlowRed);
    game.as(bravo).defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });

  it("timing: the vanilla attack has no go again and combat closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [woundingBlowRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(woundingBlowRed);
    expectCombat(game).notToHaveKeyword("go-again").toBeAtStep("defend");
    game.closeCombat();

    expectCombat(game).toBeClosed();
    expectFabCard(Dash, woundingBlowRed).toBeIn("graveyard");
  });
});
