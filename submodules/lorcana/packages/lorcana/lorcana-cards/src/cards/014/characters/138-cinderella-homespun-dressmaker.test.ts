import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cinderellaHomespunDressmaker } from "./138-cinderella-homespun-dressmaker";

const bottomCard = createMockCharacter({
  id: "cinderella-dressmaker-bottom",
  name: "Bottom Card",
  cost: 1,
});

const topCard = createMockCharacter({
  id: "cinderella-dressmaker-top",
  name: "Top Card",
  cost: 1,
});

describe("Cinderella - Homespun Dressmaker", () => {
  it("keeps the looked-at destination private in the move log", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaHomespunDressmaker],
      inkwell: 2,
      deck: [bottomCard, topCard],
    });
    const looked = g.findCardInstanceId(topCard, "deck", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(cinderellaHomespunDressmaker)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(cinderellaHomespunDressmaker),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(cinderellaHomespunDressmaker, {
        destinations: [{ zone: "deck-bottom", cards: [looked] }],
      }),
    ).toBeSuccessfulCommand();
    const logs = g.getServerEngine().getRuntime().getMoveLogHistory();
    expect(JSON.stringify(logs.flatMap((log) => log.public))).not.toContain(looked);
    expect(
      JSON.stringify(logs.flatMap((log) => log.privateByPlayerId?.[PLAYER_ONE] ?? [])),
    ).toContain(looked);
    expect(
      JSON.stringify(logs.flatMap((log) => log.privateByPlayerId?.[PLAYER_TWO] ?? [])),
    ).not.toContain(looked);
  });
  for (const zone of ["deck-top", "deck-bottom"] as const) {
    it(`moves only the exact top instance to ${zone}, preserving the other cards`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cinderellaHomespunDressmaker],
        inkwell: 3,
        deck: [bottomCard, topCard, topCard],
      });
      const ids = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      const looked = ids[2]!;
      expect(g.asPlayerOne().playCard(cinderellaHomespunDressmaker)).toBeSuccessfulCommand();
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(
        g.asPlayerOne().resolvePendingByCard(cinderellaHomespunDressmaker, {
          destinations: [{ zone, cards: [looked] }],
        }),
      ).toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(
        zone === "deck-top" ? ids : [looked, ids[0]!, ids[1]!],
      );
      expect(g.asPlayerOne().getBagCount()).toBe(0);
    });
    it(`handles a single-card deck with ${zone}`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cinderellaHomespunDressmaker],
        inkwell: 2,
        deck: [topCard],
      });
      expect(g.asPlayerOne().playCard(cinderellaHomespunDressmaker)).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolvePendingByCard(cinderellaHomespunDressmaker, {
          destinations: [{ zone, cards: [topCard] }],
        }),
      ).toBeSuccessfulCommand();
      expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([topCard.id]);
      expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });
  }
  it("does nothing with an empty deck and creates no card or pending choice", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaHomespunDressmaker],
      inkwell: 2,
      deck: [],
    });
    expect(g.asPlayerOne().playCard(cinderellaHomespunDressmaker)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([]);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(g.getStateForView("playerOne").status).toBe("playing");
  });
  it("rejects a card below the looked-at top card, then accepts a valid retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaHomespunDressmaker],
      inkwell: 2,
      deck: [bottomCard, topCard],
    });
    expect(g.asPlayerOne().playCard(cinderellaHomespunDressmaker)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(cinderellaHomespunDressmaker, {
        destinations: [{ zone: "deck-bottom", cards: [bottomCard] }],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([bottomCard.id, topCard.id]);
    expect(
      g.asPlayerOne().resolvePendingByCard(cinderellaHomespunDressmaker, {
        destinations: [{ zone: "deck-bottom", cards: [topCard] }],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([topCard.id, bottomCard.id]);
  });
  it("cannot play without enough ink and does not look at any cards", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaHomespunDressmaker],
      inkwell: 1,
      deck: [topCard],
    });
    expect(g.asPlayerOne().playCard(cinderellaHomespunDressmaker)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(cinderellaHomespunDressmaker)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("looks at player two's own deck without changing player one's deck", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [bottomCard, topCard] },
      { hand: [cinderellaHomespunDressmaker], inkwell: 2, deck: [topCard, bottomCard] },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // The turn draw removes Bottom Card before Cinderella looks at Top Card.
    expect(g.asPlayerTwo().playCard(cinderellaHomespunDressmaker)).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(cinderellaHomespunDressmaker, {
        destinations: [{ zone: "deck-bottom", cards: [topCard] }],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_TWO)).toEqual([topCard.id]);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([bottomCard.id, topCard.id]);
  });
  for (const zone of ["deck-top", "deck-bottom"] as const) {
    it(`Player Two alone can arrange its exact top card at ${zone} after an invalid retry`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: [bottomCard, topCard] },
        {
          hand: [cinderellaHomespunDressmaker],
          inkwell: 2,
          deck: [bottomCard, topCard, bottomCard],
        },
      );
      const ownBefore = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const ids = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      const [below, looked] = ids;
      if (!below || !looked) throw new Error("Expected two deck cards after draw");
      expect(g.asPlayerTwo().playCard(cinderellaHomespunDressmaker)).toBeSuccessfulCommand();
      // Use the browser’s two-step flow: inspect privately, then choose destination.
      expect(
        g.asPlayerTwo().resolvePendingByCard(cinderellaHomespunDressmaker),
      ).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolvePendingByCard(cinderellaHomespunDressmaker, {
          destinations: [{ zone, cards: [looked] }],
        }),
      ).not.toBeSuccessfulCommand();
      expect(
        g.asPlayerTwo().resolvePendingByCard(cinderellaHomespunDressmaker, {
          destinations: [{ zone, cards: [below] }],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(ids);
      expect(
        g.asPlayerTwo().resolvePendingByCard(cinderellaHomespunDressmaker, {
          destinations: [{ zone, cards: [looked] }],
        }),
      ).toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(
        zone === "deck-top" ? ids : [looked, below],
      );
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(ownBefore);
      expect(g.asPlayerTwo().getBagCount()).toBe(0);
      expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      const logs = g.getServerEngine().getRuntime().getMoveLogHistory();
      expect(JSON.stringify(logs.flatMap((log) => log.public))).not.toContain(looked);
      expect(
        JSON.stringify(logs.flatMap((log) => log.privateByPlayerId?.[PLAYER_TWO] ?? [])),
      ).toContain(looked);
      expect(
        JSON.stringify(logs.flatMap((log) => log.privateByPlayerId?.[PLAYER_ONE] ?? [])),
      ).not.toContain(looked);
    });
  }

  it("when played, puts the looked-at top card on the bottom of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaHomespunDressmaker],
      inkwell: cinderellaHomespunDressmaker.cost,
      deck: [bottomCard, topCard],
    });

    expect(testEngine.asPlayerOne().playCard(cinderellaHomespunDressmaker)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cinderellaHomespunDressmaker, {
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [topCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      topCard.id,
      bottomCard.id,
    ]);
  });

  it("when played, puts the looked-at top card back on the top of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cinderellaHomespunDressmaker],
      inkwell: cinderellaHomespunDressmaker.cost,
      deck: [topCard, bottomCard],
    });

    expect(testEngine.asPlayerOne().playCard(cinderellaHomespunDressmaker)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cinderellaHomespunDressmaker, {
        destinations: [
          { zone: "deck-top", cards: [bottomCard] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      topCard.id,
      bottomCard.id,
    ]);
  });
});
