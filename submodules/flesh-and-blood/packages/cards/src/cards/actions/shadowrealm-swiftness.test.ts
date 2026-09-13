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
import { snatchRed } from "./snatch.ts";
import { shadowrealmSwiftnessYellow } from "./shadowrealm-swiftness.ts";

/**
 * Shadowrealm Swiftness, Yellow — Shadow Necromancer Action, cost 0, go again.
 *
 * Printed: "You may put a card from your banished zone into your graveyard. If
 * it's a zombie, your next attack this turn gets go again.\nGo again"
 */

describe("Shadowrealm Swiftness AAA", () => {
  it("happy: moving a banished zombie arms the next attack with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [shadowrealmSwiftnessYellow, snatchRed],
        banished: [restlessMagisterRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(shadowrealmSwiftnessYellow);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });
    expectFabCard(Malice, restlessMagisterRed).toBeIn("graveyard");
    expectFabPlayer(Malice).toHaveAP(1);

    Malice.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Malice).toHaveAP(1);
  });

  it("boundary: a moved non-zombie card arms the next attack with nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [shadowrealmSwiftnessYellow, snatchRed],
        banished: [nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(shadowrealmSwiftnessYellow);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });
    expectFabCard(Malice, nimblismBlue).toBeIn("graveyard");

    Malice.playAttack(snatchRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Malice).toHaveAP(0);
  });
});
