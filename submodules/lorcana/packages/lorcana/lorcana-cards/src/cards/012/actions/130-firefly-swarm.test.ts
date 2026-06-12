import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { robinHoodSharpshooter } from "../../005";
import { fireflySwarm } from "./130-firefly-swarm";

const weakTarget = createMockCharacter({
  id: "firefly-swarm-weak",
  name: "Weak Target",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const strongTarget = createMockCharacter({
  id: "firefly-swarm-strong",
  name: "Strong Target",
  cost: 4,
  strength: 4,
  willpower: 5,
});

const filler1 = createMockAction({ id: "firefly-swarm-filler-1", name: "Filler 1", cost: 1 });
const filler2 = createMockAction({ id: "firefly-swarm-filler-2", name: "Filler 2", cost: 1 });

describe("Firefly Swarm", () => {
  it("option 1: banishes a chosen character with 2 strength or less", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireflySwarm],
        inkwell: fireflySwarm.cost,
      },
      {
        play: [weakTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardWithChoice(fireflySwarm, 0, {
        targets: [weakTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(weakTarget)).toBe("discard");
  });

  it("option 1: advances from the choice prompt to a target prompt", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireflySwarm],
        inkwell: fireflySwarm.cost,
        deck: [],
      },
      {
        play: [weakTarget],
        deck: [],
      },
    );

    expect(testEngine.asPlayerOne().playCard(fireflySwarm)).toBeSuccessfulCommand();

    const [choicePrompt] = testEngine.asPlayerOne().getPendingEffects();
    expect(choicePrompt?.selectionContext).toMatchObject({
      kind: "choice-selection",
      options: [
        expect.objectContaining({
          index: 0,
          label: "Banish chosen character with 2 {S} or less",
          legal: true,
        }),
        expect.objectContaining({
          index: 1,
          label:
            "If 2 or more other cards were put into your discard this turn, banish chosen character",
          legal: false,
        }),
      ],
    });

    expect(testEngine.asPlayerOne().respondWithChoice(0)).toBeSuccessfulCommand();

    const weakTargetId = testEngine.findCardInstanceId(weakTarget, "play", "player_two");
    const [targetPrompt] = testEngine.asPlayerOne().getPendingEffects();
    expect(targetPrompt?.selectionContext).toMatchObject({
      kind: "target-selection",
      cardCandidateIds: [weakTargetId],
    });

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [weakTargetId] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(weakTarget)).toBe("discard");
  });

  it("option 1: cannot banish a character with more than 2 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireflySwarm],
        inkwell: fireflySwarm.cost,
      },
      {
        play: [strongTarget],
      },
    );

    testEngine.asPlayerOne().playCardWithChoice(fireflySwarm, 0, {
      targets: [strongTarget],
    });

    expect(testEngine.asPlayerTwo().getCardZone(strongTarget)).toBe("play");
  });

  it("option 2: banishes chosen character when 2+ cards were put into your discard this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireflySwarm, filler1, filler2],
        inkwell: fireflySwarm.cost,
      },
      {
        play: [strongTarget],
      },
    );

    const filler1Id = testEngine.findCardInstanceId(filler1, "hand", PLAYER_ONE);
    const filler2Id = testEngine.findCardInstanceId(filler2, "hand", PLAYER_ONE);

    expect(
      testEngine.asServer().manualMoveCard(filler1Id, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualMoveCard(filler2Id, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCardWithChoice(fireflySwarm, 1, {
        targets: [strongTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(strongTarget)).toBe("discard");
  });

  it("option 2: is rejected when fewer than 2 cards were put into your discard this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireflySwarm, filler1],
        inkwell: fireflySwarm.cost,
      },
      {
        play: [strongTarget],
      },
    );

    const filler1Id = testEngine.findCardInstanceId(filler1, "hand", PLAYER_ONE);
    expect(
      testEngine.asServer().manualMoveCard(filler1Id, `discard:${PLAYER_ONE}` as ZoneId),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCardWithChoice(fireflySwarm, 1, {
        targets: [strongTarget],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(strongTarget)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(fireflySwarm)).toBe("hand");
  });

  it("regression: advances to target selection when played for free by Robin Hood - Sharpshooter", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [fireflySwarm, filler1, filler2, strongTarget],
        play: [{ card: robinHoodSharpshooter, isDrying: false }],
      },
      {
        play: [weakTarget],
        deck: [],
      },
    );

    expect(testEngine.asPlayerOne().quest(robinHoodSharpshooter)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(robinHoodSharpshooter),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "play", cards: [fireflySwarm] },
          { zone: "discard", cards: [filler1, filler2, strongTarget] },
        ],
      }),
    ).toBeSuccessfulCommand();

    const [choicePrompt] = testEngine.asPlayerOne().getPendingEffects();
    expect(choicePrompt?.selectionContext).toMatchObject({
      kind: "choice-selection",
      currentSelection: {},
    });
    if (choicePrompt?.selectionContext?.kind !== "choice-selection") {
      throw new Error("Expected Firefly Swarm to ask for a choice after Robin Hood plays it.");
    }
    expect(choicePrompt.selectionContext.currentSelection).not.toHaveProperty("resolveOptional");

    expect(testEngine.asPlayerOne().respondWithChoice(0)).toBeSuccessfulCommand();

    const weakTargetId = testEngine.findCardInstanceId(weakTarget, "play", "player_two");
    const [targetPrompt] = testEngine.asPlayerOne().getPendingEffects();
    expect(targetPrompt?.selectionContext).toMatchObject({
      kind: "target-selection",
    });
    if (targetPrompt?.selectionContext?.kind !== "target-selection") {
      throw new Error("Expected Firefly Swarm's choice to advance into target selection.");
    }
    expect(targetPrompt.selectionContext.cardCandidateIds).toContain(weakTargetId);
    expect(testEngine.asPlayerOne().getCardZone(fireflySwarm)).toBe("limbo");

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [weakTargetId] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(weakTarget)).toBe("discard");
  });
});
