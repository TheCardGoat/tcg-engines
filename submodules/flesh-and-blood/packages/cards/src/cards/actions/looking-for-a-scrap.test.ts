import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { lookingForAScrapRed } from "./looking-for-a-scrap.ts";

describe("Looking for a Scrap (OUT195) AAA", () => {
  it("happy: leftover AP after close at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lookingForAScrapRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(lookingForAScrapRed);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(bravo)).toHaveLife(16);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a miss deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lookingForAScrapRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(lookingForAScrapRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: go again does not leak to a second AAC", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [lookingForAScrapRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(lookingForAScrapRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
