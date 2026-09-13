import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gold } from "../tokens/gold.ts";
import { nimblismBlue } from "./nimblism.ts";
import { payUpRed } from "./pay-up.ts";

describe("Pay Up (HVY208) AAA", () => {
  it("happy: vs a Gold it gets overpower and stealing the Gold on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [payUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, arena: [gold], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(payUpRed);
    expectCombat(game).toHaveKeyword("overpower");
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: gold.canonicalId,
    });

    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expect(Dash.zone("arena")).toContain(gold.canonicalId);
    expect(game.as(bravo).zone("arena")).not.toContain(gold.canonicalId);
  });

  it("boundary: without a defending Gold it has no overpower and pings 1 on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [payUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(payUpRed);
    expectCombat(game).notToHaveKeyword("overpower");
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(13);
  });

  it("timing: a fully blocked miss without Gold deals no ping", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [payUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(payUpRed);
    expectCombat(game).notToHaveKeyword("overpower");
    Bravo.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
