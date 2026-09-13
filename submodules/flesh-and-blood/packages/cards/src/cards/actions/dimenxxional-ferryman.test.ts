import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { dimenxxionalFerrymanBlue } from "./dimenxxional-ferryman.ts";
import { hellboundAssaultRed } from "./hellbound-assault.ts";
describe("Dimenxxional Ferryman preview behavior", () => {
  it("returns itself and a blood-debt action from banishment to the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [dimenxxionalFerrymanBlue],
        banished: [hellboundAssaultRed],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(chane);
    const ferryman = player.cardIn("hand", dimenxxionalFerrymanBlue);
    const returned = player.cardIn("banished", hellboundAssaultRed);
    player.play(dimenxxionalFerrymanBlue);
    game.untilIdle({ entityTargets: "maximum" });
    expectFabCard(player, returned).toBeIn("deck");
    expectFabCard(player, ferryman).toBeIn("deck");
    expectFabPlayer(player).toHaveAP(1);
  });
  it("does not return a banished card without blood debt", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [dimenxxionalFerrymanBlue],
        banished: [brutalAssaultBlue],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(chane);
    const ferryman = player.cardIn("hand", dimenxxionalFerrymanBlue);
    player.play(dimenxxionalFerrymanBlue);
    game.untilIdle();
    expectFabCard(player, brutalAssaultBlue).toBeBanished();
    expectFabCard(player, ferryman).toBeIn("deck");
  });
});
