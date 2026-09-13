import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { vantomBansheeRed } from "./vantom-banshee.ts";

const runechant = fabToken("runechant");

describe("Vantom Banshee (DTD155) AAA", () => {
  it("happy: rune gate plays this from banished free when Runechants ≥ cost", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [vantomBansheeRed],
        arena: [runechant, runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.attackWith(vantomBansheeRed, { from: "banished" });

    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: fewer Runechants than cost cannot play this from banished", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [vantomBansheeRed],
        arena: [runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expect(() => Viserai.attackWith(vantomBansheeRed, { from: "banished" })).toThrow();
    expectFabCard(Viserai, vantomBansheeRed).toBeBanished();
  });

  it("timing: blood debt in banished ticks 1 life at the beginning of the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [vantomBansheeRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).endTurn();
    expectFabPlayer(game.as(viserai)).toHaveLife(19);
  });

  it("timing boundary: blood debt does not tax when this is not banished", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [vantomBansheeRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).endTurn();
    expectFabPlayer(game.as(viserai)).toHaveLife(20);
  });
});
