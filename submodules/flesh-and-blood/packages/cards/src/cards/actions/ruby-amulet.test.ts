import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { rubyAmuletBlue } from "./ruby-amulet.ts";

describe("Ruby Amulet (SEA196) AAA", () => {
  it("happy: destroy this as an instant to gain {r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [rubyAmuletBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(rubyAmuletBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Oscilio, rubyAmuletBlue).toBeIn("arena");

    Oscilio.activate(rubyAmuletBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Oscilio).toHaveResourceCount(2);
    expectFabCard(Oscilio, rubyAmuletBlue).toBeIn("graveyard");
  });

  it("boundary: the destroy ability is not legal from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [rubyAmuletBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const instanceId = Oscilio.findCardInZone("hand", rubyAmuletBlue);
    const rejected = Oscilio.expectFailure({
      move: "activate",
      payload: { instanceId },
    });
    expect(rejected.errorCode).toBeDefined();
    expectFabCard(Oscilio, rubyAmuletBlue).toBeIn("hand");
  });
});
