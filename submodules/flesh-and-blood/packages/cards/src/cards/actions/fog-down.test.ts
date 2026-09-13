import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { fogDownYellow } from "./fog-down.ts";

describe("Fog Down (UPR190) AAA", () => {
  it("happy: sits in the arena as an aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [fogDownYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(fogDownYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, fogDownYellow).toBeIn("arena");
    expect(game.combat()).toBeNull();
  });

  it("boundary: an attack action still keeps printed go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [fogDownYellow, snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(fogDownYellow);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: destroyed at the beginning of your next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [fogDownYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(fogDownYellow);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, fogDownYellow).toBeIn("graveyard");
  });
});
