import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { riptide } from "../heroes/riptide.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { takeTheBaitRed } from "./take-the-bait.ts";

/**
 * Take the Bait (SUP258) — Riptide Specialization Ranger Action, cost 0, 3{d}.
 *
 * Printed: Search your deck for a card, then shuffle and put it on top.
 * Create a Bait token under an opponent's control. Go again.
 *
 * Search-to-deck shuffles the remainder first, then puts the chosen card on top.
 */

describe("Take the Bait (SUP258) AAA", () => {
  it("happy: searching still creates Bait under the opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [takeTheBaitRed],
        deck: [
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          snatchRed,
        ],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);
    const Dash = game.as(dash);

    Riptide.play(takeTheBaitRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargetCanonicalId: snatchRed.canonicalId,
    });

    const deck = Riptide.zone("deck");
    expect(deck[deck.length - 1]).toBe(snatchRed.canonicalId);
    expectFabPlayer(Dash).toHaveTokenCount("bait", 1);
    expectFabPlayer(Riptide).toHaveTokenCount("bait", 0);
    expectFabCard(Riptide, takeTheBaitRed).toBeIn("graveyard");
  });

  it("boundary: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [takeTheBaitRed],
        deck: [
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);

    expectFabPlayer(Riptide).toHaveAP(1);
    Riptide.play(takeTheBaitRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Riptide).toHaveAP(1);
  });

  it("timing: an empty-of-choice deck still creates Bait for the opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [takeTheBaitRed],
        deck: [
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(riptide).play(takeTheBaitRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveTokenCount("bait", 1);
  });
});
