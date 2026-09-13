import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { conflictingThoughtsRed } from "./conflicting-thoughts.ts";

describe("Conflicting Thoughts family AAA", () => {
  it("happy: attacking creates an opt decision", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [conflictingThoughtsRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.play(conflictingThoughtsRed, { optBottom: 1, target: game.as(dash).id });
    game.helpers.resolveUntilIdle();
    expect(game.committedEvents().some((event) => event.name === "opt")).toBe(true);
    expectFabCard(Bravo, conflictingThoughtsRed).toBeIn("graveyard");
  });
  it("boundary: an empty deck still attacks", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [conflictingThoughtsRed], actionPoints: 1, deck: 0 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.play(conflictingThoughtsRed, { optBottom: 1, target: game.as(dash).id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
  it("timing: opt does not trigger while card remains in hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [conflictingThoughtsRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expect(game.committedEvents().some((event) => event.name === "opt")).toBe(false);
  });
});
