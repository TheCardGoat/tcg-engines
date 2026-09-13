import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { blessingOfThemisYellow } from "./blessing-of-themis.ts";

/**
 * Blessing of Themis Yellow (PEN182) — Light Aura.
 *
 * Printed: When this enters the arena, name a card. Turn all cards with that
 * name in banished zones face-down.
 */

const namedCards = {
  ...FAB_MANUAL_HARNESS,
  publicCardIdentities: [
    { canonicalId: snatchRed.canonicalId, names: ["Snatch"] },
    { canonicalId: nimblismBlue.canonicalId, names: ["Nimblism"] },
  ],
} as const;

describe("Blessing of Themis (PEN182) AAA", () => {
  it("happy: naming Snatch turns a face-up banished Snatch face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [blessingOfThemisYellow],
        actionPoints: 1,
        deck: 6,
        banished: [{ card: snatchRed, state: { faceDown: false } }],
      },
      { hero: dash, hand: [], deck: 6 },
      namedCards,
    );
    const Bravo = game.as(bravo);

    Bravo.play(blessingOfThemisYellow);
    game.helpers.resolveUntilIdle({ effectResolution: "Snatch" });

    expectFabCard(Bravo, blessingOfThemisYellow).toBeIn("arena");
    expectFabCard(Bravo, snatchRed).toBeFaceDown();
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Bravo.id,
      cardName: "Snatch",
    });
  });

  it("boundary: naming a different card leaves the banished Snatch face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [blessingOfThemisYellow],
        actionPoints: 1,
        deck: 6,
        banished: [{ card: snatchRed, state: { faceDown: false } }],
      },
      { hero: dash, hand: [], deck: 6 },
      namedCards,
    );
    const Bravo = game.as(bravo);

    Bravo.play(blessingOfThemisYellow);
    game.helpers.resolveUntilIdle({ effectResolution: "Nimblism" });

    expectFabCard(Bravo, snatchRed).toBeIn("banished");
    expectFabCard(Bravo, snatchRed).toBeFaceUp();
  });

  it("timing: go again refunds the action point after the aura enters", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [blessingOfThemisYellow, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      namedCards,
    );
    const Bravo = game.as(bravo);

    Bravo.play(blessingOfThemisYellow);
    game.helpers.resolveUntilIdle({ effectResolution: "Snatch" });

    expectFabCard(Bravo, blessingOfThemisYellow).toBeIn("arena");
    Bravo.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
  });
});
