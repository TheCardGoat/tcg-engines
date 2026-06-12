import { describe, expect, it } from "bun:test";
import type { ZoneId } from "#core";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "../../testing";

const fillerOne = createMockCharacter({ id: "delayed-filler-1", name: "Filler 1", cost: 1 });
const fillerTwo = createMockCharacter({ id: "delayed-filler-2", name: "Filler 2", cost: 1 });

const endOfTurnDrawSong = createMockSong({
  id: "delayed-end-draw",
  name: "Delayed End Draw",
  cost: 1,
  text: "At the end of your turn, draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "create-triggered-ability",
        lifecycle: {
          kind: "delayed",
          timing: "end-of-turn",
        },
        ability: {
          trigger: {
            event: "end-turn",
            on: "CONTROLLER",
            timing: "at",
          },
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        },
      },
    },
  ],
});

const nextTurnDrawSong = createMockSong({
  id: "delayed-next-turn-draw",
  name: "Delayed Next Turn Draw",
  cost: 1,
  text: "At the start of your next turn, draw a card. At the end of your next turn, draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-triggered-ability",
            lifecycle: {
              kind: "delayed",
              timing: "start-of-next-turn",
            },
            ability: {
              trigger: {
                event: "start-turn",
                on: "CONTROLLER",
                timing: "at",
              },
              effect: {
                amount: 1,
                target: "CONTROLLER",
                type: "draw",
              },
            },
          },
          {
            type: "create-triggered-ability",
            lifecycle: {
              kind: "delayed",
              timing: "end-of-next-turn",
            },
            ability: {
              trigger: {
                event: "end-turn",
                on: "CONTROLLER",
                timing: "at",
              },
              effect: {
                amount: 1,
                target: "CONTROLLER",
                type: "draw",
              },
            },
          },
        ],
      },
    },
  ],
});

const delayedChoiceSong = createMockSong({
  id: "delayed-choice",
  name: "Delayed Choice",
  cost: 1,
  text: "At the end of your turn, ready chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "create-triggered-ability",
        lifecycle: {
          kind: "delayed",
          timing: "end-of-turn",
        },
        ability: {
          trigger: {
            event: "end-turn",
            on: "CONTROLLER",
            timing: "at",
          },
          effect: {
            target: "CHOSEN_CHARACTER",
            type: "ready",
          },
        },
      },
    },
  ],
});

const delayedBanishChosenSong = createMockSong({
  id: "delayed-banish-chosen",
  name: "Delayed Banish Chosen",
  cost: 1,
  text: "Exert chosen character. At the end of your turn, banish them.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            target: "CHOSEN_CHARACTER",
            type: "exert",
          },
          {
            type: "create-triggered-ability",
            lifecycle: {
              kind: "delayed",
              timing: "end-of-turn",
            },
            ability: {
              trigger: {
                event: "end-turn",
                on: "CONTROLLER",
                timing: "at",
              },
              effect: {
                target: { ref: "previous-target" },
                type: "banish",
              },
            },
          },
        ],
      },
    },
  ],
});

