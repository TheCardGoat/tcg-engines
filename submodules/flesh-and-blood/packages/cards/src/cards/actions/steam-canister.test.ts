import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { steamCanisterBlue } from "./steam-canister.ts";

describe("Steam Canister (EVO077) AAA", () => {
  it("happy: Instant bottoms this to put a steam counter on a crank item", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [steamCanisterBlue],
        arena: [goldenCog],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(steamCanisterBlue);
    game.untilIdle();
    Dash.activate(steamCanisterBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expect(Dash.zone("deck")).toContain(steamCanisterBlue.canonicalId);
    expectFabCard(Dash, goldenCog).toHaveCounters(2, "steam");
  });

  it("boundary: without a crank item the Instant still bottoms this", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [steamCanisterBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(steamCanisterBlue);
    game.untilIdle();
    Dash.activate(steamCanisterBlue);
    game.untilIdle({ entityTargets: "minimum" });
    expect(Dash.zone("deck")).toContain(steamCanisterBlue.canonicalId);
  });
});
