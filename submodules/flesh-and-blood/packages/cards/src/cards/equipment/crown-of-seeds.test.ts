import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { verdance } from "../heroes/verdance.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { snatchYellow } from "../actions/snatch.ts";
import { crownOfSeeds } from "./crown-of-seeds.ts";

/**
 * Crown of Seeds — Earth Head d0.
 * Printed: "Once per Turn Instant - {r}, put a face down card from your
 * arsenal on the bottom of your deck: Draw a card and prevent the next 1
 * damage that would be dealt to your hero this turn."
 */

describe("Crown of Seeds AAA", () => {
  it("happy: recycling the face-down arsenal card draws and prevents 1", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        head: [crownOfSeeds],
        arsenal: [{ card: snatchYellow, state: { faceDown: true } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Verdance = game.as(verdance);

    game.as(dash).pass();
    Verdance.activate(crownOfSeeds);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Verdance, crownOfSeeds).toBeIn("head");
    const recycled = Verdance.cardIn("deck", snatchYellow);
    expectFabCard(Verdance, recycled).toBeIn("deck");
    // The end-phase draw took the deck's top card; the recycled card sits below it.
    expectFabCard(Verdance, snatchRed).toBeIn("hand");

    game.as(dash).playAttack(snatchRed);
    Verdance.defendWith();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Verdance).toHaveLife(17); // 4{p} minus the prevented 1
  });

  it("boundary: a face-up arsenal card cannot pay the cost", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        head: [crownOfSeeds],
        arsenal: [{ card: snatchYellow, state: { faceDown: false } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);

    Verdance.expectActivationRejected(crownOfSeeds);
    expectFabCard(Verdance, crownOfSeeds).toBeIn("head");
    expectFabCard(Verdance, snatchYellow).toBeIn("arsenal");
  });
});
