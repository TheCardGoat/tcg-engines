// CR 1.2.3, 6.1.11 and 6.7: do as much as possible, exact played-card reference, ordered effects.
// Rules grounding: People Gonna Come Here plays a location from your hand or
// discard for free; when a character sang this song, you may move the singer
// to that location for free.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { peopleGonnaComeHere } from "./200-people-gonna-come-here";

const singer = createMockCharacter({
  id: "people-gonna-singer",
  name: "Big Singer",
  cost: 9,
  strength: 3,
  willpower: 6,
});

const locationInHand = createMockLocation({
  id: "people-gonna-location-hand",
  name: "Hand Location",
  cost: 5,
  moveCost: 2,
  willpower: 6,
  lore: 1,
});

const locationInDiscard = createMockLocation({
  id: "people-gonna-location-discard",
  name: "Discard Location",
  cost: 4,
  moveCost: 2,
  willpower: 6,
  lore: 1,
});

describe("People Gonna Come Here", () => {
  it("does not move to an older location when no location can be played", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peopleGonnaComeHere],
      play: [{ card: singer, isDrying: false }, locationInDiscard],
      inkwell: 0,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(player.singSong(peopleGonnaComeHere, singer)).toBeSuccessfulCommand();
    expect(player.getPendingEffects()).toHaveLength(0);
    expect(player).not.toBeAtLocation({ card: singer, location: locationInDiscard });
    expect(player.getCardZone(peopleGonnaComeHere)).toBe("discard");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getPendingEffects()).toHaveLength(0);
  });

  it("moves only Player Two's singer and spends no ink for either effect", () => {
    const bystander = createMockCharacter({
      id: "people-gonna-bystander",
      name: "Bystander",
      cost: 9,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [bystander],
        inkwell: 3,
        deck: [locationInHand],
      },
      {
        hand: [peopleGonnaComeHere, locationInDiscard],
        play: [{ card: singer, isDrying: false }],
        inkwell: 2,
        deck: [locationInHand],
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const player = engine.asPlayerTwo();
    expect(player.singSong(peopleGonnaComeHere, singer)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(peopleGonnaComeHere, {
        targets: [locationInDiscard],
      }),
    ).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(player).toBeAtLocation({ card: singer, location: locationInDiscard });
    expect(engine.asPlayerOne()).not.toBeAtLocation({
      card: bystander,
      location: locationInDiscard,
    });
    expect(player.getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(engine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(player.getCardZone(peopleGonnaComeHere)).toBe("discard");
    expect(player.getPendingEffects()).toHaveLength(0);
  });

  it("rejects playing a character in place of a location without consuming the choice", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peopleGonnaComeHere, singer, locationInHand],
      inkwell: 7,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(peopleGonnaComeHere)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(peopleGonnaComeHere, {
        targets: [singer],
      }),
    ).not.toBeSuccessfulCommand();
    expect(player.getCardZone(singer)).toBe("hand");
    expect(
      player.resolvePendingByCard(peopleGonnaComeHere, {
        targets: [locationInHand],
      }),
    ).toBeSuccessfulCommand();
    expect(player.getCardZone(locationInHand)).toBe("play");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getPendingEffects()).toHaveLength(0);
  });

  it("plays a location from your hand for free when sung and moves the singer to it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peopleGonnaComeHere, locationInHand],
      play: [{ card: singer, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().singSong(peopleGonnaComeHere, singer)).toBeSuccessfulCommand();

    // The play-card step suspends: choose the location to play for free.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: true,
        targets: [locationInHand],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(locationInHand)).toBe("play");

    // Both the singer and the newly played location are implied.
    // The player chooses only whether to move.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: singer,
      location: locationInHand,
    });
  });

  it("plays a location from your discard for free when sung", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peopleGonnaComeHere],
      discard: [locationInDiscard],
      play: [{ card: singer, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().singSong(peopleGonnaComeHere, singer)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: true,
        targets: [locationInDiscard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(locationInDiscard)).toBe("play");
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: singer,
      location: locationInDiscard,
    });
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("does not offer the move when played from hand without a singer", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peopleGonnaComeHere, locationInHand],
      inkwell: peopleGonnaComeHere.cost,
    });

    expect(testEngine.asPlayerOne().playCard(peopleGonnaComeHere)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: true,
        targets: [locationInHand],
      }),
    ).toBeSuccessfulCommand();

    // The location was played, but with no singer there is no move step.
    expect(testEngine.asPlayerOne().getCardZone(locationInHand)).toBe("play");
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("lets the singer stay put when the optional move is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peopleGonnaComeHere, locationInHand],
      play: [{ card: singer, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().singSong(peopleGonnaComeHere, singer)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: true,
        targets: [locationInHand],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(locationInHand)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(singer)).toBe("play");
    expect(testEngine.asPlayerOne()).not.toBeAtLocation({
      card: singer,
      location: locationInHand,
    });
  });

  it("does not move the singer to an older location instead of the location just played", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peopleGonnaComeHere, locationInHand],
      play: [{ card: singer, isDrying: false }, locationInDiscard],
      inkwell: 0,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(player.singSong(peopleGonnaComeHere, singer)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(peopleGonnaComeHere, {
        targets: [locationInHand],
      }),
    ).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: true,
        targets: [locationInDiscard],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(peopleGonnaComeHere, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(player).toBeAtLocation({ card: singer, location: locationInHand });
  });
});

