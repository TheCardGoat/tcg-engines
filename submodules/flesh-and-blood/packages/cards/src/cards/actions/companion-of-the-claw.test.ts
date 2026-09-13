import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { companionOfTheClawRed } from "./companion-of-the-claw.ts";

/**
 * Companion of the Claw (MST057) — When this attacks, if you've pitched a blue card this turn, create a Crouching Tiger in your hand.
 */

describe("Companion of the Claw (MST057) AAA", () => {
  it("happy: a blue card in pitch creates a Crouching Tiger in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [companionOfTheClawRed],
        pitch: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(companionOfTheClawRed, { stopAt: "on-attack" });
    expect(Katsu.zone("hand")).toContain("token:crouching-tiger");
    expectFabPlayer(Katsu).toHaveTokenCount("crouching-tiger", 0);
  });

  it("boundary: no blue in pitch creates no Crouching Tiger", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [companionOfTheClawRed],
        pitch: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(companionOfTheClawRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expect(Katsu.zone("hand")).not.toContain("token:crouching-tiger");
  });

  it("timing: the tiger is in hand at on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [companionOfTheClawRed],
        pitch: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(companionOfTheClawRed, { stopAt: "on-attack" });
    expect(Katsu.zone("hand")).toContain("token:crouching-tiger");
  });
});
