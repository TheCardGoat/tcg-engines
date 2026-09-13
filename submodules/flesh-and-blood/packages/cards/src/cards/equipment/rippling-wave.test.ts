import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { browbeatBlue } from "../actions/browbeat.ts";
import { ripplingWave } from "./rippling-wave.ts";

/**
 * Rippling Wave — Mystic Arms d3, Cloaked, Blade Break.
 *
 * Printed: "Cloaked / Instant - {c}{c}{c}, turn this face-up: You may return a
 * defending blue attack action card to its owner's hand. / Blade Break"
 */

describe("Rippling Wave (AAA) AAA", () => {
  it("happy: paying {c}{c}{c} turns this face-up and returns the defending blue attack action to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        chiPoints: 3,
        arms: [ripplingWave],
        hand: [browbeatBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Enigma.defendWith(browbeatBlue);
    game.toReaction("defender");
    Enigma.activate(ripplingWave);
    game.passBoth();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Enigma, ripplingWave).toBeIn("arms");
    expectFabCard(Enigma, ripplingWave).toBeFaceUp();
    expectFabCard(Enigma, browbeatBlue).toBeIn("hand");
    // The blocker left the chain, so the full 4{p} lands.
    expectFabPlayer(Enigma).toHaveLife(16);
  });

  it("boundary: a defending red attack action card is not returned and blocks normally", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        chiPoints: 3,
        arms: [ripplingWave],
        hand: [brutalAssaultRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Enigma.defendWith(brutalAssaultRed);
    game.toReaction("defender");
    Enigma.activate(ripplingWave);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Enigma, brutalAssaultRed).toBeIn("graveyard");
    expectFabPlayer(Enigma).toHaveLife(19); // 4{p} - 3{d}
  });

  it("timing: with no Chi the Instant cannot be activated", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        chiPoints: 0,
        arms: [ripplingWave],
        hand: [browbeatBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Enigma.defendWith(browbeatBlue);
    game.toReaction("defender");
    Enigma.expectActivationRejected(ripplingWave);
    expectFabCard(Enigma, ripplingWave).toBeIn("arms");
    expectFabCard(Enigma, ripplingWave).toBeFaceDown();

    game.untilIdle({ optionals: "decline" });
    expectFabPlayer(Enigma).toHaveLife(19); // 4{p} - 3{d}, blocked normally
  });
});
