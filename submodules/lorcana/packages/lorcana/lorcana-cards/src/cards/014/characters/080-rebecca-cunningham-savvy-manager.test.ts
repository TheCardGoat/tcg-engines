import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { rebeccaCunninghamSavvyManager } from "./080-rebecca-cunningham-savvy-manager";

const drawnCard = createMockCharacter({
  id: "rebecca-savvy-manager-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardedCard = createMockCharacter({
  id: "rebecca-savvy-manager-discarded-card",
  name: "Discarded Card",
  cost: 1,
});

describe("Rebecca Cunningham - Savvy Manager", () => {
  it("DUE DILIGENCE may draw a card, then choose and discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rebeccaCunninghamSavvyManager, discardedCard],
      deck: [drawnCard],
      inkwell: rebeccaCunninghamSavvyManager.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(rebeccaCunninghamSavvyManager),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rebeccaCunninghamSavvyManager, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rebeccaCunninghamSavvyManager, {
        targets: [discardedCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(discardedCard)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("DUE DILIGENCE can be declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rebeccaCunninghamSavvyManager, discardedCard],
      deck: [drawnCard],
      inkwell: rebeccaCunninghamSavvyManager.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(rebeccaCunninghamSavvyManager),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rebeccaCunninghamSavvyManager, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(discardedCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});

it("can discard the newly drawn card", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [rebeccaCunninghamSavvyManager, discardedCard],
    deck: [drawnCard],
    inkwell: 3,
  });
  expect(game.asPlayerOne().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
  expect(game.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [drawnCard] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(drawnCard)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(discardedCard)).toBe("hand");
});
it("rejects the opponent's hand card, then allows an own hand card", () => {
  const opponentCard = createMockCharacter({
    id: "rebecca-opponent-card",
    name: "Opponent Card",
    cost: 1,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [rebeccaCunninghamSavvyManager, discardedCard], deck: [drawnCard], inkwell: 3 },
    { hand: [opponentCard], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [opponentCard] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(opponentCard)).toBe("hand");
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [discardedCard] }),
  ).toBeSuccessfulCommand();
});
it("must discard the drawn card if it is the only hand card", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [rebeccaCunninghamSavvyManager],
    deck: [drawnCard],
    inkwell: 3,
  });
  expect(game.asPlayerOne().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [drawnCard] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().getCardZone(drawnCard)).toBe("discard");
});
it("still discards after accepting a draw from an empty deck", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [rebeccaCunninghamSavvyManager, discardedCard], deck: [], inkwell: 3 },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [discardedCard] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(discardedCard)).toBe("discard");
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
});
it("rejects choosing more than one discard card", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [rebeccaCunninghamSavvyManager, discardedCard],
    deck: [drawnCard],
    inkwell: 3,
  });
  expect(game.asPlayerOne().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [drawnCard, discardedCard] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
});

it("each played copy gets its own optional trigger", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [rebeccaCunninghamSavvyManager, rebeccaCunninghamSavvyManager, discardedCard],
    deck: [drawnCard, drawnCard],
    inkwell: 6,
  });
  const copies = game
    .getCardInstanceIdsInZone("hand", "player_one")
    .filter((id) => game.getCardDefinitionId(id) === rebeccaCunninghamSavvyManager.id);
  expect(game.asPlayerOne().playCard(copies[0]!)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(copies[0]!, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(copies[0]!, { targets: [discardedCard] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(copies[1]!)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(copies[1]!, { resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(1);
  expect(game.asPlayerOne().getZonesCardCount().discard).toBe(1);
});
it("quests for two lore without triggering Due Diligence", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [{ card: rebeccaCunninghamSavvyManager, isDrying: false }],
    deck: [drawnCard],
  });
  expect(game.asPlayerOne().quest(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(game.getLore("player_one")).toBe(2);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(1);
});

it("keeps the retained draw private but publishes the discarded card", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [rebeccaCunninghamSavvyManager, discardedCard],
    deck: [drawnCard],
    inkwell: 3,
  });
  const drawnId = game.findCardInstanceId(drawnCard, "deck", "player_one")!;
  const discardedId = game.findCardInstanceId(discardedCard, "hand", "player_one")!;
  expect(game.asPlayerOne().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [discardedCard] }),
  ).toBeSuccessfulCommand();
  const log = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(log).not.toContain(drawnId);
  expect(log).toContain(discardedId);
});

it("player two draws from their own deck and discards from their own hand privately", () => {
  const turnDraw = createMockCharacter({ id: "rebecca-turn-draw", name: "Turn Draw", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [discardedCard], deck: 6 },
    {
      hand: [rebeccaCunninghamSavvyManager, discardedCard],
      deck: [drawnCard, turnDraw],
      inkwell: 3,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const chosen = game.findCardInstanceId(discardedCard, "hand", "player_two")!;
  const opponent = game.findCardInstanceId(discardedCard, "hand", "player_one")!;
  const retained = game.findCardInstanceId(drawnCard, "deck", "player_two")!;
  expect(game.asPlayerTwo().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(retained)).toBe("hand");
  expect(
    game.asPlayerTwo().resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [opponent] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(opponent)).toBe("hand");
  expect(
    game.asPlayerTwo().resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [chosen] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(chosen)).toBe("discard");
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(2);
  const log = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(log).toContain(chosen);
  expect(log).not.toContain(retained);
  expect(log).not.toContain(opponent);
});

for (const accept of [true, false]) {
  it(`Player Two ${accept ? "accepts an empty-deck draw and still discards" : "declines an empty-deck draw without discarding"}`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [discardedCard], deck: 6 },
      { hand: [rebeccaCunninghamSavvyManager, discardedCard], deck: [drawnCard], inkwell: 3 },
    );
    const ownDiscard = game.findCardInstanceId(discardedCard, "hand", "player_two")!;
    const opposingDiscard = game.findCardInstanceId(discardedCard, "hand", "player_one")!;
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: accept }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(2);
    if (accept)
      expect(
        game
          .asPlayerTwo()
          .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [ownDiscard] }),
      ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(accept ? 1 : 2);
    expect(game.asPlayerTwo().getCardZone(ownDiscard)).toBe(accept ? "discard" : "hand");
    expect(game.asPlayerOne().getCardZone(opposingDiscard)).toBe("hand");
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asServer().hasGameEnded()).toBe(false);
  });
}
it("Player Two accepted empty-deck draw with no hand completes without an impossible discard", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { hand: [rebeccaCunninghamSavvyManager], deck: [drawnCard], inkwell: 3 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().ink(drawnCard)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(0);
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asServer().getWinner()).toBe(PLAYER_ONE);
});
it("Player Two rejects excess or board discard targets and can recover with one hand card", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    {
      hand: [rebeccaCunninghamSavvyManager, discardedCard],
      deck: [drawnCard, drawnCard],
      inkwell: 3,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(rebeccaCunninghamSavvyManager)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  const before = game.asPlayerTwo().getZonesCardCount().hand;
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [discardedCard, drawnCard] }),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(rebeccaCunninghamSavvyManager, {
      targets: [rebeccaCunninghamSavvyManager],
    }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before);
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(rebeccaCunninghamSavvyManager, { targets: [discardedCard] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before - 1);
  expect(game.asPlayerTwo().getCardZone(discardedCard)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(rebeccaCunninghamSavvyManager)).toBe("play");
});
