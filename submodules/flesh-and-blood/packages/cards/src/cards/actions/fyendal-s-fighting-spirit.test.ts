import { describe, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { fyendalSFightingSpiritRed } from "./fyendal-s-fighting-spirit.ts";

describe("Fyendal's Fighting Spirit family AAA", () => {
  it("happy: attacking while behind on life gains 1 life", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fyendalSFightingSpiritRed],
        life: 15,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, life: 20, deck: 6 },
    );
    game.as(dash).playAttack(fyendalSFightingSpiritRed);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
  it("boundary: equal life gains no life", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fyendalSFightingSpiritRed],
        life: 20,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, life: 20, deck: 6 },
    );
    game.as(dash).playAttack(fyendalSFightingSpiritRed);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
  it("timing: the card remains an attack after its trigger resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fyendalSFightingSpiritRed],
        life: 15,
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, life: 20, deck: 6 },
    );
    game.as(dash).playAttack(fyendalSFightingSpiritRed);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
