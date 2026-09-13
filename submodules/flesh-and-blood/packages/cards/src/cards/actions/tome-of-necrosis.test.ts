import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { restlessClericRed } from "./restless-cleric.ts";
import { restlessLooterRed } from "./restless-looter.ts";
import { snatchRed } from "./snatch.ts";
import { tomeOfNecrosisRed } from "./tome-of-necrosis.ts";

describe("Tome of Necrosis (IAR) AAA", () => {
  it("happy: destroys a controlled Ally, then draws and untaps the hero", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [tomeOfNecrosisRed],
        graveyard: [restlessLooterRed],
        arena: [restlessClericRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    Malice.activate(malice);
    Malice.target(restlessLooterRed);
    game.untilIdle();
    Malice.play(tomeOfNecrosisRed);
    Malice.target(restlessClericRed);
    game.untilIdle();
    expectFabCard(Malice, restlessClericRed).toBeIn("banished");
    expectFabCard(Malice, snatchRed).toBeIn("hand");
    expectFabCard(Malice, malice).toBeReady();
  });

  it("happy: discards an Ally from hand for the alternative cost", () => {
    const game = FabTestEngine.start(
      { hero: malice, hand: [tomeOfNecrosisRed, restlessClericRed], deckTop: [snatchRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    Malice.play(tomeOfNecrosisRed);
    Malice.target(restlessClericRed);
    game.untilIdle();
    expectFabCard(Malice, restlessClericRed).toBeIn("graveyard");
    expectFabCard(Malice, snatchRed).toBeIn("hand");
  });

  it("boundary: reverses the play when no Ally can be destroyed or discarded", () => {
    const game = FabTestEngine.start(
      { hero: malice, hand: [tomeOfNecrosisRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    expectFabUnplayable(() => Malice.play(tomeOfNecrosisRed));
    expectFabCard(Malice, tomeOfNecrosisRed).toBeIn("hand");
  });
});
