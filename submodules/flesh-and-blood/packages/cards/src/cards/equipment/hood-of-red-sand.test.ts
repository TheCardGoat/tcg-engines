import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  advanceCombatToReaction,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { dash } from "../heroes/dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { sharpInclineRed, sharpInclineYellow } from "../actions/sharp-incline.ts";
import { hoodOfRedSand } from "./hood-of-red-sand.ts";

/**
 * Hood of Red Sand — Kassai Specialization Head d1, Battleworn.
 *
 * Printed: "Attack Reaction - {r}, banish a red and a yellow card from your
 * graveyard, destroy this: Target sword attack gets \"When this hits, draw a
 * card.\" Battleworn"
 */
describe("Hood of Red Sand AAA", () => {
  it("happy: the granted hit-draw fires — the sword hits and Kassai draws", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        head: [hoodOfRedSand],
        weapon1: [dawnblade],
        graveyard: [sharpInclineRed, sharpInclineYellow],
        hand: [],
        resourcePoints: 2, // 1 weapon activation + 1 AR
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(dawnblade);
    game.passBoth();
    advanceCombatToReaction(game, Kassai, game.as(dash));

    Kassai.activate(hoodOfRedSand);
    // Target the live sword attack (the Dawnblade proxy on the chain).
    Kassai.target(dawnblade);
    game.closeCombat({ ordering: "listed" });

    // Dash declined; the 3{p} sword hit and its granted trigger drew a card.
    expectFabPlayer(Kassai).toHaveHandCount(1);
    expectFabPlayer(game.as(dash)).toHaveLife(37);
    expect(Kassai.zone("banished")).toContain(sharpInclineRed.canonicalId);
    expect(Kassai.zone("banished")).toContain(sharpInclineYellow.canonicalId);
    expectFabCard(Kassai, hoodOfRedSand).toBeIn("graveyard");
  });

  it("boundary: without a yellow card to banish, the AR cost is unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        head: [hoodOfRedSand],
        weapon1: [dawnblade],
        graveyard: [sharpInclineRed],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(dawnblade);
    game.passBoth();
    advanceCombatToReaction(game, Kassai, game.as(dash));

    Kassai.expectActivationRejected(hoodOfRedSand);
    expectFabCard(Kassai, hoodOfRedSand).toBeIn("head");
  });

  it("timing: an Attack Reaction cannot be activated outside combat", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        head: [hoodOfRedSand],
        weapon1: [dawnblade],
        graveyard: [sharpInclineRed, sharpInclineYellow],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.expectActivationRejected(hoodOfRedSand);
    expectFabCard(Kassai, hoodOfRedSand).toBeIn("head");
  });
});
