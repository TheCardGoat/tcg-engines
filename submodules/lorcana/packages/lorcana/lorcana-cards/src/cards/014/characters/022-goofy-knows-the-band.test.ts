import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { miguelRiveraStreetMusician } from "./021-miguel-rivera-street-musician";
import { singer } from "../../../helpers/abilities/singer";
import { goofyKnowsTheBand } from "./022-goofy-knows-the-band";

const otherSinger = createMockCharacter({
  id: "goofy-ktb-other-singer",
  name: "Other Singer",
  cost: 2,
  abilities: [singer(2)],
});

const nonSinger = createMockCharacter({
  id: "goofy-ktb-non-singer",
  name: "Non Singer",
  cost: 2,
});

const drawnCard = createMockCharacter({
  id: "goofy-ktb-drawn",
  name: "Drawn Card",
  cost: 1,
});

describe("Goofy - Knows the Band", () => {
  it("draws a card when played with a character with Singer in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goofyKnowsTheBand],
      inkwell: goofyKnowsTheBand.cost,
      play: [otherSinger],
      deck: [drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });

  it("does not draw a card without a character with Singer in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goofyKnowsTheBand],
      inkwell: goofyKnowsTheBand.cost,
      play: [nonSinger],
      deck: [drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
  });
  it("does not draw for an opponent's Singer", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goofyKnowsTheBand],
        inkwell: goofyKnowsTheBand.cost,
        deck: [drawnCard],
      },
      { play: [otherSinger], deck: 3 },
    );
    expect(engine.asPlayerOne().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
  });

  it.each(["hand", "discard", "deck"] as const)(
    "does not count a Singer in %s",
    (zone: "hand" | "discard" | "deck") => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: zone === "hand" ? [goofyKnowsTheBand, otherSinger] : [goofyKnowsTheBand],
          discard: zone === "discard" ? [otherSinger] : [],
          deck: zone === "deck" ? [otherSinger, drawnCard] : [drawnCard],
          inkwell: 4,
        },
        { deck: 6 },
      );
      expect(game.asPlayerOne().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
      expect(game.asPlayerOne().getCardZone(otherSinger)).toBe(zone);
      expect(game.asPlayerOne().getZonesCardCount().hand).toBe(zone === "hand" ? 1 : 0);
      expect(game.asPlayerOne().getBagCount()).toBe(0);
      expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    },
  );

  it("draws only one card when multiple friendly Singers are in play", () => {
    const secondSinger = createMockCharacter({
      id: "goofy-second-singer",
      name: "Second Singer",
      cost: 2,
      abilities: [singer(3)],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goofyKnowsTheBand],
      inkwell: goofyKnowsTheBand.cost,
      play: [otherSinger, secondSinger],
      deck: [nonSinger, drawnCard],
    });
    expect(engine.asPlayerOne().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(engine.asPlayerOne().getCardZone(nonSinger)).toBe("deck");
  });

  it("counts Singer gained from a continuous ability", () => {
    const song = createMockSong({
      id: "goofy-discard-song",
      name: "Discard Song",
      cost: 1,
      text: "A song.",
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goofyKnowsTheBand],
      inkwell: goofyKnowsTheBand.cost,
      play: [miguelRiveraStreetMusician],
      discard: [song],
      deck: [drawnCard],
    });
    expect(engine.asPlayerOne().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });
  it.each(["exerted", "drying"])("counts a friendly Singer who is %s", (status: string) => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goofyKnowsTheBand],
      inkwell: 4,
      play: [{ card: otherSinger, exerted: status === "exerted", isDrying: status === "drying" }],
      deck: [drawnCard],
    });
    expect(game.asPlayerOne().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("Player Two draws exactly one card after their normal turn draw", () => {
    const normalDraw = { ...drawnCard, id: "goofy-normal-draw" };
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      {
        hand: [goofyKnowsTheBand],
        play: [otherSinger],
        inkwell: 4,
        deck: [nonSinger, drawnCard, normalDraw],
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(normalDraw)).toBe("hand");
    expect(game.asPlayerTwo().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(drawnCard)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(nonSinger)).toBe("deck");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerTwo().hasGameEnded()).toBe(false);
  });

  it("draws nothing with an empty deck and loses at turn end", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [goofyKnowsTheBand], play: [otherSinger], inkwell: 4, deck: [] },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().hasGameEnded()).toBe(false);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
  });

  it("does not draw with Miguel when his conditional Singer is inactive", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goofyKnowsTheBand],
      play: [miguelRiveraStreetMusician],
      inkwell: 4,
      deck: [drawnCard],
    });
    expect(game.asPlayerOne().playCard(goofyKnowsTheBand)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });
});
