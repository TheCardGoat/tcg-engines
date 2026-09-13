import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gold } from "../tokens/gold.ts";
import { startingStakeYellow } from "./starting-stake.ts";

describe("Starting Stake (HVY238) AAA", () => {
  it("happy: with no Gold it creates a Gold token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [startingStakeYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(startingStakeYellow);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("arena")).toContain("token:gold");
    expectFabCard(Dash, startingStakeYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("boundary: already controlling a Gold creates no extra Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [startingStakeYellow],
        arena: [gold],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(startingStakeYellow);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("arena").filter((id) => id === "token:gold")).toHaveLength(0);
    expectFabCard(Dash, gold).toBeIn("arena");
  });

  it("timing: playing it spends the Action AP and does not open combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [startingStakeYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(startingStakeYellow);
    game.helpers.resolveUntilIdle();

    expect(game.combat()).toBeNull();
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