describe("delayed triggers", () => {
  it("queues end-of-turn delayed triggers instead of resolving them immediately", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [endOfTurnDrawSong],
        inkwell: endOfTurnDrawSong.cost,
        deck: [fillerOne, fillerTwo],
      },
      {
        deck: [fillerOne, fillerTwo],
      },
    );

    expect(testEngine.asPlayerOne().playCard(endOfTurnDrawSong).success).toBe(true);

    const state = testEngine.asServer().getState();
    expect(state.G.triggeredAbilities.registrations).toHaveLength(1);
    expect(state.G.triggeredAbilities.registrations[0]).toMatchObject({
      controllerId: PLAYER_ONE,
      lifecycle: {
        kind: "delayed",
        dueWindow: "end-of-turn",
        timing: "end-of-turn",
      },
    });
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });

  it("auto-resolves deterministic end-of-turn delayed triggers before the turn advances", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [endOfTurnDrawSong],
        inkwell: endOfTurnDrawSong.cost,
        deck: [fillerOne, fillerTwo],
      },
      {
        deck: [fillerOne, fillerTwo],
      },
    );

    expect(testEngine.asPlayerOne().playCard(endOfTurnDrawSong).success).toBe(true);
    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

    expect(testEngine.getActivePlayer()).toBe(PLAYER_TWO);
    expect(testEngine.getCurrentPhase()).toBe("main");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asServer().getState().G.pendingTurnTransition).toBeUndefined();
    expect(testEngine.asServer().getState().G.triggeredAbilities.registrations).toHaveLength(0);
  });

  it("fires next-turn delayed triggers before the controller's draw step", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [nextTurnDrawSong],
        inkwell: nextTurnDrawSong.cost,
        deck: [fillerOne, fillerTwo, fillerOne, fillerTwo, fillerOne],
      },
      {
        deck: [fillerOne, fillerTwo, fillerOne],
      },
    );

    expect(testEngine.asPlayerOne().playCard(nextTurnDrawSong).success).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);

    expect(testEngine.asPlayerTwo().passTurn().success).toBe(true);
    expect(testEngine.getActivePlayer()).toBe(PLAYER_ONE);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [startTurnBag] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(startTurnBag!.sourceId).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(testEngine.getActivePlayer()).toBe(PLAYER_TWO);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asServer().getState().G.triggeredAbilities.registrations).toHaveLength(0);
  });

  it("requires explicit targets when a delayed trigger needs a choice and resolves once provided", () => {
    const chosenTarget = createMockCharacter({
      id: "delayed-choice-target",
      name: "Delayed Choice Target",
      cost: 2,
    });
    const otherTarget = createMockCharacter({
      id: "delayed-choice-other",
      name: "Delayed Choice Other",
      cost: 2,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [delayedChoiceSong],
        inkwell: delayedChoiceSong.cost,
        play: [
          { card: chosenTarget, exerted: true },
          { card: otherTarget, exerted: true },
        ],
        deck: [fillerOne, fillerTwo],
      },
      {
        deck: [fillerOne, fillerTwo],
      },
    );

    expect(testEngine.asPlayerOne().playCard(delayedChoiceSong).success).toBe(true);
    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    const chosenTargetId = testEngine.findCardInstanceId(chosenTarget, "play", PLAYER_ONE);
    const otherTargetId = testEngine.findCardInstanceId(otherTarget, "play", PLAYER_ONE);

    expect(bagEffect?.selectionContext).toBeDefined();
    expect(bagEffect?.selectionContext?.origin).toBe("bag");
    expect(bagEffect?.selectionContext?.requestId).toBe(bagEffect?.id);
    expect(bagEffect?.selectionContext?.kind).toBe("target-selection");
    if (!bagEffect?.selectionContext || bagEffect.selectionContext.kind !== "target-selection") {
      throw new Error("Expected a target-selection bag context");
    }
    expect(bagEffect.selectionContext.submitField).toBe("targets");
    expect(bagEffect.selectionContext.sourceCardId).toBe(bagEffect.sourceId);
    expect(bagEffect.selectionContext.cardCandidateIds).toEqual(
      expect.arrayContaining([chosenTargetId, otherTargetId]),
    );
    expect(bagEffect.selectionContext.playerCandidateIds).toEqual([]);
    expect(bagEffect.selectionContext.allowedZones).toEqual(["play"]);
    expect(bagEffect.selectionContext.minSelections).toBe(1);
    expect(bagEffect.selectionContext.maxSelections).toBe(1);
    expect(bagEffect.selectionContext.ordered).toBe(false);
    expect(bagEffect.selectionContext.targetDsl).toEqual(
      expect.arrayContaining([expect.objectContaining({ selector: "chosen" })]),
    );

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        targets: [chosenTargetId],
      }).success,
    ).toBe(true);

    expect(testEngine.getActivePlayer()).toBe(PLAYER_TWO);
    expect(testEngine.getCurrentPhase()).toBe("main");
    expect(testEngine.isExerted(chosenTarget)).toBe(false);
    expect(testEngine.asServer().getState().G.pendingTurnTransition).toBeUndefined();
    expect(testEngine.asPlayerOne().getPendingEffects()).toEqual([]);
  });

  it("clears delayed triggers whose target is gone before they resolve", () => {
    const target = createMockCharacter({
      id: "delayed-vanishing-target",
      name: "Delayed Vanishing Target",
      cost: 2,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [delayedBanishChosenSong],
        inkwell: delayedBanishChosenSong.cost,
        play: [target],
        deck: [fillerOne, fillerTwo],
      },
      {
        deck: [fillerOne, fillerTwo],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(delayedBanishChosenSong, { targets: [target] }).success,
    ).toBe(true);
    expect(testEngine.asServer().getState().G.triggeredAbilities.registrations).toHaveLength(1);

    expect(
      testEngine
        .asServer()
        .manualMoveCard(
          testEngine.findCardInstanceId(target, "play", PLAYER_ONE),
          `discard:${PLAYER_ONE}` as ZoneId,
        ).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asServer().getState().G.triggeredAbilities.registrations).toHaveLength(0);
    expect(testEngine.asPlayerOne().getCardZone(target)).toBe("discard");
  });
});
