import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "../../../../testing";

const revealSource = createMockCharacter({
  id: "reveal-hand-source",
  name: "Hand Investigator",
  cost: 1,
  abilities: [
    {
      id: "reveal-hand-trigger",
      name: "REVEAL THEN DISCARD",
      type: "triggered",
      text: "When you play this character, reveal your opponent's hand, then choose a non-character for them to discard.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "sequence",
        steps: [
          { type: "reveal-hand", target: "OPPONENT" },
          {
            type: "discard",
            target: "OPPONENT",
            from: "hand",
            amount: 1,
            chosen: true,
            chosenBy: "you",
            filter: { notCardType: "character" },
          },
        ],
      },
    },
  ],
});
const handCharacter = createMockCharacter({
  id: "reveal-hand-character",
  name: "Revealed Character",
  cost: 1,
});

describe("reveal-hand", () => {
  for (const controller of [PLAYER_ONE, PLAYER_TWO]) {
    it(`reports a performed reveal even when the later discard has no target (${controller})`, () => {
      const sourceFixture = { hand: [revealSource], inkwell: 1, deck: 6 };
      const opponentFixture = { hand: [handCharacter], deck: 6 };
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        controller === PLAYER_ONE ? sourceFixture : opponentFixture,
        controller === PLAYER_TWO ? sourceFixture : opponentFixture,
      );
      const opponent = controller === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
      const handId = game.findCardInstanceId(handCharacter, "hand", opponent);
      if (controller === PLAYER_TWO) expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const actor = controller === PLAYER_ONE ? game.asPlayerOne() : game.asPlayerTwo();
      expect(actor.playCard(revealSource)).toBeSuccessfulCommand();
      expect(game.getAuthoritativeState().ctx.zones.private.cardMeta?.[handId]?.revealed).toBe(
        true,
      );
      expect(game.asServer().getCard(handId).zone).toBe("hand");
      expect(actor.getBagCount()).toBe(0);
      expect(actor.getPendingEffects()).toHaveLength(0);
      const messages = game
        .asServer()
        .getMoveLogHistory()
        .flatMap((entry) => entry.public);
      expect(messages).toContainEqual(
        expect.objectContaining({ key: "lorcana.bag.resolve.completed.named" }),
      );
      expect(
        messages.some((message) => message.key.startsWith("lorcana.bag.resolve.cancelled")),
      ).toBe(false);
    });
  }

  it("does not report a performed reveal when the opponent's hand is empty", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [revealSource], inkwell: 1, deck: 6 },
      { hand: [], deck: 6 },
    );
    expect(game.asPlayerOne().playCard(revealSource)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(game.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toHaveLength(0);
    const messages = game
      .asServer()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public);
    expect(
      messages.some((message) => message.key.startsWith("lorcana.bag.resolve.cancelled")),
    ).toBe(true);
    expect(
      messages.some((message) => message.key.startsWith("lorcana.bag.resolve.completed")),
    ).toBe(false);
  });
});
