import { expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "./lorcana-multiplayer-test-engine";
import { createMockAction, createMockCharacter } from "./card-mocks";

const third = "player_three";
const card = createMockCharacter({ id: "three-player-card", name: "Fixture Card", cost: 1 });

it("additional fixture clients keep separate zones and participate in natural turn order", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [card], deck: 6 },
    { hand: [card], deck: 6 },
    { additionalPlayers: { [third]: { hand: [card, card], deck: 6, lore: 7, inkDrops: 2 } } },
  );
  expect(g.getCardInstanceIdsInZone("hand", third)).toHaveLength(2);
  const hiddenCard = g.getCardInstanceIdsInZone("hand", third)[0]!;
  const opponentBoard = g.asPlayerOne().getBoard();
  const maskedId = opponentBoard.players[third]!.hand[0]!;
  expect(opponentBoard.cards[hiddenCard]).toBeUndefined();
  expect(opponentBoard.cards[maskedId]?.hidden).toBe(true);
  expect(opponentBoard.cards[maskedId]?.definitionId).toBeUndefined();
  expect(g.asLorcanaPlayer(third).getBoard().cards[hiddenCard]?.definitionId).toBe(card.id);
  expect(g.getInkDrops(third)).toBe(2);
  expect(g.asLorcanaPlayer(third).getBoard().players[third]?.lore).toBe(7);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(g.getBoard("authoritative").turnPlayer).toBe(third);
  expect(g.asLorcanaPlayer(third).passTurn()).toBeSuccessfulCommand();
  expect(g.getBoard("authoritative").turnPlayer).toBe("player_one");
});

it("for-each-opponent resumes all choices and restores outer opponent scope", () => {
  const deal = createMockAction({
    id: "three-player-deal",
    name: "Deal",
    cost: 0,
    abilities: [
      {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "for-each-opponent",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "optional",
                    chooser: "OPPONENT",
                    effect: { type: "discard", target: "OPPONENT", chosen: true, amount: 1 },
                  },
                  {
                    type: "conditional",
                    condition: { type: "not", condition: { type: "if-you-do" } },
                    then: { type: "gain-ink-drop", amount: 1, target: "CONTROLLER" },
                  },
                ],
              },
            },
            { type: "draw", amount: 1, target: "OPPONENT" },
          ],
        },
      },
    ],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [deal], deck: 6 },
    { hand: [card], deck: 6 },
    { additionalPlayers: { [third]: { hand: [card], deck: 6 } } },
  );
  expect(g.asPlayerOne().playCard(deal)).toBeSuccessfulCommand();
  const own = g.getCardInstanceIdsInZone("hand", "player_two")[0]!;
  const wrong = g.getCardInstanceIdsInZone("hand", third)[0]!;
  expect(g.asPlayerTwo().resolveNextPending({ targets: [wrong] })).not.toBeSuccessfulCommand();
  expect(g.asPlayerTwo().resolveNextPending({ targets: [own] })).toBeSuccessfulCommand();
  expect(
    g.asLorcanaPlayer(third).resolveNextPending({ resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(g.getInkDrops("player_one")).toBe(1);
  expect(g.getCardInstanceIdsInZone("hand", "player_two")).toHaveLength(1);
  expect(g.getCardInstanceIdsInZone("deck", "player_two")).toHaveLength(5);
  expect(g.getCardInstanceIdsInZone("hand", third)).toHaveLength(1);
  expect(g.getCardInstanceIdsInZone("deck", third)).toHaveLength(6);
  expect(g.asPlayerOne().getBagCount()).toBe(0);
});

it("additional players receive default decks and accurate own/public visibility", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    {},
    {},
    { additionalPlayers: { [third]: { hand: [card], play: [card] } } },
  );
  expect(g.getCardInstanceIdsInZone("deck", third)).toHaveLength(10);
  const hand = g.findCardInstanceId(card, "hand", third);
  const publicCard = g.findCardInstanceId(card, "play", third);
  expect(g.isCardVisible(hand, third)).toBe(true);
  expect(g.isCardVisible(publicCard, third)).toBe(true);
  expect(g.isCardVisible(hand, "player_one")).toBe(false);
});

it("rotates opponent prompts from Player Two and restricts each selection to its own seat", () => {
  const action = createMockAction({
    id: "review-clockwise",
    name: "Clockwise",
    cost: 0,
    abilities: [
      {
        type: "action",
        effect: {
          type: "for-each-opponent",
          effect: {
            type: "banish",
            chosenBy: "opponent",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      },
    ],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [card, card] },
    { hand: [action] },
    { additionalPlayers: { [third]: { play: [card, card] } } },
  );
  const p1 = g.findCardInstanceId(card, "play", "player_one"),
    p3 = g.findCardInstanceId(card, "play", third);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().playCard(action)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().resolveNextPending({ targets: [p1] })).not.toBeSuccessfulCommand();
  expect(
    g.asLorcanaPlayer(third).resolveNextPending({ targets: [p1] }),
  ).not.toBeSuccessfulCommand();
  expect(g.asLorcanaPlayer(third).resolveNextPending({ targets: [p3] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().resolveNextPending({ targets: [p1] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(p1)).toBe("discard");
  expect(g.asLorcanaPlayer(third).getCardZone(p3)).toBe("discard");
});
