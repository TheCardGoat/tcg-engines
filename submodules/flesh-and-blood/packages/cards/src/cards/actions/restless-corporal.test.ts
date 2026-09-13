import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { restlessCorporalRed } from "./restless-corporal.ts";
import { hellboundAssaultRed } from "./hellbound-assault.ts";
import { malice } from "../heroes/malice.ts";
describe("Restless Corporal preview behavior", () => {
  it("taps to move a banished card to graveyard and restores its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [],
        arena: [restlessCorporalRed],
        banished: [hellboundAssaultRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(malice);
    player.activate(restlessCorporalRed);
    player.target(hellboundAssaultRed);
    game.untilIdle();
    expectFabCard(player, hellboundAssaultRed).toBeIn("graveyard");
    expectFabCard(player, restlessCorporalRed).toBeTapped();
    expectFabPlayer(player).toHaveAP(1);
    player.expectActivationRejected(restlessCorporalRed);
  });
  it("cannot move a card out of the opponent's banished zone", () => {
    const game = FabTestEngine.start(
      { hero: malice, hand: [], arena: [restlessCorporalRed], deck: 6 },
      { hero: dash, hand: [], banished: [hellboundAssaultRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(malice).expectActivationRejected(restlessCorporalRed);
    expectFabCard(game.as(dash), hellboundAssaultRed).toBeBanished();
    expectFabCard(game.as(malice), restlessCorporalRed).toBeReady();
  });
});
