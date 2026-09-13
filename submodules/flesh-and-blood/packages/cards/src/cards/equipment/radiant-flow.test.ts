import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { radiantFlow } from "./radiant-flow.ts";

describe("Radiant Flow (DTD078) AAA", () => {
  it("happy: banish this and a soul card to prevent 2 of Snatch", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        legs: [radiantFlow],
        soul: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith();
    game.as(dash).pass();
    Boltyn.activate(radiantFlow);
    game.untilIdle({ entityTargets: "minimum" });
    game.closeCombat();

    expectFabCard(Boltyn, radiantFlow).toBeBanished();
    expectFabCard(Boltyn, nimblismBlue).toBeBanished();
    expectFabPlayer(Boltyn).toHaveLife(18);
  });

  it("boundary: without soul the Instant is illegal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: boltyn, legs: [radiantFlow], soul: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith();
    game.as(dash).pass();
    Boltyn.expectActivationRejected(radiantFlow);
    game.closeCombat();

    expectFabCard(Boltyn, radiantFlow).toBeIn("legs");
    expectFabPlayer(Boltyn).toHaveLife(16);
  });
});
