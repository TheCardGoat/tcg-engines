import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { madamMimNosyNeighbor } from "./146-madam-mim-nosy-neighbor";

const opponentCard1 = createMockCharacter({
  id: "mim-opp-card-1",
  name: "Opponent Card 1",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const opponentCard2 = createMockCharacter({
  id: "mim-opp-card-2",
  name: "Opponent Card 2",
  cost: 3,
  strength: 1,
  willpower: 4,
});

describe("Madam Mim - Nosy Neighbor", () => {
  it("does not inspect a hand when payment fails", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [madamMimNosyNeighbor], inkwell: 4 },
      { hand: [opponentCard1] },
    );
    expect(g.asPlayerOne().playCard(madamMimNosyNeighbor)).not.toBeSuccessfulCommand();
    expect(g.getAuthoritativeState().ctx.zones.reveals.active).toHaveLength(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(g.asPlayerOne().getCardZone(madamMimNosyNeighbor)).toBe("hand");
  });
  it("player two privately looks at player one's hand", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [opponentCard1, opponentCard2], deck: 6 },
      { hand: [madamMimNosyNeighbor], inkwell: 5, deck: 6 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(madamMimNosyNeighbor)).toBeSuccessfulCommand();
    const windows = g.getAuthoritativeState().ctx.zones.reveals.active;
    expect(windows).toHaveLength(1);
    expect(windows[0]?.visibleTo).toEqual([PLAYER_TWO]);
    expect(windows[0]?.cardIDs).toEqual(g.getCardInstanceIdsInZone("hand", PLAYER_ONE));
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });
  it("inking Mim does not look at the opponent's hand", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [madamMimNosyNeighbor] },
      { hand: [opponentCard1] },
    );
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, madamMimNosyNeighbor),
    ).toBeSuccessfulCommand();
    const hand = g.getCardInstanceIdsInZone("hand", PLAYER_TWO);
    expect(
      g
        .getAuthoritativeState()
        .ctx.zones.reveals.active.some((window) =>
          window.cardIDs.some((id) => hand.some((handId) => handId === id)),
        ),
    ).toBe(false);
  });
  it("NO HIDING privately looks at the opponent's hand without a public reveal", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [madamMimNosyNeighbor],
        inkwell: madamMimNosyNeighbor.cost,
      },
      {
        hand: [opponentCard1, opponentCard2],
      },
    );

    expect(testEngine.asPlayerOne().playCard(madamMimNosyNeighbor)).toBeSuccessfulCommand();

    const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);
    expect(opponentHandIds.length).toBe(2);

    const windows = testEngine.getAuthoritativeState().ctx.zones.reveals.active;
    expect(windows).toHaveLength(1);
    expect(windows[0]?.visibleTo).toEqual([PLAYER_ONE]);
    expect(windows[0]?.cardIDs).toEqual(opponentHandIds);
    const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
    for (const cardId of opponentHandIds) {
      expect(cardMeta[cardId]?.revealed).not.toBe(true);
      expect(testEngine.getBoard("spectator").cards[cardId]).toBeUndefined();
    }

    // Looking does not move or remove cards.
    expect(testEngine.asPlayerTwo().getCardZone(opponentCard1)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(opponentCard2)).toBe("hand");
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(2);
  });

  it("resolves an empty opposing hand without creating a reveal window", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [madamMimNosyNeighbor],
      inkwell: madamMimNosyNeighbor.cost,
    });

    expect(testEngine.asPlayerOne().playCard(madamMimNosyNeighbor)).toBeSuccessfulCommand();

    // Opponent has no cards in hand; nothing to reveal, and Madam Mim is in play.
    expect(testEngine.asPlayerOne().getCardZone(madamMimNosyNeighbor)).toBe("play");
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(0);
    expect(testEngine.getAuthoritativeState().ctx.zones.reveals.active).toHaveLength(0);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
});

it("does not expose a card drawn after the private look", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [madamMimNosyNeighbor], inkwell: 5, deck: 6 },
    { hand: [opponentCard1], deck: [opponentCard2] },
  );
  expect(g.asPlayerOne().playCard(madamMimNosyNeighbor)).toBeSuccessfulCommand();
  const firstHand = g.getCardInstanceIdsInZone("hand", PLAYER_TWO);
  expect(g.getAuthoritativeState().ctx.zones.reveals.active[0]?.cardIDs).toEqual(firstHand);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getCardZone(opponentCard2)).toBe("hand");
  const drawn = g.findCardInstanceId(opponentCard2, "hand", PLAYER_TWO);
  expect(
    g
      .getAuthoritativeState()
      .ctx.zones.reveals.active.some((window) => window.cardIDs.includes(drawn)),
  ).toBe(false);
  expect(g.getBoard("playerOne").cards[drawn]).toBeUndefined();
  expect(g.getBoard("spectator").cards[drawn]).toBeUndefined();
  expect(g.asPlayerTwo().getZonesCardCount().hand).toBe(2);
});

it("pays with four ink and one drop and looks only at the opposing hand", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [madamMimNosyNeighbor, opponentCard2], inkwell: 4, inkDrops: 1 },
    { hand: [opponentCard1] },
  );
  expect(g.asPlayerOne().playCard(madamMimNosyNeighbor, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  const windows = g.getAuthoritativeState().ctx.zones.reveals.active;
  expect(windows).toHaveLength(1);
  expect(windows[0]?.cardIDs).toEqual(g.getCardInstanceIdsInZone("hand", PLAYER_TWO));
  expect(windows[0]?.visibleTo).toEqual([PLAYER_ONE]);
  const ownHandCard = g.findCardInstanceId(opponentCard2, "hand", PLAYER_ONE);
  expect(g.getBoard("spectator").cards[ownHandCard]).toBeUndefined();
});

it("does not publicly reveal the remaining hand when an inspected card enters the inkwell", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [madamMimNosyNeighbor], inkwell: 5, deck: 6 },
    { hand: [opponentCard1, opponentCard2], deck: 6 },
  );
  expect(g.asPlayerOne().playCard(madamMimNosyNeighbor)).toBeSuccessfulCommand();
  const leaving = g.findCardInstanceId(opponentCard1, "hand", PLAYER_TWO);
  const remaining = g.findCardInstanceId(opponentCard2, "hand", PLAYER_TWO);
  expect(g.getAuthoritativeState().ctx.zones.reveals.active[0]?.cardIDs).toContain(leaving);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().putIntoInkwell(PLAYER_TWO, opponentCard1)).toBeSuccessfulCommand();
  expect(g.asServer().getCardZone(opponentCard1)).toBe("inkwell");
  expect(g.asServer().getCardZone(opponentCard2)).toBe("hand");
  expect(g.getAuthoritativeState().ctx.zones.private.cardMeta[remaining]?.revealed).not.toBe(true);
  expect(g.getBoard("playerOne").cards[remaining]?.definitionId).toBe(opponentCard2.id);
  expect(g.getBoard("spectator").cards[remaining]).toBeUndefined();
  expect(g.asPlayerTwo().getZonesCardCount().hand).toBe(2);
});
