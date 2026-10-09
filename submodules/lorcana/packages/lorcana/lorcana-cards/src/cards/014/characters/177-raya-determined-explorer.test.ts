import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockLocation,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { rayaDeterminedExplorer } from "./177-raya-determined-explorer";

const firstLocation = createMockLocation({
  id: "raya-first-location",
  name: "First Location",
  cost: 2,
});

const secondLocation = createMockLocation({
  id: "raya-second-location",
  name: "Second Location",
  cost: 2,
});

describe("Raya - Determined Explorer", () => {
  it("pays printed cost and dries before questing with the location bonus", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [rayaDeterminedExplorer], play: [firstLocation], inkwell: 1, deck: 3 },
      { deck: 3 },
    );
    expect(game.asPlayerOne().playCard(rayaDeterminedExplorer)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk("player_one")).toBe(0);
    expect(game.asPlayerOne().getCardLore(rayaDeterminedExplorer)).toBe(2);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().quest(rayaDeterminedExplorer)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    const before = game.getLore("player_one");
    expect(game.asPlayerOne().quest(rayaDeterminedExplorer)).toBeSuccessfulCommand();
    expect(game.getLore("player_one") - before).toBe(2);
  });

  it("rejects unpaid play and inks as one ready ink without a static source in play", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rayaDeterminedExplorer],
      deck: [],
    });
    expect(game.asPlayerOne().playCard(rayaDeterminedExplorer)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(rayaDeterminedExplorer)).toBe("hand");
    expect(
      game.asPlayerOne().putIntoInkwell("player_one", rayaDeterminedExplorer),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(rayaDeterminedExplorer)).toBe("inkwell");
    expect(game.asServer().getAvailableInk("player_one")).toBe(1);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });
  it("loses one lore immediately when a friendly location is banished", () => {
    const removal = createMockAction({
      id: "raya-remove-location",
      name: "Remove Location",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              cardTypes: ["location"],
              zones: ["play"],
            },
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: rayaDeterminedExplorer, isDrying: false }, firstLocation, secondLocation],
      hand: [removal],
      deck: [],
    });
    expect(game.asPlayerOne().getCardLore(rayaDeterminedExplorer)).toBe(3);
    expect(
      game.asPlayerOne().playCard(removal, { targets: [firstLocation] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(firstLocation)).toBe("discard");
    expect(game.asPlayerOne().getCardLore(rayaDeterminedExplorer)).toBe(2);
    expect(game.asPlayerOne().quest(rayaDeterminedExplorer)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(2);
  });

  it("each player's Raya counts only that player's locations", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: rayaDeterminedExplorer, isDrying: false }, firstLocation], deck: 3 },
      {
        play: [{ card: rayaDeterminedExplorer, isDrying: false }, secondLocation, secondLocation],
        deck: 3,
      },
    );
    const one = game.findCardInstanceId(rayaDeterminedExplorer, "play", "player_one");
    const two = game.findCardInstanceId(rayaDeterminedExplorer, "play", "player_two");
    expect(game.asPlayerOne().getCardLore(one)).toBe(2);
    expect(game.asPlayerTwo().getCardLore(two)).toBe(3);
    expect(game.asPlayerOne().quest(one)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(2);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const beforeQuest = game.getLore("player_two");
    expect(game.asPlayerTwo().quest(two)).toBeSuccessfulCommand();
    expect(game.getLore("player_two") - beforeQuest).toBe(3);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
  });
  it("keeps her printed lore with no locations in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: rayaDeterminedExplorer, isDrying: false }],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCardLore(rayaDeterminedExplorer)).toBe(1);
    expect(testEngine.asPlayerOne().quest(rayaDeterminedExplorer)).toBeSuccessfulCommand();
    expect(testEngine.getLore("player_one")).toBe(1);
  });

  it("gets +1 {L} for each location you have in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: rayaDeterminedExplorer, isDrying: false }, firstLocation, secondLocation],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCardLore(rayaDeterminedExplorer)).toBe(3);
    expect(testEngine.asPlayerOne().quest(rayaDeterminedExplorer)).toBeSuccessfulCommand();
    expect(testEngine.getLore("player_one")).toBe(3);
  });

  it("does not count opposing locations", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: rayaDeterminedExplorer, isDrying: false }, firstLocation],
        deck: 1,
      },
      {
        play: [secondLocation],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().getCardLore(rayaDeterminedExplorer)).toBe(2);
    expect(testEngine.asPlayerOne().quest(rayaDeterminedExplorer)).toBeSuccessfulCommand();
    expect(testEngine.getLore("player_one")).toBe(2);
  });

  it("updates immediately when a friendly location is played and ignores locations outside play", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: rayaDeterminedExplorer, isDrying: false }],
      hand: [firstLocation],
      discard: [secondLocation],
      inkwell: 2,
      deck: [],
    });
    expect(game.asPlayerOne().getCardLore(rayaDeterminedExplorer)).toBe(1);
    expect(game.asPlayerOne().playCard(firstLocation)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(rayaDeterminedExplorer)).toBe(2);
    expect(game.asPlayerOne().quest(rayaDeterminedExplorer)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(2);
  });

  it("counts duplicate location copies without requiring Raya to be at a location", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: rayaDeterminedExplorer, isDrying: false }, firstLocation, firstLocation],
      deck: [],
    });
    expect(game.asPlayerOne().getCardLore(rayaDeterminedExplorer)).toBe(3);
    expect(game.asPlayerOne().quest(rayaDeterminedExplorer)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(3);
    expect(game.asPlayerOne().isExerted(rayaDeterminedExplorer)).toBe(true);
  });
});
