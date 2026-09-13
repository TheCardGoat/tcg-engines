import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { toeTheLineRed } from "../instants/toe-the-line.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { tomeOfTheArknightBlue } from "./tome-of-the-arknight.ts";

/**
 * Tome of the Arknight (Blue) (ARC084) — Runeblade Action, go again.
 *
 * Printed: "Reveal the top 2 cards of your deck. If you reveal an attack
 * action card and a non-attack action card this way, put them into your hand."
 *
 * Fragment verdicts:
 * - RESOLVED (EG-2): the `revealed-attack-and-non-attack-action-this-way`
 *   has-status marker now classifies the revealed cohort by type box — an
 *   attack action is an Action card with the Attack subtype (CR 2.10/2.14),
 *   a non-attack action an Action card without it
 *   (engine: rules/evaluation/conditions/has-status.ts;
 *   reveal-and-contract-status.test.ts).
 * - RESOLVED (plan §5 module defect, W3-FIX3 2026-08-18): "put them into
 *   your hand" — the reveal step now declares `outputBinding: "them"`, so
 *   the reveal event stamps the revealed cohort onto the "them" binding
 *   (card-movement-effects.ts) and the follow-up move-card resolves it via
 *   layerWithEventBindings (HVY016 / CHN030 authoring precedent). The happy
 *   test proves the pair enters the hand; the boundary tests prove the pair
 *   gate still blocks non-matching cohorts.
 */

describe("Tome of the Arknight (Blue) (ARC084) AAA", () => {
  it("happy: attack action + non-attack action revealed → both enter the hand", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [tomeOfTheArknightBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue, // second-from-top: non-attack action (Generic Action)
          brutalAssaultBlue, // top (decks seed bottom-first): attack action
        ],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(tomeOfTheArknightBlue);
    game.helpers.resolveUntilIdle();

    // The pair gate passes and the outputBinding "them" cohort resolves: both
    // revealed cards are put into the hand (hand was empty after playing the
    // tome), the deck keeps the other four cards, and go again refunds the
    // spent action point (CR 8.3.4a).
    expectFabPlayer(Viserai).toHaveHandCount(2);
    expect(Viserai.cardsIn("hand", brutalAssaultBlue)).toHaveLength(1);
    expect(Viserai.cardsIn("hand", nimblismBlue)).toHaveLength(1);
    expect(Viserai.zone("deck")).toHaveLength(4);
    expectFabCard(Viserai, tomeOfTheArknightBlue).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveAP(1);
  });

  it("boundary: two attack actions revealed → neither leaves the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [tomeOfTheArknightBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          brutalAssaultBlue, // second-from-top: attack action
          brutalAssaultBlue, // top: attack action
        ],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(tomeOfTheArknightBlue);
    game.helpers.resolveUntilIdle();

    // The pair gate fails: nothing is put into hand (the tome itself resolves
    // to the graveyard and the revealed cards stay on top of the deck).
    expectFabPlayer(Viserai).toHaveHandCount(0);
    expect(Viserai.cardsIn("deck", brutalAssaultBlue)).toHaveLength(2);
    expectFabCard(Viserai, tomeOfTheArknightBlue).toBeIn("graveyard");
  });

  it("boundary: attack action + non-Action card revealed → nothing moves", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [tomeOfTheArknightBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          toeTheLineRed, // second-from-top: non-Action card (Warrior Instant)
          brutalAssaultBlue, // top: attack action (Generic Action + Attack)
        ],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(tomeOfTheArknightBlue);
    game.helpers.resolveUntilIdle();

    // The pair gate fails: a Warrior Instant is not a non-attack ACTION card
    // (CR 2.10/2.14), so nothing is put into hand and both revealed cards
    // stay on top of the deck.
    expectFabPlayer(Viserai).toHaveHandCount(0);
    expect(Viserai.cardsIn("deck", toeTheLineRed)).toHaveLength(1);
    expect(Viserai.cardsIn("deck", brutalAssaultBlue)).toHaveLength(1);
    expectFabCard(Viserai, tomeOfTheArknightBlue).toBeIn("graveyard");
  });
});
