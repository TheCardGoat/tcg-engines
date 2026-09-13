import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { vynnset } from "../heroes/vynnset.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { cullRed } from "./cull.ts";

describe("Cull (HNT259) AAA", () => {
  it("happy: each hero banishes a card from their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [cullRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [autumnSTouchBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.play(cullRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Vynnset, nimblismBlue).toBeBanished();
    expectFabCard(Dash, autumnSTouchBlue).toBeBanished();
    expectFabCard(Vynnset, cullRed).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveHandCount(0);
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("happy: you may play this from your banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [nimblismBlue],
        banished: [cullRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [autumnSTouchBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(cullRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Vynnset, nimblismBlue).toBeBanished();
    expectFabCard(Vynnset, cullRed).toBeIn("graveyard");
  });

  it("boundary: without a hero having lost {h} this turn it is not an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [cullRed, nimblismBlue],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [autumnSTouchBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    expect(() => Vynnset.play(cullRed)).toThrow();
    expectFabCard(Vynnset, cullRed).toBeIn("hand");
  });
});
