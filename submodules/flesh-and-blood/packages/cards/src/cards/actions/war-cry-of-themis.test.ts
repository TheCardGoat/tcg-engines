import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { heraldOfProtectionRed } from "./herald-of-protection.ts";
import { heraldOfTriumphBlue } from "./herald-of-triumph.ts";
import { snatchRed } from "./snatch.ts";
import { warCryOfThemisYellow } from "./war-cry-of-themis.ts";

/**
 * War Cry of Themis (HNT257) — Light Illusionist Action yellow.
 *
 * Printed Instant: Discard this, banish X cards from your soul: Turn X target
 * cards in a banished zone face-down.
 */

describe("War Cry of Themis (HNT257) AAA", () => {
  it("happy: X=1 banishes one soul card and turns one target banished card face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        hand: [warCryOfThemisYellow],
        soul: [heraldOfProtectionRed],
        banished: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activate(warCryOfThemisYellow);
    Prism.chooseNumeric(1);
    Prism.targetRequired(heraldOfProtectionRed);
    Prism.targetRequired(snatchRed);
    game.passBoth();

    expectFabCard(Prism, warCryOfThemisYellow).toBeIn("graveyard");
    expectFabCard(Prism, heraldOfProtectionRed).toBeBanished();
    expectFabCard(Prism, snatchRed).toBeBanished().toBeFaceDown();
  });

  it("boundary: X=0 is legal and requires neither a soul card nor an effect target", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        hand: [warCryOfThemisYellow],
        soul: [],
        banished: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activate(warCryOfThemisYellow);
    game.passBoth();

    expectFabCard(Prism, warCryOfThemisYellow).toBeIn("graveyard");
    expectFabCard(Prism, snatchRed).toBeBanished().toBeFaceUp();
  });

  it("scaling: X=2 banishes exactly two soul cards and turns exactly two targets face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        hand: [warCryOfThemisYellow],
        soul: [heraldOfProtectionRed, heraldOfTriumphBlue],
        banished: [snatchRed, brutalAssaultBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activate(warCryOfThemisYellow);
    Prism.chooseNumeric(2);
    Prism.targetRequired(heraldOfProtectionRed, heraldOfTriumphBlue);
    Prism.targetRequired(snatchRed, brutalAssaultBlue);
    game.passBoth();

    expectFabCard(Prism, heraldOfProtectionRed).toBeBanished();
    expectFabCard(Prism, heraldOfTriumphBlue).toBeBanished();
    expectFabCard(Prism, snatchRed).toBeBanished().toBeFaceDown();
    expectFabCard(Prism, brutalAssaultBlue).toBeBanished().toBeFaceDown();
  });
});