it("rejects an opposing discarded location and preserves the owner's free-play choice", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [peopleGonnaComeHere, locationInHand],
      play: [{ card: singer, isDrying: false }],
      deck: 6,
    },
    { discard: [locationInDiscard], deck: 6 },
  );
  const owner = g.asPlayerOne();
  expect(owner.singSong(peopleGonnaComeHere, singer)).toBeSuccessfulCommand();
  expect(
    owner.resolvePendingByCard(peopleGonnaComeHere, { targets: [locationInDiscard] }),
  ).not.toBeSuccessfulCommand();
  expect(g.asServer().getCardZone(locationInDiscard)).toBe("discard");
  expect(owner.getCardZone(locationInHand)).toBe("hand");
  expect(
    g.asPlayerTwo().resolvePendingByCard(peopleGonnaComeHere, { targets: [locationInHand] }),
  ).not.toBeSuccessfulCommand();
  expect(
    owner.resolvePendingByCard(peopleGonnaComeHere, { targets: [locationInHand] }),
  ).toBeSuccessfulCommand();
  expect(
    owner.resolvePendingByCard(peopleGonnaComeHere, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(owner).toBeAtLocation({ card: singer, location: locationInHand });
  expect(owner.getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(owner.getPendingEffects()).toHaveLength(0);
});

it("Player Two plays one exact discarded copy and moves only the selected singer to it", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { discard: [locationInDiscard], play: [locationInHand], deck: 3 },
    {
      hand: [peopleGonnaComeHere],
      discard: [locationInDiscard, locationInDiscard],
      play: [singer, singer, locationInDiscard],
      deck: 3,
    },
  );
  const opposingLocation = g.getCardInstanceIdsInZone("discard", PLAYER_ONE)[0]!;
  const locations = g.getCardInstanceIdsInZone("discard", PLAYER_TWO);
  const singers = g
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .filter((id) => g.getCardDefinitionId(id) === singer.id);
  const oldLocation = g
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .find((id) => g.getCardDefinitionId(id) === locationInDiscard.id)!;
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const p = g.asPlayerTwo();
  expect(p.singSong(peopleGonnaComeHere, singers[1]!)).toBeSuccessfulCommand();
  expect(p.resolvePendingByCard(peopleGonnaComeHere, { targets: [] })).not.toBeSuccessfulCommand();
  expect(
    p.resolvePendingByCard(peopleGonnaComeHere, { targets: locations }),
  ).not.toBeSuccessfulCommand();
  expect(p.getCardZone(locations[0]!)).toBe("discard");
  expect(p.getCardZone(locations[1]!)).toBe("discard");
  expect(
    p.resolvePendingByCard(peopleGonnaComeHere, { targets: [locations[1]!] }),
  ).toBeSuccessfulCommand();
  expect(p.getCardZone(locations[0]!)).toBe("discard");
  expect(p.getCardZone(locations[1]!)).toBe("play");
  expect(
    p.resolvePendingByCard(peopleGonnaComeHere, { resolveOptional: true, targets: [oldLocation] }),
  ).not.toBeSuccessfulCommand();
  expect(
    p.resolvePendingByCard(peopleGonnaComeHere, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(p).toBeAtLocation({ card: singers[1]!, location: locations[1]! });
  expect(p).not.toBeAtLocation({ card: singers[0]!, location: locations[1]! });
  expect(p).not.toBeAtLocation({ card: singers[1]!, location: oldLocation });
  expect(p.getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(g.asPlayerOne().getCardZone(opposingLocation)).toBe("discard");
  expect(p.getPendingEffects()).toHaveLength(0);
});
