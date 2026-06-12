import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pawpsicle } from "../../002/items/169-pawpsicle";
import { megabot } from "./098-megabot";

const damagedCharacter = createMockCharacter({
  id: "megabot-damaged-character",
  name: "Damaged Character",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("MegaBot", () => {
  it("enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [megabot],
      inkwell: megabot.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(megabot)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(megabot)).toBe(true);
  });

  it("can banish a chosen item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [megabot],
      },
      {
        deck: 2,
        play: [pawpsicle],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(megabot, {
        choiceIndex: 0,
        targets: [pawpsicle],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(megabot)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(pawpsicle)).toBe("discard");
  });

  it("surfaces the DESTROY! choice before asking for the chosen target", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [],
        play: [megabot],
      },
      {
        deck: [],
        play: [pawpsicle, { card: damagedCharacter, damage: 1 }],
      },
    );

    expect(testEngine.asPlayerOne().activateAbility(megabot)).toBeSuccessfulCommand();

    const [choicePrompt] = testEngine.asPlayerOne().getPendingEffects();
    expect(choicePrompt?.selectionContext).toMatchObject({
      kind: "choice-selection",
      options: [
        expect.objectContaining({
          index: 0,
          label: "Banish chosen item",
          legal: true,
        }),
        expect.objectContaining({
          index: 1,
          label: "Banish chosen damaged character",
          legal: true,
        }),
      ],
    });

    expect(testEngine.asPlayerOne().respondWithChoice(1)).toBeSuccessfulCommand();

    const damagedCharacterId = testEngine.findCardInstanceId(
      damagedCharacter,
      "play",
      "player_two",
    );
    const [targetPrompt] = testEngine.asPlayerOne().getPendingEffects();
    expect(targetPrompt?.selectionContext).toMatchObject({
      kind: "target-selection",
      cardCandidateIds: [damagedCharacterId],
    });

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacterId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(megabot)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(damagedCharacter)).toBe("discard");
  });

  it("can banish a chosen damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [megabot],
      },
      {
        deck: 2,
        play: [{ card: damagedCharacter, damage: 1 }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(megabot, {
        choiceIndex: 1,
        targets: [damagedCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(damagedCharacter)).toBe("discard");
  });
});
