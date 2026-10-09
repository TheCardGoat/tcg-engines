import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { napoleonPatientWatchdog } from "./179-napoleon-patient-watchdog";

const evasiveOpponent = createMockCharacter({
  id: "napoleon-evasive-opponent",
  name: "Evasive Opponent",
  cost: 2,
  strength: 1,
  willpower: 5,
  abilities: [evasive],
});

const plainAlly = createMockCharacter({
  id: "napoleon-plain-ally",
  name: "Plain Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Napoleon - Patient Watchdog", () => {
  it("can challenge an Evasive character as if he had Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: napoleonPatientWatchdog, isDrying: false }],
        deck: 1,
      },
      {
        play: [{ card: evasiveOpponent, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(napoleonPatientWatchdog, evasiveOpponent),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(evasiveOpponent)).toBe("discard");
    expect(testEngine.asPlayerOne().getDamage(napoleonPatientWatchdog)).toBe(1);
    expect(testEngine.asPlayerOne().isExerted(napoleonPatientWatchdog)).toBe(true);
  });

  it("a character without Alert still can't challenge the Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: napoleonPatientWatchdog, isDrying: false },
          { card: plainAlly, isDrying: false },
        ],
        deck: 1,
      },
      {
        play: [{ card: evasiveOpponent, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(plainAlly, evasiveOpponent),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(evasiveOpponent)).toBe("play");
  });
  it("does not grant Evasive protection while defending", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: napoleonPatientWatchdog, exerted: true }], deck: 3 },
      { play: [{ card: plainAlly, isDrying: false }], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().challenge(plainAlly, napoleonPatientWatchdog),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(napoleonPatientWatchdog)).toBe("discard");
    expect(game.asPlayerTwo().getCardZone(plainAlly)).toBe("discard");
  });

  it.each(["ready defender", "drying attacker"])("Alert does not bypass %s", (boundary: string) => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: napoleonPatientWatchdog, isDrying: boundary === "drying attacker" }],
        deck: 3,
      },
      { play: [{ card: evasiveOpponent, exerted: boundary !== "ready defender" }], deck: 3 },
    );
    expect(
      game.asPlayerOne().challenge(napoleonPatientWatchdog, evasiveOpponent),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(napoleonPatientWatchdog)).toBe(false);
    expect(game.asPlayerTwo().getDamage(evasiveOpponent)).toBe(0);
  });

  it("pays three ink and waits to quest until the next own turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [napoleonPatientWatchdog],
      inkwell: 3,
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(napoleonPatientWatchdog)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk("player_one")).toBe(0);
    expect(game.asPlayerOne().quest(napoleonPatientWatchdog)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(napoleonPatientWatchdog)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(1);
  });
  it("rejects unpaid play and inks as one ready ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [napoleonPatientWatchdog],
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(napoleonPatientWatchdog)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(napoleonPatientWatchdog)).toBe("hand");
    expect(
      game.asPlayerOne().putIntoInkwell("player_one", napoleonPatientWatchdog),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(napoleonPatientWatchdog)).toBe("inkwell");
    expect(game.asServer().getAvailableInk("player_one")).toBe(1);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });

  it("player two can challenge Evasive with Alert", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: evasiveOpponent, exerted: true }], deck: 3 },
      { play: [{ card: napoleonPatientWatchdog, isDrying: false }], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().challenge(napoleonPatientWatchdog, evasiveOpponent),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(evasiveOpponent)).toBe("discard");
    expect(game.asPlayerTwo().getDamage(napoleonPatientWatchdog)).toBe(1);
  });
});
