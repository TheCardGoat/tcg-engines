import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { talkABigGameBlue } from "./talk-a-big-game.ts";

/**
 * Talk a Big Game (HVY136) — Brute / Guardian Action, cost 0, 3{d}, go again.
 *
 * Printed: "Choose a number. The next time you deal that much or more {p}
 * damage to a hero this turn, create that many Might tokens. Go again"
 */

describe("Talk a Big Game (HVY136) AAA", () => {
  it("happy: dealing at least the chosen {p} damage creates that many Might", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [talkABigGameBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(talkABigGameBlue);
    game.passBoth();
    Rhinar.choose("4");
    game.untilIdle();
    Rhinar.playAttack(brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Rhinar).toHaveTokenCount("might", 4);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabCard(Rhinar, talkABigGameBlue).toBeIn("graveyard");
  });

  it("boundary: dealing less than the chosen number creates no Might", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [talkABigGameBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.play(talkABigGameBlue);
    game.passBoth();
    Rhinar.choose("4");
    game.untilIdle();
    Rhinar.playAttack(brutalAssaultBlue);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Rhinar).toHaveTokenCount("might", 0);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [talkABigGameBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expectFabPlayer(Rhinar).toHaveAP(1);
    Rhinar.play(talkABigGameBlue);
    game.passBoth();
    Rhinar.choose("1");
    game.untilIdle();
    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
