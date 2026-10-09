// CR 2.2.0: 1.1.1, 1.3.5.1, 9.1-9.2. Each opposing player makes an independent choice.
// A discard/decline for one opponent must not resolve or suppress another opponent.
// Rules grounding: Hyperia City ink-drop mechanic — each ink drop may be
// removed to pay 1 {I} of any color; drops persist between turns.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { shereKhanOpportunisticTycoon } from "./081-shere-khan-opportunistic-tycoon";

const opponentCard = createMockCharacter({
  id: "shere-khan-tycoon-opponent-card",
  name: "Opponent Card",
  cost: 2,
});

describe("Shere Khan - Opportunistic Tycoon", () => {
  it("an opponent who discards denies you the ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shereKhanOpportunisticTycoon],
        inkwell: shereKhanOpportunisticTycoon.cost,
        deck: 6,
      },
      {
        hand: [opponentCard],
        deck: 6,
      },
    );

    const opponentCardId = testEngine.findCardInstanceId(opponentCard, "hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(shereKhanOpportunisticTycoon),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentCardId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentCard)).toBe("discard");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("an opponent who declines gives you 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shereKhanOpportunisticTycoon],
        inkwell: shereKhanOpportunisticTycoon.cost,
        deck: 6,
      },
      {
        hand: [opponentCard],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(shereKhanOpportunisticTycoon),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentCard)).toBe("hand");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });
});

it("an opponent with no hand cards gives the controller one drop", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanOpportunisticTycoon], inkwell: 4, deck: 6 },
    { hand: [], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(shereKhanOpportunisticTycoon),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  const publicLog = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(publicLog).not.toContain("no-valid-targets");
});
it("the opponent cannot discard the controller's hand card", () => {
  const own = createMockCharacter({ id: "shere-own-card", name: "Controller Card", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanOpportunisticTycoon, own], inkwell: 4, deck: 6 },
    { hand: [opponentCard], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(shereKhanOpportunisticTycoon),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().resolveNextPending({ targets: [own] })).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(own)).toBe("hand");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(
    game.asPlayerTwo().resolveNextPending({ targets: [opponentCard] }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});
it("the controller cannot make the opponent's discard decision", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanOpportunisticTycoon], inkwell: 4, deck: 6 },
    { hand: [opponentCard], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(shereKhanOpportunisticTycoon),
  ).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolveNextPending({ targets: [opponentCard] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(opponentCard)).toBe("hand");
});
it("each declined copy adds one to the controller's existing pool only", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [shereKhanOpportunisticTycoon, shereKhanOpportunisticTycoon],
      inkwell: 8,
      inkDrops: 2,
      deck: 6,
    },
    { hand: [opponentCard], inkDrops: 3, deck: 6 },
  );
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  for (const [index, copy] of copies.entries()) {
    expect(game.asPlayerOne().playCard(copy)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolvePendingByCard(copy)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveNextPending({ resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(index + 3);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  }
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
});
it("the reward can pay a later card with no bank ink", () => {
  const cheap = createMockCharacter({ id: "shere-drop-purchase", name: "Purchase", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanOpportunisticTycoon, cheap], inkwell: 4, deck: 6 },
    { hand: [opponentCard], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(shereKhanOpportunisticTycoon),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().playCard(cheap, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getCardZone(cheap)).toBe("play");
});
it("cannot pay for its own play with its future reward", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanOpportunisticTycoon], inkwell: 3, deck: 6 },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(shereKhanOpportunisticTycoon)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(shereKhanOpportunisticTycoon)).toBe("hand");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

for (const discards of [true, false]) {
  it(`player two gets the correct reward when player one ${discards ? "discards" : "declines"}`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [opponentCard], inkDrops: 3, deck: 6 },
      { hand: [shereKhanOpportunisticTycoon], inkwell: 4, inkDrops: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const cardId = game.findCardInstanceId(opponentCard, "hand", PLAYER_ONE)!;
    expect(game.asPlayerTwo().playCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(shereKhanOpportunisticTycoon),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveNextPending({ resolveOptional: false }),
    ).not.toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolveNextPending(discards ? { targets: [cardId] } : { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(cardId)).toBe(discards ? "discard" : "hand");
    expect(game.getInkDrops(PLAYER_TWO)).toBe(discards ? 2 : 3);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  });
}

for (const secondDiscards of [false, true]) {
  for (const thirdDiscards of [false, true]) {
    it(`each opponent chooses separately: second ${secondDiscards}, third ${thirdDiscards}`, () => {
      const third = "player_three";
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [shereKhanOpportunisticTycoon], inkwell: 4, inkDrops: 2, deck: 6 },
        { hand: [opponentCard], inkDrops: 3, deck: 6 },
        {
          additionalPlayers: {
            [third]: { hand: [opponentCard, opponentCard], inkDrops: 4, deck: 6 },
          },
        },
      );
      const p1 = g.asPlayerOne(),
        p2 = g.asPlayerTwo(),
        p3 = g.asLorcanaPlayer(third);
      const secondCard = g.getCardInstanceIdsInZone("hand", "player_two")[0]!;
      const thirdCards = g.getCardInstanceIdsInZone("hand", third);
      expect(thirdCards).toHaveLength(2);
      expect(p1.playCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();
      expect(p1.resolvePendingByCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();
      expect(p3.resolveNextPending({ resolveOptional: false })).not.toBeSuccessfulCommand();
      expect(
        p2.resolveNextPending(
          secondDiscards ? { targets: [secondCard] } : { resolveOptional: false },
        ),
      ).toBeSuccessfulCommand();
      expect(p2.getCardZone(secondCard)).toBe(secondDiscards ? "discard" : "hand");
      expect(g.getInkDrops(PLAYER_ONE)).toBe(secondDiscards ? 2 : 3);
      expect(p2.resolveNextPending({ resolveOptional: false })).not.toBeSuccessfulCommand();
      expect(
        p3.resolveNextPending(
          thirdDiscards ? { targets: [thirdCards[1]!] } : { resolveOptional: false },
        ),
      ).toBeSuccessfulCommand();
      expect(p3.getCardZone(thirdCards[1]!)).toBe(thirdDiscards ? "discard" : "hand");
      expect(p3.getCardZone(thirdCards[0]!)).toBe("hand");
      expect(g.getInkDrops(PLAYER_ONE)).toBe(2 + Number(!secondDiscards) + Number(!thirdDiscards));
      expect(g.getInkDrops(PLAYER_TWO)).toBe(3);
      expect(g.getInkDrops(third)).toBe(4);
      expect(p1.getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(p1.getBagCount()).toBe(0);
    });
  }
}

it("empty-hand opponent rewards once without skipping the other opponent's discard", () => {
  const third = "player_three";
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanOpportunisticTycoon], inkwell: 4, deck: 6 },
    { hand: [], deck: 6 },
    { additionalPlayers: { [third]: { hand: [opponentCard], deck: 6 } } },
  );
  const p = g.asPlayerOne(),
    p3 = g.asLorcanaPlayer(third);
  expect(p.playCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();
  expect(p.resolvePendingByCard(shereKhanOpportunisticTycoon)).toBeSuccessfulCommand();
  expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  const card = g.getCardInstanceIdsInZone("hand", third)[0]!;
  expect(p3.resolveNextPending({ targets: [card] })).toBeSuccessfulCommand();
  expect(p3.getCardZone(card)).toBe("discard");
  expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(p.getBagCount()).toBe(0);
});
