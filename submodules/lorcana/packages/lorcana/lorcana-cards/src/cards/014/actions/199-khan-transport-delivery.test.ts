import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli } from "../../001";
import { khanTransportDelivery } from "./199-khan-transport-delivery";

describe("Khan Transport Delivery", () => {
  it("draws a card and gets 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery],
      inkwell: khanTransportDelivery.cost,
      deck: [aladdinPrinceAli],
    });

    expect(testEngine.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();

    // Played from hand (-1), drew 1 (+1) → hand unchanged at 1.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("draws the exact deck card and spends two ink without consuming held drops", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery],
      inkwell: 2,
      inkDrops: 2,
      deck: [aladdinPrinceAli],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(player.getCardZone(aladdinPrinceAli)).toBe("hand");
    expect(player.getCardZone(khanTransportDelivery)).toBe("discard");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(player.getBagCount()).toBe(0);
  });

  it("spends one ink and one drop before replacing the spent drop", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery],
      inkwell: 1,
      inkDrops: 1,
      deck: [aladdinPrinceAli],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(khanTransportDelivery, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(player.getCardZone(aladdinPrinceAli)).toBe("hand");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getZonesCardCount().deck).toBe(0);
    expect(player.getZonesCardCount().discard).toBe(1);
  });

  it("can pay with two drops when no ready ink is available", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery],
      inkwell: 0,
      inkDrops: 2,
      deck: [aladdinPrinceAli],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(khanTransportDelivery, { inkDrops: 2 })).toBeSuccessfulCommand();
    expect(player.getCardZone(aladdinPrinceAli)).toBe("hand");
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getCardZone(khanTransportDelivery)).toBe("discard");
  });

  it("cannot use its future drop to pay the action", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery],
      inkwell: 1,
      inkDrops: 0,
      deck: [aladdinPrinceAli],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(khanTransportDelivery)).not.toBeSuccessfulCommand();
    expect(player.getCardZone(khanTransportDelivery)).toBe("hand");
    expect(player.getCardZone(aladdinPrinceAli)).toBe("deck");
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(1);
  });

  it("cannot be inked and does not draw or gain a drop on rejection", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery],
      inkwell: 2,
      inkDrops: 1,
      deck: [aladdinPrinceAli],
    });
    const player = engine.asPlayerOne();
    expect(player.putIntoInkwell(PLAYER_ONE, khanTransportDelivery)).not.toBeSuccessfulCommand();
    expect(player.getCardZone(khanTransportDelivery)).toBe("hand");
    expect(player.getCardZone(aladdinPrinceAli)).toBe("deck");
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(player.getBagCount()).toBe(0);
  });

  it("draws and gains a drop only for Player Two when Player Two plays it", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkwell: 3, inkDrops: 2, deck: 3 },
      {
        hand: [khanTransportDelivery],
        inkwell: 2,
        inkDrops: 1,
        deck: [aladdinPrinceAli, aladdinPrinceAli],
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const player = engine.asPlayerTwo();
    expect(player.playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(player.getZonesCardCount().hand).toBe(2);
    expect(player.getZonesCardCount().deck).toBe(0);
    expect(player.getCardZone(khanTransportDelivery)).toBe("discard");
    expect(player.getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(engine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  });

  it("gains the drop with an empty deck and loses only at the turn boundary", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [khanTransportDelivery], inkwell: 2, deck: [] },
      { deck: 3 },
    );
    const player = engine.asPlayerOne();
    expect(player.playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(player.getZonesCardCount().hand).toBe(0);
    expect(player.getZonesCardCount().deck).toBe(0);
    expect(player.getCardZone(khanTransportDelivery)).toBe("discard");
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.hasGameEnded()).toBe(false);
    expect(player.passTurn()).toBeSuccessfulCommand();
    expect(player.hasGameEnded()).toBe(true);
    expect(engine.asServer().getWinner()).toBe(PLAYER_TWO);
  });

  it("rejects an unavailable claimed drop even when ready ink covers the cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery],
      inkwell: 2,
      inkDrops: 0,
      deck: [aladdinPrinceAli],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(khanTransportDelivery, { inkDrops: 1 })).not.toBeSuccessfulCommand();
    expect(player.getCardZone(khanTransportDelivery)).toBe("hand");
    expect(player.getCardZone(aladdinPrinceAli)).toBe("deck");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(player.getZonesCardCount().discard).toBe(0);
  });
});
