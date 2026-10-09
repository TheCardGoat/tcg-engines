import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { centralStationTransportationHub } from "../locations/203-central-station-transportation-hub";
import { portAuthorityCenterHub } from "../locations/034-port-authority-center-hub";
import { tianaRestauranteur } from "./176-tiana-restauranteur";
import { tianaPartyHostess } from "./196-tiana-party-hostess";

const handFiller = createMockCharacter({
  id: "tiana-hand-filler",
  name: "Hand Filler",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const deckFillerA = createMockCharacter({
  id: "tiana-deck-filler-a",
  name: "Deck Filler A",
  cost: 1,
});

const deckFillerB = createMockCharacter({
  id: "tiana-deck-filler-b",
  name: "Deck Filler B",
  cost: 1,
});

describe("Tiana - Party Hostess", () => {
  it("IDEAL VENUE can be declined and draws nothing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess, handFiller],
      inkwell: tianaPartyHostess.cost,
      deck: [deckFillerA, deckFillerB],
    });

    expect(testEngine.asPlayerOne().playCard(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tianaPartyHostess, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(handFiller)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(2);
  });

  it("draws 2, then discards a chosen non-location card which stays in the discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess, handFiller],
      inkwell: tianaPartyHostess.cost,
      deck: [deckFillerA, deckFillerB],
    });

    expect(testEngine.asPlayerOne().playCard(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tianaPartyHostess, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    // Choose and discard a card: the non-location filler.
    expect(testEngine.asPlayerOne().respondWith(handFiller)).toBeSuccessfulCommand();

    // 1 filler in hand + 2 drawn - 1 discarded = 2.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(testEngine.asPlayerOne().getCardZone(handFiller)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(deckFillerA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(deckFillerB)).toBe("hand");
  });

  it("lets you play a discarded location from the discard for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess, portAuthorityCenterHub],
      inkwell: tianaPartyHostess.cost,
      deck: [deckFillerA, deckFillerB],
    });

    expect(testEngine.asPlayerOne().playCard(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tianaPartyHostess, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    // Discard the location card.
    expect(testEngine.asPlayerOne().respondWith(portAuthorityCenterHub)).toBeSuccessfulCommand();
    // Accept the "you may play it from your discard for free" option.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tianaPartyHostess, {
        resolveOptional: true,
        targets: [portAuthorityCenterHub],
      }),
    ).toBeSuccessfulCommand();

    // The inkwell is fully spent, so entering play proves it was free.
    expect(testEngine.asPlayerOne().getCardZone(portAuthorityCenterHub)).toBe("play");
  });
  it("can decline the free play after drawing and discarding a location", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess, portAuthorityCenterHub],
      inkwell: 7,
      deck: [deckFillerA, deckFillerB],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(player.respondWith(portAuthorityCenterHub)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(player.getCardZone(portAuthorityCenterHub)).toBe("discard");
    expect(player.getCardZone(deckFillerA)).toBe("hand");
    expect(player.getCardZone(deckFillerB)).toBe("hand");
    expect(player.getZonesCardCount().deck).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getBagCount()).toBe(0);
  });

  it("can discard a card drawn by IDEAL VENUE", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess, handFiller],
      inkwell: 7,
      deck: [deckFillerA, deckFillerB],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(player.respondWith(deckFillerA)).toBeSuccessfulCommand();
    expect(player.getCardZone(deckFillerA)).toBe("discard");
    expect(player.getCardZone(deckFillerB)).toBe("hand");
    expect(player.getCardZone(handFiller)).toBe("hand");
    expect(player.getZonesCardCount().hand).toBe(2);
    expect(player.getZonesCardCount().deck).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getBagCount()).toBe(0);
  });
  it("cannot play an older discarded location instead of the location discarded this way", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess, portAuthorityCenterHub],
      discard: [centralStationTransportationHub],
      inkwell: 7,
      deck: [deckFillerA, deckFillerB],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(player.respondWith(portAuthorityCenterHub)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, {
        resolveOptional: true,
        targets: [centralStationTransportationHub],
      }),
    ).not.toBeSuccessfulCommand();
    expect(player.getCardZone(centralStationTransportationHub)).toBe("discard");
    expect(player.getCardZone(portAuthorityCenterHub)).toBe("discard");
    expect(
      player.resolvePendingByCard(tianaPartyHostess, {
        resolveOptional: true,
        targets: [portAuthorityCenterHub],
      }),
    ).toBeSuccessfulCommand();
    expect(player.getCardZone(portAuthorityCenterHub)).toBe("play");
    expect(player.getCardZone(centralStationTransportationHub)).toBe("discard");
  });
  it("Shift pays 5 and keeps a dry Tiana's damage and immediate quest ability (CR 8.10.4)", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess],
      inkwell: 5,
      deck: [deckFillerA, deckFillerB],
      play: [{ card: tianaRestauranteur, isDrying: false, damage: 1 }],
    });
    const player = engine.asPlayerOne();
    const base = engine.findCardInstanceId(tianaRestauranteur, "play", PLAYER_ONE);
    if (!base) throw new Error("Missing Tiana Shift base");
    expect(
      player.playCard(tianaPartyHostess, { cost: { cost: "shift", shiftTarget: base } }),
    ).toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getDamage(tianaPartyHostess)).toBe(1);
    expect(
      player.resolvePendingByCard(tianaPartyHostess, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(player.quest(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
    expect(player.getZonesCardCount().deck).toBe(2);
    expect(player.getZonesCardCount().hand).toBe(0);
  });

  it("cannot Shift for 5 when only 4 ink is available", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess],
      inkwell: 4,
      play: [{ card: tianaRestauranteur, isDrying: false, damage: 1 }],
    });
    const player = engine.asPlayerOne();
    const base = engine.findCardInstanceId(tianaRestauranteur, "play", PLAYER_ONE);
    if (!base) throw new Error("Missing Tiana Shift base");
    expect(
      player.playCard(tianaPartyHostess, { cost: { cost: "shift", shiftTarget: base } }),
    ).not.toBeSuccessfulCommand();
    expect(player.getCardZone(tianaPartyHostess)).toBe("hand");
    expect(player.getCardZone(tianaRestauranteur)).toBe("play");
    expect(player.getDamage(tianaRestauranteur)).toBe(1);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(player.getBagCount()).toBe(0);
  });
  for (const state of [
    { isDrying: true, exerted: false },
    { isDrying: false, exerted: true },
  ]) {
    it("Shift preserves the base's inability to quest: " + JSON.stringify(state), () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tianaPartyHostess],
        inkwell: 5,
        deck: [],
        play: [{ card: tianaRestauranteur, damage: 1, ...state }],
      });
      const player = engine.asPlayerOne();
      const base = engine.findCardInstanceId(tianaRestauranteur, "play", PLAYER_ONE);
      if (!base) throw new Error("Missing Tiana Shift base");
      expect(
        player.playCard(tianaPartyHostess, { cost: { cost: "shift", shiftTarget: base } }),
      ).toBeSuccessfulCommand();
      expect(
        player.resolvePendingByCard(tianaPartyHostess, { resolveOptional: false }),
      ).toBeSuccessfulCommand();
      expect(player.quest(tianaPartyHostess)).not.toBeSuccessfulCommand();
      expect(player.getDamage(tianaPartyHostess)).toBe(1);
      expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(engine.getLore(PLAYER_ONE)).toBe(0);
    });
  }

  it("cannot Shift onto a character with a different name", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess],
      inkwell: 5,
      play: [{ card: handFiller, isDrying: false }],
    });
    const player = engine.asPlayerOne();
    const base = engine.findCardInstanceId(handFiller, "play", PLAYER_ONE);
    if (!base) throw new Error("Missing invalid Shift base");
    expect(
      player.playCard(tianaPartyHostess, { cost: { cost: "shift", shiftTarget: base } }),
    ).not.toBeSuccessfulCommand();
    expect(player.getCardZone(tianaPartyHostess)).toBe("hand");
    expect(player.getCardZone(handFiller)).toBe("play");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(5);
    expect(player.getBagCount()).toBe(0);
  });

  it("still discards and can play the location when no cards can be drawn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess, portAuthorityCenterHub],
      inkwell: 7,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(player.respondWith(portAuthorityCenterHub)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, {
        resolveOptional: true,
        targets: [portAuthorityCenterHub],
      }),
    ).toBeSuccessfulCommand();
    expect(player.getCardZone(portAuthorityCenterHub)).toBe("play");
    expect(player.getZonesCardCount().hand).toBe(0);
    expect(player.getZonesCardCount().deck).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getBagCount()).toBe(0);
  });
  it("Player Two draws and freely plays only their discarded location", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [handFiller],
        deck: [deckFillerA, deckFillerB],
        discard: [centralStationTransportationHub],
      },
      {
        hand: [tianaPartyHostess, portAuthorityCenterHub],
        inkwell: 7,
        deck: [deckFillerA, deckFillerB],
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const player = engine.asPlayerTwo();
    expect(player.playCard(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(player.respondWith(portAuthorityCenterHub)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, {
        resolveOptional: true,
        targets: [portAuthorityCenterHub],
      }),
    ).toBeSuccessfulCommand();
    expect(player.getCardZone(portAuthorityCenterHub)).toBe("play");
    expect(player.getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(player.getZonesCardCount().hand).toBe(2);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(2);
    expect(engine.asPlayerOne().getCardZone(centralStationTransportationHub)).toBe("discard");
  });

  it("cannot Shift onto an opponent's Tiana", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tianaPartyHostess], inkwell: 5 },
      { play: [{ card: tianaRestauranteur, isDrying: false }] },
    );
    const player = engine.asPlayerOne();
    const base = engine.findCardInstanceId(tianaRestauranteur, "play", PLAYER_TWO);
    if (!base) throw new Error("Missing opposing Tiana");
    expect(
      player.playCard(tianaPartyHostess, { cost: { cost: "shift", shiftTarget: base } }),
    ).not.toBeSuccessfulCommand();
    expect(player.getCardZone(tianaPartyHostess)).toBe("hand");
    expect(engine.asPlayerTwo().getCardZone(tianaRestauranteur)).toBe("play");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(5);
    expect(player.getBagCount()).toBe(0);
  });

  it("normal play costs 7 and remains drying after declining IDEAL VENUE", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [tianaPartyHostess],
        inkwell: 7,
        deck: [deckFillerA, deckFillerB],
      },
      { deck: [handFiller, handFiller] },
    );
    const player = engine.asPlayerOne();
    expect(player.playCard(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(tianaPartyHostess, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.quest(tianaPartyHostess)).not.toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(player.passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(player.quest(tianaPartyHostess)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
    expect(player.getZonesCardCount().hand).toBe(1);
    expect(player.getZonesCardCount().deck).toBe(1);
    expect(player.getBagCount()).toBe(0);
  });

  it("normal unpaid play rejects and inking Tiana does not trigger IDEAL VENUE", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaPartyHostess],
      inkwell: 6,
      deck: [deckFillerA, deckFillerB],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(tianaPartyHostess)).not.toBeSuccessfulCommand();
    expect(player.getCardZone(tianaPartyHostess)).toBe("hand");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(6);
    expect(player.putIntoInkwell(PLAYER_ONE, tianaPartyHostess)).toBeSuccessfulCommand();
    expect(player.getCardZone(tianaPartyHostess)).toBe("inkwell");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(7);
    expect(player.getZonesCardCount().deck).toBe(2);
    expect(player.getZonesCardCount().hand).toBe(0);
    expect(player.getBagCount()).toBe(0);
  });
});
