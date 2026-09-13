import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { blessingOfSpiritsRed, blessingOfSpiritsBlue } from "./blessing-of-spirits.ts";

describe("Blessing of Spirits (DYN218) AAA", () => {
  it("happy: at the start of your turn destroy this then create 3 Spectral Shields", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: prism,
        arena: [blessingOfSpiritsRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Prism, blessingOfSpiritsRed).toBeIn("graveyard");
    expectFabToken(game, "spectral-shield").toHaveCount(3);
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 3);
  });

  it("boundary: while in the arena this has Ward 1 and creates no tokens yet", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [blessingOfSpiritsRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    expectFabCard(Prism, blessingOfSpiritsRed).toBeIn("arena").toHaveKeyword("ward");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: prism, arena: [blessingOfSpiritsRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).endTurn();
    game.untilIdle();
    expectFabCard(game.as(prism), blessingOfSpiritsRed).toBeIn("arena");
    expectFabPlayer(game.as(prism)).toHaveTokenCount("spectral-shield", 0);
  });

  it("pitch scale: the blue aura creates a single Spectral Shield", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: prism,
        arena: [blessingOfSpiritsBlue],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Prism, blessingOfSpiritsBlue).toBeIn("graveyard");
    expectFabToken(game, "spectral-shield").toHaveCount(1);
  });
});
