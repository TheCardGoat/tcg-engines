import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, createMockItem } from "./index";

const allowed = createMockItem({ id: "named-scry-allowed", name: "Named Guide", cost: 1 });
const other = createMockItem({ id: "named-scry-other", name: "Other Item", cost: 1 });
const wrongType = createMockCharacter({
  id: "named-scry-wrong-type",
  name: "Named Guide",
  cost: 1,
});
function scout(revealAll = true) {
  return createMockCharacter({
    id: "named-scry-scout",
    name: "Scout",
    cost: 1,
    abilities: [
      {
        type: "triggered",
        trigger: { event: "play", on: "SELF", timing: "when" },
        effect: {
          type: "scry",
          amount: 1,
          revealAll,
          destinations: [
            {
              zone: "hand",
              min: 0,
              max: 1,
              filter: {
                type: "and",
                filters: [
                  { type: "card-type", cardType: "item" },
                  { type: "has-name", name: "Named Guide" },
                ],
              },
            },
            { zone: "deck-bottom", remainder: true },
          ],
        },
      },
    ],
  });
}

describe("named scry destinations and reveal logs", () => {
  for (const top of [allowed, other, wrongType]) {
    it(`validates ${top.id} in direct bag resolution`, () => {
      const source = scout();
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [source],
        deck: [top],
        inkwell: 1,
      });
      expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
      const result = game.asPlayerOne().resolvePendingByCard(source, {
        destinations: [
          { zone: "hand", cards: [top] },
          { zone: "deck-bottom", cards: [] },
        ],
      });
      if (top === allowed) {
        expect(result).toBeSuccessfulCommand();
        expect(game.asPlayerOne().getCardZone(top)).toBe("hand");
      } else {
        expect(result).not.toBeSuccessfulCommand();
        expect(game.asPlayerOne().getCardZone(top)).toBe("deck");
      }
    });
  }
  for (const revealAll of [false, true]) {
    it(`publishes card identities only with revealAll=${revealAll}`, () => {
      const source = scout(revealAll);
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [source],
        deck: [other],
        inkwell: 1,
      });
      expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().resolvePendingByCard(source)).toBeSuccessfulCommand();
      const reveals = game
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .flatMap((entry) => entry.public)
        .filter((message) => message.key === "lorcana.effect.resolve.revealTopCard");
      expect(reveals).toHaveLength(revealAll ? 1 : 0);
      expect(game.asPlayerOne().getCardZone(other)).toBe("deck");
    });
  }
});

it("validates a direct scry against the targeted opponent deck", () => {
  const source = createMockCharacter({
    id: "opponent-scry-scout",
    name: "Opponent Scout",
    cost: 1,
    abilities: [
      {
        type: "triggered",
        trigger: { event: "play", on: "SELF", timing: "when" },
        effect: {
          type: "scry",
          amount: 1,
          target: "EACH_OPPONENT",
          destinations: [{ zone: "deck-top", remainder: true }],
        },
      },
    ],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [source], inkwell: 1, deck: [other] },
    { deck: [allowed] },
  );
  expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(source, {
      destinations: [{ zone: "deck-top", cards: [allowed] }],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(allowed)).toBe("deck");
});

for (const revealAll of [false, true]) {
  it(`bottom destination identities are public only when the look reveals all: ${revealAll}`, () => {
    const source = scout(revealAll);
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [source],
      deck: [other, allowed],
      inkwell: 1,
    });
    const cardId = game.getCardInstanceIdsInZone("deck", "player_one").at(-1)!;
    expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolvePendingByCard(source)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(source, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "deck-bottom", cards: [cardId] },
        ],
      }),
    ).toBeSuccessfulCommand();
    const messages = game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public);
    const details = messages.filter(
      (message) => message.key === "lorcana.effect.resolve.scrySelection.detail",
    );
    expect(details).toHaveLength(revealAll ? 1 : 0);
    if (revealAll)
      expect(details[0]?.values.destinations).toEqual([
        { zone: "deck-bottom", cardIds: [cardId], revealed: true },
      ]);
    expect(game.getCardInstanceIdsInZone("deck", "player_one")[0]).toBe(cardId);
  });
}
