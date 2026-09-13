import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { wreckerRompRed } from "../actions/wrecker-romp.ts";
import { evenBiggerThanThatRed } from "./even-bigger-than-that.ts";

describe("Even Bigger Than That! AAA", () => {
  it("happy: after dealing {p} this turn the card is legal to play and starts Opt", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue, evenBiggerThanThatRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [brutalAssaultRed, brutalAssaultRed, brutalAssaultRed],
      },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(16);

    expect(() => Dash.play(evenBiggerThanThatRed)).not.toThrow();
    expect(Dash.zone("hand")).not.toContain(evenBiggerThanThatRed.canonicalId);
  });

  it("happy: Opt 3 then reveal: if revealed {p} is greater than damage dealt this turn, create Quicken and draw", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue, evenBiggerThanThatRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [brutalAssaultRed, brutalAssaultRed, wreckerRompRed],
      },
      { hero: bravo, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Bravo.defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(16);

    Dash.play(evenBiggerThanThatRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expect(Dash.zone("arena")).toContain("token:quicken");
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("boundary: cannot be played if you have not dealt {p} this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [evenBiggerThanThatRed], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabUnplayable(() => Dash.play(evenBiggerThanThatRed), /play condition is not satisfied/i);
    expectFabCard(Dash, evenBiggerThanThatRed).toBeIn("hand");
  });
});
