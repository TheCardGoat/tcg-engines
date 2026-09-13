import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { silver } from "../tokens/silver.ts";
import { gravenGaslight } from "./graven-gaslight.ts";

describe("Graven Gaslight (PEN136) AAA", () => {
  it("happy: from graveyard, destroy 2 Silver to equip this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        graveyard: [gravenGaslight],
        arena: [silver, silver],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(gravenGaslight);
    Bravo.target(silver, silver);
    game.untilIdle();

    expectFabCard(Bravo, gravenGaslight).toBeIn("weapon1");
    expect(Bravo.cardsIn("arena", silver)).toHaveLength(0);
  });

  it("boundary: from arena the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [gravenGaslight],
        arena: [silver, silver],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(gravenGaslight);
    expectFabCard(Bravo, gravenGaslight).toBeIn("weapon2");
  });
});
