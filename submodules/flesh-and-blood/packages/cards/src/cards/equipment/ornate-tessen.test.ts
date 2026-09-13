import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { ornateTessen } from "./ornate-tessen.ts";

describe("Ornate Tessen (DYN235) AAA", () => {
  it("happy: pay {r} and destroy this to bottom a hand card and draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [ornateTessen],
        hand: [nimblismBlue],
        deck: [snatchRed],
        resourcePoints: 1,
        actionPoints: 0,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(ornateTessen);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, ornateTessen).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: cannot activate without 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [ornateTessen],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).activate(ornateTessen)).toThrow();
    expectFabCard(game.as(bravo), ornateTessen).toBeIn("weapon2");
  });

  it("timing: empty hand destroys this but does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [ornateTessen],
        hand: [],
        deck: [snatchRed],
        resourcePoints: 1,
        actionPoints: 0,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(ornateTessen);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, ornateTessen).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(0);
    expect(Bravo.zone("deck")).toContain(snatchRed.canonicalId);
  });
});
