import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "../heroes/malice.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { restlessMagisterRed } from "./restless-magister.ts";
import { shadowrealmStrengthRed } from "./shadowrealm-strength.ts";
import { snatchRed } from "./snatch.ts";

/**
 * Shadowrealm Strength, Red (AMA012) — Shadow Necromancer Action, cost 0, go
 * again.
 *
 * Printed: "You may put a card from your banished zone into your graveyard. If
 * it's a zombie, your next attack this turn gets +3{p}.\nGo again"
 */

describe("Shadowrealm Strength (AMA012) AAA", () => {
  it("happy: moving a banished zombie arms the next attack with +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [shadowrealmStrengthRed, snatchRed],
        banished: [restlessMagisterRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.play(shadowrealmStrengthRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Malice, restlessMagisterRed).toBeIn("graveyard");

    Malice.playAttack(snatchRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(7);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: a moved non-zombie card arms nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [shadowrealmStrengthRed, snatchRed],
        banished: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.play(shadowrealmStrengthRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Malice, nimblismBlue).toBeIn("graveyard");

    Malice.playAttack(snatchRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });
});
