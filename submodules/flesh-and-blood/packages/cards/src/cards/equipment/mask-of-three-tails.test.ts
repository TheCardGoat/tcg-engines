import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { maskOfThreeTails } from "./mask-of-three-tails.ts";

describe("Mask of Three Tails (TCC079) AAA", () => {
  it("happy: after three hits this chain, destroy this to draw 1", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        head: [maskOfThreeTails],
        hand: [headJabRed, headJabRed, headJabRed],
        actionPoints: 1,
        resourcePoints: 0,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(headJabRed);
    game.advanceCombatTo("resolution");
    Ira.playAttack(headJabRed);
    game.advanceCombatTo("resolution");
    Ira.playAttack(headJabRed);
    game.advanceCombatTo("resolution");
    Ira.activate(maskOfThreeTails);
    game.untilIdle();

    expectFabCard(Ira, maskOfThreeTails).toBeIn("graveyard");
    expectFabCard(Ira, nimblismBlue).toBeIn("hand");
  });

  it("boundary: with no hits this chain the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        head: [maskOfThreeTails],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.expectActivationRejected(maskOfThreeTails);
    expectFabCard(Ira, maskOfThreeTails).toBeIn("head");
    expectFabPlayer(Ira).toHaveHandCount(0);
  });
});
