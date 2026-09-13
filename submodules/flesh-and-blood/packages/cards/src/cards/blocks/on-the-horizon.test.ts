import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { onTheHorizonRed } from "./on-the-horizon.ts";

describe("On the Horizon (SEA241) AAA", () => {
  it("happy: defending looks at the top card and leaves it on top", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [onTheHorizonRed],
        deck: [nimblismBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(onTheHorizonRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Bravo.zone("deck").at(-1)).toBe(nimblismBlue.canonicalId);
    expectFabCard(Bravo, onTheHorizonRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: a Block cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [onTheHorizonRed], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).play(onTheHorizonRed)).toThrow();
    expectFabCard(game.as(bravo), onTheHorizonRed).toBeIn("hand");
  });

  it("timing: look happens when this defends, not from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [onTheHorizonRed],
        deck: [nimblismBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("deck").at(-1)).toBe(nimblismBlue.canonicalId);
    expectFabCard(Bravo, onTheHorizonRed).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveLife(16);
  });
});
