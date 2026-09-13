import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { auroraLegacyOfTempest } from "../heroes/aurora-legacy-of-tempest.ts";
import { stingingSpriteRed } from "./stinging-sprite.ts";
import { writtenInTheStarsBlue } from "./written-in-the-stars.ts";

describe("Written in the Stars (AST027) AAA", () => {
  it("happy: creates an Embodiment of Lightning token", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraLegacyOfTempest,
        hand: [writtenInTheStarsBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraLegacyOfTempest);

    Aurora.play(writtenInTheStarsBlue);
    game.helpers.resolveUntilIdle();

    expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");
    expectFabCard(Aurora, writtenInTheStarsBlue).toBeIn("graveyard");
  });

  it("boundary: without arcane damage this turn, this does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraLegacyOfTempest,
        hand: [writtenInTheStarsBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraLegacyOfTempest);

    Aurora.play(writtenInTheStarsBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Aurora).toHaveHandCount(0);
  });

  it("timing: after dealing arcane this turn, this draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraLegacyOfTempest,
        hand: [stingingSpriteRed, writtenInTheStarsBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraLegacyOfTempest);

    Aurora.playAttack(stingingSpriteRed, { stopAt: "on-attack" });
    Aurora.target(game.as(dash));
    game.helpers.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);

    Aurora.play(writtenInTheStarsBlue);
    game.helpers.resolveUntilIdle();

    expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");
    expectFabPlayer(Aurora).toHaveHandCount(1);
  });
});
