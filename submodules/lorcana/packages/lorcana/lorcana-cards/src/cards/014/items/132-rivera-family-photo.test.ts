// CR 2.2.0: 6.1.2/6.1.3 (resolution and choice), 6.3.1.2 (items
// activate immediately), 4.4 (activation costs), 1.8.1.2 (turn-end deck loss).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
  createMockItem,
  createMockLocation,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { riveraFamilyPhoto as photo } from "./132-rivera-family-photo";
const bottom = createMockCharacter({ id: "photo-bottom", name: "Bottom", cost: 1 });
const second = createMockCharacter({ id: "photo-second", name: "Second", cost: 1 });
const top = createMockCharacter({ id: "photo-top", name: "Top", cost: 1 });
const action = createMockAction({ id: "photo-action", name: "Action", cost: 0 });
const item = createMockItem({ id: "photo-item", name: "Item", cost: 0 });
const location = createMockLocation({ id: "photo-location", name: "Location", cost: 0 });
const song = createMockSong({ id: "photo-song", name: "Song", cost: 0, text: "" });
const discard = [bottom, second, top, action, item, location, song, bottom, item, action, song];
const options = { ability: "Honor the Past" };
describe("Rivera Family Photo", () => {
  it("mills only the top two, pays one and exerts without affecting the opponent", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [photo], inkwell: 2, deck: [bottom, second, top] },
      { deck: [action], discard: [item] },
    );
    expect(
      g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(bottom)).toBe("deck");
    expect(g.asPlayerOne().getCardZone(second)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(top)).toBe("discard");
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(2);
    expect(g.asPlayerOne().isExerted(photo)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().getZonesCardCount().deck).toBe(1);
    expect(g.asPlayerTwo().getZonesCardCount().discard).toBe(1);
  });
  for (const count of [0, 9, 10, 11])
    it("lore mode resolves at own discard count " + count, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [photo], inkwell: 1, discard: discard.slice(0, count), deck: [bottom] },
        { discard, deck: [top] },
      );
      expect(
        g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 1 }),
      ).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_ONE)).toBe(count >= 10 ? 1 : 0);
      expect(g.getLore(PLAYER_TWO)).toBe(0);
      expect(g.asPlayerOne().getZonesCardCount().discard).toBe(count);
      expect(g.asPlayerOne().getZonesCardCount().deck).toBe(1);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(g.asPlayerOne().isExerted(photo)).toBe(true);
      expect(g.asPlayerOne()).toHavePendingEffectCount(0);
    });
  it("chooses lore below ten without milling and cannot reactivate the exerted item", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [photo],
      inkwell: 2,
      discard: discard.slice(0, 9),
      deck: [bottom, second, top],
    });
    expect(
      g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 0 }).success).toBe(
      false,
    );
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(9);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });
  for (const choiceIndex of [0, 1]) {
    it("rejects mode " + choiceIndex + " without ink and preserves ready state", () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [photo],
        deck: [bottom, second, top],
        discard,
      });
      expect(g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex }).success).toBe(
        false,
      );
      expect(g.asPlayerOne().isExerted(photo)).toBe(false);
      expect(g.asPlayerOne().getZonesCardCount().deck).toBe(3);
      expect(g.asPlayerOne().getZonesCardCount().discard).toBe(11);
      expect(g.getLore(PLAYER_ONE)).toBe(0);
    });
    it("rejects mode " + choiceIndex + " from an exerted Photo without spending ink", () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: photo, exerted: true }],
        inkwell: 1,
        deck: [bottom, second, top],
        discard,
      });
      expect(g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex }).success).toBe(
        false,
      );
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(g.asPlayerOne().getZonesCardCount().deck).toBe(3);
      expect(g.getLore(PLAYER_ONE)).toBe(0);
    });
  }
  for (const size of [0, 1, 2])
    it("mills the available " + size + " cards then loses only at own turn end", () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [photo], inkwell: 1, deck: [second, top].slice(0, size) },
        { deck: [bottom, action] },
      );
      expect(
        g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 0 }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getZonesCardCount().deck).toBe(0);
      expect(g.asPlayerOne().getZonesCardCount().discard).toBe(size);
      expect(g.asPlayerOne().isExerted(photo)).toBe(true);
      expect(g.asServer().getWinner()).toBeUndefined();
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.asServer().getWinner()).toBe(PLAYER_TWO);
    });
  it("plays and activates the item in the same turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [photo],
      inkwell: 2,
      deck: [bottom, second, top],
    });
    expect(g.asPlayerOne().playCard(photo)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(photo)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });
  it("readies on the next own turn and counts the updated discard", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [photo],
        inkwell: 1,
        discard: discard.slice(0, 8),
        deck: [bottom, action, second, top],
      },
      { deck: [song, item] },
    );
    expect(
      g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(10);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(photo)).toBe(false);
    expect(
      g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });
  it("pays the activation with a held ink drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [photo],
      inkDrops: 1,
      discard,
      deck: [bottom],
    });
    expect(
      g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 1, inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.getLore(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().isExerted(photo)).toBe(true);
  });
  for (const zone of ["hand", "discard", "opponent"])
    it("cannot activate a Photo in " + zone, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: zone === "hand" ? [photo] : [],
          discard: zone === "discard" ? [photo] : [],
          inkwell: 1,
          deck: [bottom, second, top],
        },
        { play: zone === "opponent" ? [photo] : [], deck: [item] },
      );
      expect(g.asPlayerOne().activateAbility(photo, { ...options, choiceIndex: 0 }).success).toBe(
        false,
      );
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(g.asPlayerOne().getZonesCardCount().deck).toBe(3);
    });
  it("inks without resolving either mode", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [photo],
      deck: [bottom, second, top],
      discard,
    });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, photo)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(photo)).toBe("inkwell");
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });
  it("Player Two owns the paid choice, mills exact top instances and chooses independent copies", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [photo], deck: [bottom, action], discard },
      {
        play: [photo, photo, photo],
        inkwell: 3,
        inkDrops: 2,
        discard: discard.slice(0, 9),
        deck: [bottom, second, top, action],
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const photos = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const beforeDeck = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    const beforeDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_TWO);
    const opposingDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    const opposingDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_ONE);
    expect(g.asPlayerTwo().activateAbility(photos[0]!, options)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(g.asPlayerTwo().isExerted(photos[0]!)).toBe(true);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(1);
    expect(g.asPlayerOne().resolveNextPending({ choiceIndex: 1 }).success).toBe(false);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(beforeDeck);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual(beforeDiscard);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(1);
    expect(g.asPlayerTwo().resolveNextPending({ choiceIndex: 1 })).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(beforeDeck);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual(beforeDiscard);
    expect(
      g.asPlayerTwo().activateAbility(photos[0]!, { ...options, choiceIndex: 0 }).success,
    ).toBe(false);
    expect(
      g.asPlayerTwo().activateAbility(photos[1]!, { ...options, choiceIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(beforeDeck.slice(0, 1));
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual([
      ...beforeDiscard,
      beforeDeck[2]!,
      beforeDeck[1]!,
    ]);
    expect(g.getLore(PLAYER_TWO)).toBe(0);
    expect(
      g.asPlayerTwo().activateAbility(photos[2]!, { ...options, choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(1);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(photos.every((id) => g.asPlayerTwo().isExerted(id))).toBe(true);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opposingDeck);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual(opposingDiscard);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(
      g
        .asServer()
        .getMoveLogHistory()
        .flatMap((log) => log.public),
    ).toContainEqual({
      key: "lorcana.outcome.cardsMilled",
      values: { playerId: PLAYER_TWO, amount: 2 },
    });
  });
  for (const size of [0, 1, 2])
    it("Player Two's exact ten-card lore threshold and short mill of " + size, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: [bottom, action], discard },
        {
          play: [photo, photo, photo],
          inkwell: 3,
          discard: discard.slice(0, 10),
          deck: [...[second, top].slice(0, size), action],
        },
      );
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const photos = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
      const beforeDeck = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      const beforeDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_TWO);
      const opposingDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      expect(
        g.asPlayerTwo().activateAbility(photos[0]!, { ...options, choiceIndex: 1 }),
      ).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_TWO)).toBe(1);
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(beforeDeck);
      expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual(beforeDiscard);
      expect(
        g.asPlayerTwo().activateAbility(photos[1]!, { ...options, choiceIndex: 0 }),
      ).toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([]);
      expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual([
        ...beforeDiscard,
        ...beforeDeck.toReversed(),
      ]);
      expect(g.getLore(PLAYER_TWO)).toBe(1);
      expect(g.asServer().getWinner()).toBeUndefined();
      expect(
        g.asPlayerTwo().activateAbility(photos[2]!, { ...options, choiceIndex: 1 }),
      ).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_TWO)).toBe(2);
      expect(g.asServer().getWinner()).toBeUndefined();
      expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
      expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(g.asServer().getWinner()).toBe(PLAYER_ONE);
      expect(g.asServer().getTurnNumber()).toBe(2);
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opposingDeck);
    });
});
