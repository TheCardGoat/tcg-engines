import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { snatchRed } from "../actions/snatch.ts";
import { invertExistenceBlue } from "./invert-existence.ts";

describe("Invert Existence (MON158) AAA", () => {
  it("happy: banishes an opposing attack action and non-attack action, then deals 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [invertExistenceBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, graveyard: [snatchRed, volticBoltRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.play(invertExistenceBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "maximum",
    });

    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabCard(Dash, volticBoltRed).toBeBanished();
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: banishing only attack actions does not deal the 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [invertExistenceBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, graveyard: [snatchRed, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.play(invertExistenceBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expect(Dash.zone("banished").length).toBeGreaterThan(0);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: may be played from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        banished: [invertExistenceBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, graveyard: [snatchRed, volticBoltRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(invertExistenceBlue, { from: "banished" });

    expect(Vynnset.zone("banished")).not.toContain(invertExistenceBlue.canonicalId);
  });
});
