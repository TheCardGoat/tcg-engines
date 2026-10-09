import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { khanIndustriesGreenwayLandmark } from "./204-khan-industries-greenway-landmark";

const attacker = createMockCharacter({
  id: "khan-industries-attacker",
  name: "Khan Industries Attacker",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const securityGuard = createMockCharacter({
  id: "khan-industries-security-guard",
  name: "Khan Industries Security Guard",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Khan Industries - Greenway Landmark", () => {
  it("normal inking does not create a location or grant lore and protection", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [khanIndustriesGreenwayLandmark],
        play: [{ card: securityGuard, exerted: true }],
        deck: 6,
      },
      { play: [attacker], deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(
      owner.putIntoInkwell("player_one", khanIndustriesGreenwayLandmark),
    ).toBeSuccessfulCommand();
    expect(owner.getCardZone(khanIndustriesGreenwayLandmark)).toBe("inkwell");
    expect(owner.getAvailableInk("player_one")).toBe(1);
    expect(engine.getLore("player_one")).toBe(0);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().challenge(attacker, securityGuard)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(securityGuard)).toBe(2);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(0);
    expect(owner.getCardZone(khanIndustriesGreenwayLandmark)).toBe("inkwell");
  });

  it("rejects unpaid movement and leaves an outside character challengeable", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [khanIndustriesGreenwayLandmark, { card: securityGuard, exerted: true }],
        inkwell: 1,
        deck: 6,
      },
      { play: [attacker], deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(
      owner.moveCharacterToLocation(securityGuard, khanIndustriesGreenwayLandmark).success,
    ).toBe(false);
    expect(owner.getAvailableInk("player_one")).toBe(1);
    expect(owner).not.toBeAtLocation({
      card: securityGuard,
      location: khanIndustriesGreenwayLandmark,
    });
    expect(owner.isExerted(securityGuard)).toBe(true);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().challenge(attacker, securityGuard)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(securityGuard)).toBe(2);
  });

  it("protects player two after paying its own movement cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [attacker], inkwell: 3, deck: 6 },
      { play: [khanIndustriesGreenwayLandmark, securityGuard], inkwell: 2, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const owner = engine.asPlayerTwo();
    expect(
      owner.moveCharacterToLocation(securityGuard, khanIndustriesGreenwayLandmark),
    ).toBeSuccessfulCommand();
    expect(owner.getAvailableInk("player_two")).toBe(0);
    expect(owner.getAvailableInk("player_one")).toBe(3);
    expect(owner).toBeAtLocation({ card: securityGuard, location: khanIndustriesGreenwayLandmark });
    expect(owner.quest(securityGuard)).toBeSuccessfulCommand();
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().challenge(attacker, securityGuard).success).toBe(false);
    expect(engine.asPlayerOne().isExerted(attacker)).toBe(false);
    expect(engine.asPlayerOne().getDamage(securityGuard)).toBe(0);
  });

  it("pays five to play and gains two location lore on each own turn only", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [khanIndustriesGreenwayLandmark], inkwell: 5, deck: 6 },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.playCard(khanIndustriesGreenwayLandmark)).toBeSuccessfulCommand();
    expect(owner.getAvailableInk("player_one")).toBe(0);
    expect(owner.getCardZone(khanIndustriesGreenwayLandmark)).toBe("play");
    expect(engine.getLore("player_one")).toBe(0);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(0);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(2);
    expect(engine.getLore("player_two")).toBe(0);
    expect(owner.passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(2);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore("player_one")).toBe(4);
  });

  it("rejects a four-ink play without payment or location lore", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [khanIndustriesGreenwayLandmark], inkwell: 4, deck: 6 },
      { deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.playCard(khanIndustriesGreenwayLandmark).success).toBe(false);
    expect(owner.getAvailableInk("player_one")).toBe(4);
    expect(owner.getCardZone(khanIndustriesGreenwayLandmark)).toBe("hand");
    expect(engine.getLore("player_one")).toBe(0);
  });

  it("ends protection when a challenge banishes the location", () => {
    const demolitionAttacker = createMockCharacter({
      id: "khan-demolition-attacker",
      name: "Demolition Attacker",
      cost: 8,
      strength: 8,
      willpower: 8,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          khanIndustriesGreenwayLandmark,
          { card: securityGuard, atLocation: khanIndustriesGreenwayLandmark, exerted: true },
        ],
        deck: 6,
      },
      { play: [demolitionAttacker, attacker], deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const opponent = engine.asPlayerTwo();
    expect(opponent.challenge(attacker, securityGuard).success).toBe(false);
    expect(opponent.isExerted(attacker)).toBe(false);
    expect(
      opponent.challenge(demolitionAttacker, khanIndustriesGreenwayLandmark),
    ).toBeSuccessfulCommand();
    expect(opponent).not.toBeAtLocation({
      card: securityGuard,
      location: khanIndustriesGreenwayLandmark,
    });
    expect(opponent.getCard(securityGuard)?.damage ?? 0).toBe(0);
    expect(opponent.challenge(attacker, securityGuard)).toBeSuccessfulCommand();
    expect(opponent.getCard(securityGuard)?.damage).toBe(2);
    expect(opponent.getCard(attacker)?.damage).toBe(2);
    expect(opponent.isExerted(attacker)).toBe(true);
  });

  it("ends protection when a character moves to another location", () => {
    const otherLocation = createMockLocation({
      id: "khan-other-location",
      name: "Other Location",
      cost: 1,
      moveCost: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          khanIndustriesGreenwayLandmark,
          otherLocation,
          { card: securityGuard, atLocation: khanIndustriesGreenwayLandmark, exerted: true },
        ],
        inkwell: 1,
        deck: 6,
      },
      { play: [attacker], deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.moveCharacterToLocation(securityGuard, otherLocation)).toBeSuccessfulCommand();
    expect(owner).toBeAtLocation({ card: securityGuard, location: otherLocation });
    expect(owner.passTurn()).toBeSuccessfulCommand();
    const opponent = engine.asPlayerTwo();
    expect(opponent.challenge(attacker, securityGuard)).toBeSuccessfulCommand();
    expect(opponent.getCard(securityGuard)?.damage).toBe(2);
    expect(opponent.getCard(attacker)?.damage).toBe(2);
    expect(opponent.isExerted(attacker)).toBe(true);
  });

  it("allows a protected character to challenge an opponent outside the location", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          khanIndustriesGreenwayLandmark,
          { card: attacker, atLocation: khanIndustriesGreenwayLandmark },
        ],
        deck: 6,
      },
      { play: [{ card: securityGuard, exerted: true }], deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(owner.challenge(attacker, securityGuard)).toBeSuccessfulCommand();
    expect(owner.getCard(securityGuard)?.damage).toBe(2);
    expect(owner.getCard(attacker)?.damage).toBe(2);
    expect(owner.isExerted(attacker)).toBe(true);
    expect(owner).toBeAtLocation({ card: attacker, location: khanIndustriesGreenwayLandmark });
  });

  it("protects an exerted character immediately after paid movement", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [khanIndustriesGreenwayLandmark, { card: securityGuard, exerted: true }],
        inkwell: 2,
        deck: 6,
      },
      { play: [attacker], deck: 6 },
    );
    const owner = engine.asPlayerOne();
    expect(
      owner.moveCharacterToLocation(securityGuard, khanIndustriesGreenwayLandmark),
    ).toBeSuccessfulCommand();
    expect(owner.getAvailableInk("player_one")).toBe(0);
    expect(owner).toBeAtLocation({ card: securityGuard, location: khanIndustriesGreenwayLandmark });
    expect(owner.passTurn()).toBeSuccessfulCommand();
    const opponent = engine.asPlayerTwo();
    expect(opponent.challenge(attacker, securityGuard).success).toBe(false);
    expect(opponent.isExerted(attacker)).toBe(false);
    expect(opponent.getCard(securityGuard)?.damage ?? 0).toBe(0);
    expect(opponent.getCard(attacker)?.damage ?? 0).toBe(0);
  });

  it("does not protect the location itself from challenges", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          khanIndustriesGreenwayLandmark,
          { card: securityGuard, atLocation: khanIndustriesGreenwayLandmark, exerted: true },
        ],
        deck: 6,
      },
      { play: [attacker], deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const opponent = engine.asPlayerTwo();
    expect(opponent.challenge(attacker, khanIndustriesGreenwayLandmark)).toBeSuccessfulCommand();
    expect(opponent.getCard(khanIndustriesGreenwayLandmark)?.damage).toBe(2);
    expect(opponent.getCard(securityGuard)?.damage ?? 0).toBe(0);
    expect(opponent.isExerted(attacker)).toBe(true);
  });

  it("High Security - characters here can't be challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          khanIndustriesGreenwayLandmark,
          { card: securityGuard, atLocation: khanIndustriesGreenwayLandmark, exerted: true },
        ],
        deck: 6,
      },
      {
        play: [attacker],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, securityGuard).success).toBe(false);
    expect(testEngine.asPlayerTwo().getCard(securityGuard)?.damage ?? 0).toBe(0);
  });

  it("High Security - characters elsewhere can still be challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [khanIndustriesGreenwayLandmark, { card: securityGuard, exerted: true }],
        deck: 6,
      },
      {
        play: [attacker],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, securityGuard).success).toBe(true);
  });
});
