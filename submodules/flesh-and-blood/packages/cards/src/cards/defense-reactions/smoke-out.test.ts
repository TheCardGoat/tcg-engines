import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { fang } from "../heroes/fang.ts";
import { smokeOutRed } from "./smoke-out.ts";

/**
 * Smoke Out (FNG018) — Draconic Defense Reaction, cost 0, 3{d}.
 * Printed: When this defends a red card, mark the attacking hero.
 */

describe("Smoke Out (FNG018) AAA", () => {
  it("happy: defending a red attack marks the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: fang, hand: [smokeOutRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Fang = game.as(fang);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");
    Fang.must.playReaction(smokeOutRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toBeMarked();
    expectFabCard(Fang, smokeOutRed).toBeIn("graveyard");
  });

  it("boundary: defending a blue attack does not mark the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: fang, hand: [smokeOutRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Fang = game.as(fang);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Fang.must.playReaction(smokeOutRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).notToBeMarked();
  });
});
