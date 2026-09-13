import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { dash } from "../heroes/dash.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { doubleCrossStrap } from "./double-cross-strap.ts";

describe("Double Cross Strap (PEN031) AAA", () => {
  it("happy: after two hits this chain, destroy this to gain 1 resource", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        chest: [doubleCrossStrap],
        hand: [headJabRed, headJabRed],
        actionPoints: 1,
        resourcePoints: 0,
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
    Ira.activate(doubleCrossStrap);
    game.untilIdle();

    expectFabCard(Ira, doubleCrossStrap).toBeIn("graveyard");
    expectFabPlayer(Ira).toHaveResourceCount(1);
  });

  it("boundary: with no hits this chain the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        chest: [doubleCrossStrap],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.expectActivationRejected(doubleCrossStrap);
    expectFabCard(Ira, doubleCrossStrap).toBeIn("chest");
  });
});
