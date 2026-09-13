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
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { zealousBeltingRed } from "./zealous-belting.ts";

describe("Zealous Belting (MON293) AAA", () => {
  it("happy: leftover AP after close when pitch power exceeds printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zealousBeltingRed, regurgitatingSlogRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(zealousBeltingRed, { pitch: [regurgitatingSlogRed] });
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(bravo)).toHaveLife(15);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a miss deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zealousBeltingRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(zealousBeltingRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: no leftover AP when the pitch zone does not qualify", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zealousBeltingRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(zealousBeltingRed);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(bravo)).toHaveLife(15);
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("timing: go again does not leak to a second AAC", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zealousBeltingRed, brutalAssaultBlue, regurgitatingSlogRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(zealousBeltingRed, { pitch: [regurgitatingSlogRed] });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.playAttack(brutalAssaultBlue, { pitch: [nimblismBlue] });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
