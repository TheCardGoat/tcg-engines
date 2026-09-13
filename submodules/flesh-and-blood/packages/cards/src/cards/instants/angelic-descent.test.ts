import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { heraldOfTenacityRed } from "../actions/herald-of-tenacity.ts";
import { snatchRed } from "../actions/snatch.ts";
import { angelicDescentRed } from "./angelic-descent.ts";

describe("Angelic Descent (DTD032/033/034) AAA", () => {
  it("happy: a Herald attack action on the chain gains go again and refunds an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed, angelicDescentRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfTenacityRed);
    expect(Prism.actionPoints()).toBe(1);
    Dash.pass();
    Prism.play(angelicDescentRed, {
      targetInstanceId: Prism.cardIn("combatChain", heraldOfTenacityRed).instanceId,
    });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(14);
    expect(Prism.actionPoints()).toBe(2);
    expect(Prism.zone("soul")).toContain(heraldOfTenacityRed.canonicalId);
  });

  it("boundary: the next-angel bonus does not leak to a non-Angel follow-up attack", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed, angelicDescentRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfTenacityRed);
    Dash.pass();
    Prism.play(angelicDescentRed, {
      targetInstanceId: Prism.cardIn("combatChain", heraldOfTenacityRed).instanceId,
    });
    game.advanceCombatTo("resolution");

    Prism.playAttack(snatchRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(10);
  });

  it("scope: with no Herald on the chain the instant has no legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [snatchRed, angelicDescentRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(snatchRed);
    Dash.pass();
    expectFabUnplayable(() => Prism.play(angelicDescentRed));
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
    expect(Prism.actionPoints()).toBe(0);
  });
});
