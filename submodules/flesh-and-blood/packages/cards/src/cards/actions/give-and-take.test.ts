import { describe, expect, it } from "vitest";
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
import { snatchRed } from "./snatch.ts";
import { ragingOnslaughtRed } from "./raging-onslaught.ts";
import { giveAndTakeRed } from "./give-and-take.ts";

describe("Give and Take (OUT185) AAA", () => {
  it("happy: an action defending this recycles a GY action with cost less than 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [giveAndTakeRed],
        graveyard: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(giveAndTakeRed);
    Bravo.defendWith(nimblismBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });

    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(snatchRed.canonicalId);
  });

  it("happy: leftover AP after close at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [giveAndTakeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(giveAndTakeRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(bravo)).toHaveLife(17);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a miss deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [giveAndTakeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(giveAndTakeRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue);
    // Both defending action cards trigger OUT185-a1; decline both optionals.
    game.helpers.resolveUntilIdle({
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: a GY action whose cost is not less than this {p} is not recycled", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [giveAndTakeRed],
        graveyard: [ragingOnslaughtRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(giveAndTakeRed);
    Bravo.defendWith(nimblismBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });

    expect(Dash.zone("graveyard")).toContain(ragingOnslaughtRed.canonicalId);
    expect(Dash.zone("deck")).not.toContain(ragingOnslaughtRed.canonicalId);
  });

  it("timing: go again does not leak to a second AAC", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [giveAndTakeRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(giveAndTakeRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
