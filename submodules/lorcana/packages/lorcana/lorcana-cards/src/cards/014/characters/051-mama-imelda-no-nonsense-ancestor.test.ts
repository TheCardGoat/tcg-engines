import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
  createMockLocation,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { mamImeldaNononsenseAncestor } from "./051-mama-imelda-no-nonsense-ancestor";

const ancestorSong = createMockCharacter({
  id: "imelda-test-ancestor-song",
  name: "Ancestor Song",
  cost: 2,
  strength: 1,
  willpower: 1,
});

describe("Mamá Imelda - No-Nonsense Ancestor", () => {
  it("puts 3 cards from the discard on the bottom of the deck and stays in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mamImeldaNononsenseAncestor],
      inkwell: mamImeldaNononsenseAncestor.cost,
      discard: [ancestorSong, ancestorSong, ancestorSong],
      deck: 2,
    });

    const zonesBefore = testEngine.asPlayerOne().getZonesCardCount();

    expect(testEngine.asPlayerOne().playCard(mamImeldaNononsenseAncestor)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const discardTargets = testEngine.getCardInstanceIdsInZone("discard", "player_one");
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mamImeldaNononsenseAncestor, {
        choiceIndex: 0,
        targets: discardTargets.slice(0, 3),
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mamImeldaNononsenseAncestor)).toBe("play");

    const zonesAfter = testEngine.asPlayerOne().getZonesCardCount();
    expect(zonesAfter.discard).toBe(zonesBefore.discard - 3);
    expect(zonesAfter.deck).toBe(zonesBefore.deck + 3);
  });

  it("lets the player choose to banish her instead", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mamImeldaNononsenseAncestor],
      inkwell: mamImeldaNononsenseAncestor.cost,
      discard: [ancestorSong, ancestorSong, ancestorSong],
      deck: 2,
    });

    const discardBefore = testEngine.getCardInstanceIdsInZone("discard", PLAYER_ONE);
    const deckBefore = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    const imeldaId = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE)[0]!;

    expect(testEngine.asPlayerOne().playCard(mamImeldaNononsenseAncestor)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mamImeldaNononsenseAncestor, {
        choiceIndex: 1,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mamImeldaNononsenseAncestor)).toBe("discard");
    expect(testEngine.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual([
      ...discardBefore,
      imeldaId,
    ]);
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(deckBefore);
    expect(testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE)).toEqual([]);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("banishes her when there are fewer than 3 cards in the discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mamImeldaNononsenseAncestor],
      inkwell: mamImeldaNononsenseAncestor.cost,
      discard: [ancestorSong],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(mamImeldaNononsenseAncestor)).toBeSuccessfulCommand();

    // The put-3 branch is illegal with fewer than 3 cards in the discard, so
    // the only printed-legal outcome is banishing her.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mamImeldaNononsenseAncestor, {
        choiceIndex: 1,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mamImeldaNononsenseAncestor)).toBe("discard");
  });
  it("requires exactly three own discard cards and preserves their chosen bottom order", () => {
    const item = createMockItem({ id: "imelda-return-item", name: "Item", cost: 1 });
    const location = createMockLocation({
      id: "imelda-return-location",
      name: "Location",
      cost: 1,
    });
    const extra = createMockCharacter({ id: "imelda-extra-discard", name: "Extra", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mamImeldaNononsenseAncestor],
        inkwell: 4,
        discard: [ancestorSong, item, location, extra],
        deck: 2,
      },
      { discard: [extra], deck: [] },
    );
    const ownTargets = engine.getCardInstanceIdsInZone("discard", PLAYER_ONE);
    const opponentTarget = engine.getCardInstanceIdsInZone("discard", "player_two")[0]!;
    expect(engine.asPlayerOne().playCard(mamImeldaNononsenseAncestor)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(mamImeldaNononsenseAncestor, {
        choiceIndex: 0,
        targets: ownTargets.slice(0, 2),
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(mamImeldaNononsenseAncestor, { choiceIndex: 0, targets: ownTargets }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(mamImeldaNononsenseAncestor, {
        choiceIndex: 0,
        targets: [ownTargets[0]!, ownTargets[1]!, opponentTarget],
      }),
    ).not.toBeSuccessfulCommand();
    const order = [ownTargets[2]!, ownTargets[0]!, ownTargets[1]!];
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(mamImeldaNononsenseAncestor, { choiceIndex: 0, targets: order }),
    ).toBeSuccessfulCommand();
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_ONE).slice(0, 3)).toEqual(order);
    expect(engine.asPlayerOne().getCardZone(mamImeldaNononsenseAncestor)).toBe("play");
    expect(engine.asPlayerOne().getCardZone(extra)).toBe("discard");
  });

  it("lets player two return three own cards in order and naturally draw them from the bottom", () => {
    const item = createMockItem({ id: "imelda-p2-item", name: "Item", cost: 1 });
    const location = createMockLocation({ id: "imelda-p2-location", name: "Location", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: [ancestorSong], deck: 6 },
      {
        hand: [mamImeldaNononsenseAncestor],
        inkwell: 4,
        discard: [ancestorSong, item, location],
        deck: 1,
      },
    );
    const targets = engine.getCardInstanceIdsInZone("discard", PLAYER_TWO);
    const order = [targets[2]!, targets[0]!, targets[1]!];
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(mamImeldaNononsenseAncestor)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(
      engine
        .asPlayerTwo()
        .resolvePendingByCard(mamImeldaNononsenseAncestor, { choiceIndex: 0, targets: order }),
    ).toBeSuccessfulCommand();
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(order);
    expect(engine.asPlayerTwo().getZonesCardCount().discard).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().discard).toBe(1);
    expect(engine.asPlayerTwo().getCardZone(mamImeldaNononsenseAncestor)).toBe("play");
    expect(engine.asPlayerTwo().quest(mamImeldaNononsenseAncestor)).not.toBeSuccessfulCommand();
    for (const target of [...order].reverse()) {
      expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(engine.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toContain(target);
    }
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(0);
  });

  for (const count of [0, 1, 2]) {
    it(`uses the banish outcome with only ${count} discard cards`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mamImeldaNononsenseAncestor],
        inkwell: 4,
        discard: Array.from({ length: count }, () => ancestorSong),
        deck: 2,
      });
      expect(engine.asPlayerOne().playCard(mamImeldaNononsenseAncestor)).toBeSuccessfulCommand();
      const targets = engine.getCardInstanceIdsInZone("discard", PLAYER_ONE);
      expect(
        engine
          .asPlayerOne()
          .resolvePendingByCard(mamImeldaNononsenseAncestor, { choiceIndex: 0, targets }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(mamImeldaNononsenseAncestor)).toBe("discard");
      expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(2);
    });
  }
});
