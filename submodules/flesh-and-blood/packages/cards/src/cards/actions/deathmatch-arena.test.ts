import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { deathmatchArena } from "./deathmatch-arena.ts";

describe("Deathmatch Arena (HVY000) AAA", () => {
  it("happy: plays as a landmark and go again refunds the Action AP", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [deathmatchArena], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(deathmatchArena);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, deathmatchArena).toBeIn("arena");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: it cannot be played without an action point", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [deathmatchArena], actionPoints: 0, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(deathmatchArena)).toThrow();
    expectFabCard(game.as(dash), deathmatchArena).toBeIn("hand");
  });

  it("timing: 1v1 lethal damage creates Gold tokens equal to heroes who started", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [deathmatchArena],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(deathmatchArena);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, deathmatchArena).toBeIn("arena");
    expect(game.hasGameEnded()).toBe(false);
  });
});
