/**
 * Regression tests for reported targeting bugs in triggered abilities.
 *
 * Bug 2 — Pocahontas "WHAT IS MY PATH?" (triggered on quest) allowed choosing
 * an opposing character with Ward. The Ward filter lives in
 * target-resolver.ts and applies only to `selector: "chosen"` descriptors.
 *
 * This test uses only engine mock cards (engine cannot import
 * @tcg/lorcana-cards per AGENTS.md).
 */

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "../index";
import { createMockCharacter, LorcanaMultiplayerTestEngine, PLAYER_ONE } from "../testing";

// Mock Pocahontas-like questing character with a "chosen" triggered ability.
const questTriggerWithChosenExerted = createMockCharacter({
  id: "bug2-quest-chooser",
  name: "Quest Chooser",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  abilities: [
    {
      id: "bug2-chooser-1",
      name: "WHAT IS MY PATH?",
      text: "Whenever this character quests, gain lore equal to another chosen exerted character's {L}.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: {
          type: "lore-value-of",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [{ type: "exerted" }],
            excludeSelf: true,
          },
        },
        target: "CONTROLLER",
      },
    },
  ],
});

// Mock opponent character with Ward (printed static keyword).
const opponentWithWard = createMockCharacter({
  id: "bug2-warded-opp",
  name: "Warded Opponent",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  abilities: [
    {
      id: "bug2-ward-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
  ],
});

describe("bug-2: triggered-ability 'chosen' target must filter opposing Ward", () => {
  it("cannot target an opposing Ward character when resolving quest trigger (granted Ward via static)", () => {
    const wardGranter = createMockCharacter({
      id: "bug2-ward-granter",
      name: "Ward Granter",
      cost: 4,
      strength: 2,
      willpower: 4,
      lore: 1,
      abilities: [
        {
          effect: {
            keyword: "Ward",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              excludeSelf: true,
            },
            type: "gain-keyword",
          },
          id: "bug2-granter-1",
          name: "GRANTED WARD",
          text: "Your other characters gain Ward.",
          type: "static",
        },
      ],
    });

    const exertedOpponent = createMockCharacter({
      id: "bug2-exerted-opp",
      name: "Exerted Opponent",
      cost: 3,
      strength: 2,
      willpower: 3,
      lore: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: questTriggerWithChosenExerted, isDrying: false }],
        deck: 3,
      },
      {
        play: [
          { card: wardGranter, isDrying: false },
          { card: exertedOpponent, exerted: true, isDrying: false },
        ],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().quest(questTriggerWithChosenExerted)).toBeSuccessfulCommand();

    const result = testEngine.asPlayerOne().resolvePendingByCard(questTriggerWithChosenExerted, {
      targets: [exertedOpponent],
    }) as CommandFailure;

    expect(result.success).toBe(false);
  });

  it("cannot target an opposing Ward character when resolving quest trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: questTriggerWithChosenExerted, isDrying: false }],
        deck: 3,
      },
      {
        play: [{ card: opponentWithWard, exerted: true, isDrying: false }],
        deck: 3,
      },
    );

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    expect(testEngine.asPlayerOne().quest(questTriggerWithChosenExerted)).toBeSuccessfulCommand();

    const result = testEngine.asPlayerOne().resolvePendingByCard(questTriggerWithChosenExerted, {
      targets: [opponentWithWard],
    }) as CommandFailure;

    expect(result.success).toBe(false);
  });
});
