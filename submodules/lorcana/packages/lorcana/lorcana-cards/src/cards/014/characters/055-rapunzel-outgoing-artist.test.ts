import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { rapunzelOutgoingArtist } from "./055-rapunzel-outgoing-artist";

const chosen = createMockCharacter({
  id: "rap-chosen",
  name: "Chosen Friend",
  version: "First",
  cost: 2,
});
const matching = createMockCharacter({
  id: "rap-matching",
  name: "Chosen Friend",
  version: "Second",
  cost: 3,
});
const other = createMockCharacter({ id: "rap-other", name: "Someone Else", cost: 1 });
const item = createMockItem({ id: "rap-item", name: "Chosen Friend", cost: 1 });

describe("Rapunzel - Outgoing Artist", () => {
  for (const opponent of [false, true]) {
    it(`draws for a matching name with a different version on ${opponent ? "opposing" : "friendly"} character`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rapunzelOutgoingArtist, isDrying: false }, ...(opponent ? [] : [chosen])],
          hand: [matching],
          deck: 3,
        },
        { play: opponent ? [chosen] : [], deck: 2 },
      );
      expect(engine.asPlayerOne().quest(rapunzelOutgoingArtist)).toBeSuccessfulCommand();
      expect(
        engine.asPlayerOne().resolvePendingByCard(rapunzelOutgoingArtist, {
          resolveOptional: true,
          targets: [chosen, matching],
        }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(2);
      expect(engine.asPlayerOne().getCardZone(matching)).toBe("hand");
      expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(2);
    });
  }

  it("allows declining without revealing or drawing", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelOutgoingArtist, chosen],
      hand: [matching],
      deck: 3,
    });
    expect(engine.asPlayerOne().quest(rapunzelOutgoingArtist)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(rapunzelOutgoingArtist, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(engine.asPlayerOne().getCardZone(matching)).toBe("hand");
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("reveals a nonmatching character without drawing", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelOutgoingArtist, chosen],
      hand: [other],
      deck: 3,
    });
    expect(engine.asPlayerOne().quest(rapunzelOutgoingArtist)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(rapunzelOutgoingArtist, {
        resolveOptional: true,
        targets: [chosen, other],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
  });
  it("collects the board target and reveal card in separate public choices", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelOutgoingArtist, chosen],
      hand: [matching, item],
      deck: 3,
    });
    expect(engine.asPlayerOne().quest(rapunzelOutgoingArtist)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(rapunzelOutgoingArtist, {
        resolveOptional: true,
        targets: [rapunzelOutgoingArtist],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(rapunzelOutgoingArtist, { resolveOptional: true, targets: [chosen] }),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveNextPending({ targets: [item] }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveNextPending({ targets: [matching] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    const revealedId = engine.findCardInstanceId(matching, "hand", "player_one");
    expect(engine.asPlayerTwo().getBoard().cards[revealedId]).toBeUndefined();
  });
  it("draws again on a later quest", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [rapunzelOutgoingArtist, chosen], hand: [matching], deck: 6 },
      { deck: 3 },
    );
    for (const turn of [0, 1]) {
      const before = engine.asPlayerOne().getZonesCardCount().hand;
      expect(engine.asPlayerOne().quest(rapunzelOutgoingArtist)).toBeSuccessfulCommand();
      expect(
        engine.asPlayerOne().resolvePendingByCard(rapunzelOutgoingArtist, {
          resolveOptional: true,
          targets: [chosen, matching],
        }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(before + 1);
      if (turn === 0) {
        expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
        expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      }
    }
  });
  it("player two reveals its own matching character and draws without leaving it public", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [chosen], deck: 6 },
      { play: [rapunzelOutgoingArtist], hand: [matching, item], deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = engine.asPlayerTwo().getZonesCardCount();
    expect(engine.asPlayerTwo().quest(rapunzelOutgoingArtist)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().resolvePendingByCard(rapunzelOutgoingArtist, {
        resolveOptional: true,
        targets: [chosen],
      }),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().resolveNextPending({ targets: [matching] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand + 1);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 1);
    expect(engine.asPlayerTwo().getCardZone(matching)).toBe("hand");
    expect(engine.asPlayerTwo().getCardZone(item)).toBe("hand");
    expect(engine.getLore(PLAYER_TWO)).toBe(1);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(engine.asPlayerTwo().getBagCount()).toBe(0);
    const revealedId = engine.findCardInstanceId(matching, "hand", PLAYER_TWO);
    expect(engine.asPlayerOne().getBoard().cards[revealedId]).toBeUndefined();
  });

  it("finishes without revealing or drawing when no other character is in play", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelOutgoingArtist],
      hand: [matching],
      deck: 6,
    });
    expect(engine.asPlayerOne().quest(rapunzelOutgoingArtist)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(rapunzelOutgoingArtist, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(engine.asPlayerOne().getCardZone(matching)).toBe("hand");
  });

  it("finishes without a reveal or draw when its hand is empty", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelOutgoingArtist, chosen],
      hand: [],
      deck: 6,
    });
    expect(engine.asPlayerOne().quest(rapunzelOutgoingArtist)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(rapunzelOutgoingArtist, {
        resolveOptional: true,
        targets: [chosen],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not draw when its hand contains only an item with the matching name", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rapunzelOutgoingArtist, chosen],
      hand: [item],
      deck: 6,
    });
    expect(engine.asPlayerOne().quest(rapunzelOutgoingArtist)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(rapunzelOutgoingArtist, {
        resolveOptional: true,
        targets: [chosen],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(engine.asPlayerOne().getCardZone(item)).toBe("hand");
  });
});
