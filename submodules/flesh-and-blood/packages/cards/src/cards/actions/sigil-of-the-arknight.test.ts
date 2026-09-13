import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { sigilOfFyendalBlue } from "./sigil-of-fyendal.ts";
import { sigilOfTheArknightBlue } from "./sigil-of-the-arknight.ts";

/**
 * Sigil of the Arknight (ROS133) — Runeblade Action Aura, go again.
 *
 * Printed: At the beginning of your action phase, destroy this.
 * When this leaves the arena, reveal the top card of your deck. If it's an
 * attack action card, put it into your hand.
 */

const endPhaseDraw = [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] as const;

describe("Sigil of the Arknight (ROS133) AAA", () => {
  it("happy: leaving the arena puts a revealed attack action into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sigilOfTheArknightBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed, ...endPhaseDraw],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sigilOfTheArknightBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Viserai, sigilOfTheArknightBlue).toBeIn("arena");

    Viserai.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Viserai, sigilOfTheArknightBlue).toBeIn("graveyard");
    expectFabCard(Viserai, snatchRed).toBeIn("hand");
  });

  it("boundary: a revealed non-attack action stays in the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sigilOfTheArknightBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [sigilOfFyendalBlue, ...endPhaseDraw],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sigilOfTheArknightBlue);
    game.helpers.resolveUntilIdle();
    Viserai.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Viserai, sigilOfTheArknightBlue).toBeIn("graveyard");
    expect(Viserai.zone("hand")).not.toContain(sigilOfFyendalBlue.canonicalId);
  });

  it("timing: go again refunds the action point spent to play this", () => {
    const game = FabTestEngine.start(
      { hero: viserai, hand: [sigilOfTheArknightBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sigilOfTheArknightBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Viserai).toHaveAP(1);
  });
});
