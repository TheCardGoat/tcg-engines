import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { performanceBonusRed } from "./performance-bonus.ts";

describe("Performance Bonus (HVY225) AAA", () => {
  it("happy: hitting creates a Gold token at printed 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [performanceBonusRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(performanceBonusRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(17);
    expect(Dash.zone("arena")).toContain("token:gold");
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("boundary: a miss creates no Gold", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [performanceBonusRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(performanceBonusRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expect(Dash.zone("arena")).not.toContain("token:gold");
  });

  it("timing: played from arsenal it gets go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, arsenal: [performanceBonusRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(performanceBonusRed, { from: "arsenal" });
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(1);
    expect(Dash.zone("arena")).toContain("token:gold");
  });
});
