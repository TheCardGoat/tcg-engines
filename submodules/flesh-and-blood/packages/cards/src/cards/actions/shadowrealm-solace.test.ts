import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { malice } from "../heroes/malice.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { restlessMagisterRed } from "./restless-magister.ts";
import { shadowrealmSolaceBlue } from "./shadowrealm-solace.ts";

/**
 * Shadowrealm Solace, Blue — Shadow Necromancer Action, cost 0, go again.
 *
 * Printed: "You may put a card from your banished zone into your graveyard. If
 * it's a zombie, gain 1{h}.\nGo again"
 */

describe("Shadowrealm Solace AAA", () => {
  it("happy: moving a banished zombie gains 1{h} and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [shadowrealmSolaceBlue],
        banished: [restlessMagisterRed],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(shadowrealmSolaceBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Malice, restlessMagisterRed).toBeIn("graveyard");
    expectFabPlayer(Malice).toHaveLife(21).toHaveAP(1);
  });

  it("boundary: a moved non-zombie card gains no life", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [shadowrealmSolaceBlue],
        banished: [nimblismBlue],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(shadowrealmSolaceBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Malice, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Malice).toHaveLife(20).toHaveAP(1);
  });
});
