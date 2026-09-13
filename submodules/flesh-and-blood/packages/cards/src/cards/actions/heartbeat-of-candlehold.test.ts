import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { verdance } from "../heroes/verdance.ts";
import { heartbeatOfCandleholdBlue } from "./heartbeat-of-candlehold.ts";

/**
 * Heartbeat of Candlehold (ROS016) — Earth Wizard Action, Verdance
 * Specialization, cost 1, go again.
 *
 * Printed: Gain 1{h}. Gain 1{h}. Gain 1{h}. Go again
 */

describe("Heartbeat of Candlehold (ROS016) AAA", () => {
  it("happy: the three gain-life steps grant 3 life", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [heartbeatOfCandleholdBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);

    Verdance.play(heartbeatOfCandleholdBlue);
    game.passBoth();

    expectFabPlayer(Verdance).toHaveLife(23);
    expectFabCard(Verdance, heartbeatOfCandleholdBlue).toBeIn("graveyard");
  });

  it("boundary: the opposing hero does not gain the 3 life", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [heartbeatOfCandleholdBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(verdance).play(heartbeatOfCandleholdBlue);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: go again refunds the spent action point", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        hand: [heartbeatOfCandleholdBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);

    Verdance.play(heartbeatOfCandleholdBlue);
    game.passBoth();

    expectFabPlayer(Verdance).toHaveAP(1);
  });
});
