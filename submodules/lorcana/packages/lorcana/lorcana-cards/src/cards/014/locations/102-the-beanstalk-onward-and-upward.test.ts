// CR 2.2.0: 4.7.1–4.7.4, 6.4.1, 8.6.1.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { theBeanstalkOnwardAndUpward } from "./102-the-beanstalk-onward-and-upward";

const climber = createMockCharacter({
  id: "beanstalk-climber",
  name: "Beanstalk Climber",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const groundCharacter = createMockCharacter({
  id: "beanstalk-ground-character",
  name: "Beanstalk Ground Character",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const otherLocation = createMockLocation({
  id: "beanstalk-other-location",
  name: "Beanstalk Other Location",
  cost: 1,
  moveCost: 1,
  lore: 0,
});

describe("The Beanstalk - Onward and Upward", () => {
  it("player two pays only their drop pool and gains bonuses only at their own location", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [theBeanstalkOnwardAndUpward, climber], inkDrops: 4, deck: 6 },
      { play: [theBeanstalkOnwardAndUpward, climber], inkDrops: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const ownLocation = game.findCardInstanceId(theBeanstalkOnwardAndUpward, "play", PLAYER_TWO);
    const enemyLocation = game.findCardInstanceId(theBeanstalkOnwardAndUpward, "play", PLAYER_ONE);
    const ownClimber = game.findCardInstanceId(climber, "play", PLAYER_TWO);
    const enemyClimber = game.findCardInstanceId(climber, "play", PLAYER_ONE);
    expect(
      game.asPlayerTwo().moveCharacterToLocation(ownClimber, enemyLocation, { inkDrops: 1 }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().moveCharacterToLocation(enemyClimber, ownLocation, { inkDrops: 1 }),
    ).not.toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(
      game.asPlayerTwo().moveCharacterToLocation(ownClimber, ownLocation, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo()).toBeAtLocation({ card: ownClimber, location: ownLocation });
    expect(game.asPlayerTwo().getCard(ownClimber)?.strength).toBe(4);
    expect(game.asPlayerTwo()).toHaveKeyword({ card: ownClimber, keyword: "Evasive" });
    expect(game.asPlayerOne().getCard(enemyClimber)?.strength).toBe(3);
    expect(game.asPlayerOne()).not.toHaveKeyword({ card: enemyClimber, keyword: "Evasive" });
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerTwo().isExerted(ownClimber)).toBe(false);
  });
  it("The Distant Reaches - characters here get +1 {S} and gain Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        theBeanstalkOnwardAndUpward,
        { card: climber, atLocation: theBeanstalkOnwardAndUpward },
        groundCharacter,
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(climber)?.strength).toBe(climber.strength + 1);
    expect(testEngine.asPlayerOne().getCard(groundCharacter)?.strength).toBe(
      groundCharacter.strength,
    );
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: climber,
      keyword: "Evasive",
    });
    expect(testEngine.asPlayerOne()).not.toHaveKeyword({
      card: groundCharacter,
      keyword: "Evasive",
    });
  });

  it("The Distant Reaches - benefits end when the character moves away", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        theBeanstalkOnwardAndUpward,
        otherLocation,
        { card: climber, atLocation: theBeanstalkOnwardAndUpward },
      ],
      inkwell: otherLocation.moveCost,
      deck: 1,
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: climber,
      keyword: "Evasive",
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(climber, otherLocation),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(climber)?.strength).toBe(climber.strength);
    expect(testEngine.asPlayerOne()).not.toHaveKeyword({
      card: climber,
      keyword: "Evasive",
    });
  });
});

it("moving onto the location costs one ink and immediately grants both effects without exerting", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [theBeanstalkOnwardAndUpward, climber, groundCharacter],
    inkwell: 1,
    deck: 6,
  });
  expect(
    game.asPlayerOne().moveCharacterToLocation(climber, theBeanstalkOnwardAndUpward),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toBeAtLocation({
    card: climber,
    location: theBeanstalkOnwardAndUpward,
  });
  expect(game.asPlayerOne().getCard(climber)?.strength).toBe(4);
  expect(game.asPlayerOne()).toHaveKeyword({ card: climber, keyword: "Evasive" });
  expect(game.asPlayerOne().getCard(groundCharacter)?.strength).toBe(3);
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: groundCharacter, keyword: "Evasive" });
  expect(game.asPlayerOne().isExerted(climber)).toBe(false);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});

it("protects an exerted climber from a non-Evasive challenge and applies its increased retaliation", () => {
  const evasive = createMockCharacter({
    id: "beanstalk-evasive-attacker",
    name: "Evasive attacker",
    cost: 3,
    strength: 2,
    willpower: 6,
    abilities: [{ type: "keyword", keyword: "Evasive" }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        theBeanstalkOnwardAndUpward,
        { card: climber, exerted: true, atLocation: theBeanstalkOnwardAndUpward },
      ],
      deck: 6,
    },
    { play: [groundCharacter, evasive], deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(groundCharacter, climber)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(groundCharacter)).toBe(false);
  expect(game.asPlayerTwo().challenge(evasive, climber)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveDamage({ card: evasive, value: 4 });
  expect(game.asPlayerOne()).toHaveDamage({ card: climber, value: 2 });
});

it("the granted Evasive permits attacking an Evasive defender for the increased damage", () => {
  const defender = createMockCharacter({
    id: "beanstalk-evasive-defender",
    name: "Evasive defender",
    cost: 3,
    strength: 1,
    willpower: 6,
    abilities: [{ type: "keyword", keyword: "Evasive" }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [theBeanstalkOnwardAndUpward, climber], inkwell: 1, deck: 6 },
    { play: [{ card: defender, exerted: true }], deck: 6 },
  );
  expect(game.asPlayerOne().challenge(climber, defender)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().moveCharacterToLocation(climber, theBeanstalkOnwardAndUpward),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(climber, defender)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveDamage({ card: defender, value: 4 });
  expect(game.asPlayerOne()).toHaveDamage({ card: climber, value: 1 });
});

it("destroying the location removes both bonuses and clears location without banishing its character", () => {
  const demolisher = createMockCharacter({
    id: "beanstalk-demolisher",
    name: "Demolisher",
    cost: 6,
    strength: 6,
    willpower: 6,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        theBeanstalkOnwardAndUpward,
        { card: climber, atLocation: theBeanstalkOnwardAndUpward },
      ],
      deck: 6,
    },
    { play: [demolisher], deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().challenge(demolisher, theBeanstalkOnwardAndUpward),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(theBeanstalkOnwardAndUpward)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(climber)).toBe("play");
  expect(game.asPlayerOne()).not.toBeAtLocation({
    card: climber,
    location: theBeanstalkOnwardAndUpward,
  });
  expect(game.asPlayerOne().getCard(climber)?.strength).toBe(3);
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: climber, keyword: "Evasive" });
  expect(game.asPlayerTwo()).toHaveDamage({ card: demolisher, value: 0 });
});

it("two independent copies apply one bonus at the character's actual location", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [theBeanstalkOnwardAndUpward, theBeanstalkOnwardAndUpward, climber],
    inkwell: 2,
    deck: 6,
  });
  const locations = game.getCardInstanceIdsInZone("play", PLAYER_ONE).slice(0, 2);
  expect(
    game.asPlayerOne().moveCharacterToLocation(climber, locations[0]!),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(climber)?.strength).toBe(4);
  expect(
    game.asPlayerOne().moveCharacterToLocation(climber, locations[1]!),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toBeAtLocation({ card: climber, location: locations[1]! });
  expect(game.asPlayerOne().getCard(climber)?.strength).toBe(4);
  expect(game.asPlayerOne()).toHaveKeyword({ card: climber, keyword: "Evasive" });
});

it("moving away removes only this location's bonus and keeps native Evasive", () => {
  const native = createMockCharacter({
    id: "beanstalk-native-evasive",
    name: "Native Evasive",
    cost: 2,
    strength: 2,
    abilities: [{ type: "keyword", keyword: "Evasive" }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [
      theBeanstalkOnwardAndUpward,
      otherLocation,
      { card: native, atLocation: theBeanstalkOnwardAndUpward },
    ],
    inkwell: 1,
    deck: 6,
  });
  expect(game.asPlayerOne().getCard(native)?.strength).toBe(3);
  expect(game.asPlayerOne().moveCharacterToLocation(native, otherLocation)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(native)?.strength).toBe(2);
  expect(game.asPlayerOne()).toHaveKeyword({ card: native, keyword: "Evasive" });
});

it("rejects insufficient, opposing-location and opposing-character moves without granting effects", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [theBeanstalkOnwardAndUpward, climber], deck: 6 },
    { play: [theBeanstalkOnwardAndUpward, groundCharacter], deck: 6 },
  );
  const ownLocation = game.findCardInstanceId(theBeanstalkOnwardAndUpward, "play", PLAYER_ONE);
  const enemyLocation = game.findCardInstanceId(theBeanstalkOnwardAndUpward, "play", PLAYER_TWO);
  expect(
    game.asPlayerOne().moveCharacterToLocation(climber, ownLocation),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().moveCharacterToLocation(climber, enemyLocation),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().moveCharacterToLocation(groundCharacter, ownLocation),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(climber)?.strength).toBe(3);
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: climber, keyword: "Evasive" });
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});

it("a drying exerted character can move using one saved drop and keeps its state", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [theBeanstalkOnwardAndUpward, { card: climber, isDrying: true, exerted: true }],
    inkDrops: 2,
    deck: 6,
  });
  expect(
    game
      .asPlayerOne()
      .moveCharacterToLocation(climber, theBeanstalkOnwardAndUpward, { inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCard(climber)?.strength).toBe(4);
  expect(game.asPlayerOne()).toHaveKeyword({ card: climber, keyword: "Evasive" });
  expect(game.asPlayerOne().isExerted(climber)).toBe(true);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().quest(climber)).not.toBeSuccessfulCommand();
});

it("plays for one ink, has no passive lore, and can be inked", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [theBeanstalkOnwardAndUpward], inkwell: 1, deck: 6 },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(theBeanstalkOnwardAndUpward)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  const ink = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [theBeanstalkOnwardAndUpward],
    deck: 6,
  });
  expect(ink.asPlayerOne().ink(theBeanstalkOnwardAndUpward)).toBeSuccessfulCommand();
  expect(ink.asPlayerOne().getCardZone(theBeanstalkOnwardAndUpward)).toBe("inkwell");
});

it("Player Two keeps two location copies independent, retains native Evasive and retries legal offense", () => {
  const native = createMockCharacter({
    id: "beanstalk-p2-native",
    name: "Native",
    cost: 2,
    strength: 2,
    willpower: 6,
    abilities: [{ type: "keyword", keyword: "Evasive" }],
  });
  const defender = createMockCharacter({
    id: "beanstalk-p2-defender",
    name: "Defender",
    cost: 2,
    strength: 1,
    willpower: 6,
    lore: 1,
    abilities: [{ type: "keyword", keyword: "Evasive" }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [theBeanstalkOnwardAndUpward, { card: defender, exerted: true }, groundCharacter],
      inkDrops: 7,
      deck: 8,
    },
    {
      play: [
        theBeanstalkOnwardAndUpward,
        theBeanstalkOnwardAndUpward,
        otherLocation,
        climber,
        native,
      ],
      inkDrops: 10,
      deck: 8,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const p2 = game.asPlayerTwo();
  const locations = game
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .filter((id) => p2.getCardDefinitionByInstanceId(id).id === theBeanstalkOnwardAndUpward.id);
  const first = locations[0]!;
  const second = locations[1]!;
  const ownClimber = game.findCardInstanceId(climber, "play", PLAYER_TWO)!;
  const ownNative = game.findCardInstanceId(native, "play", PLAYER_TWO)!;
  const elsewhere = game.findCardInstanceId(otherLocation, "play", PLAYER_TWO)!;
  const enemyLocation = game.findCardInstanceId(theBeanstalkOnwardAndUpward, "play", PLAYER_ONE)!;
  const enemy = game.findCardInstanceId(groundCharacter, "play", PLAYER_ONE)!;
  const target = game.findCardInstanceId(defender, "play", PLAYER_ONE)!;
  for (const [character, destination] of [
    [ownClimber, enemyLocation],
    [enemy, first],
  ] as const) {
    expect(
      p2.moveCharacterToLocation(character, destination, { inkDrops: 1 }),
    ).not.toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(10);
    expect(p2.getCardStrength(ownClimber)).toBe(3);
    expect(p2).not.toHaveKeyword({ card: ownClimber, keyword: "Evasive" });
  }
  expect(p2.challenge(ownClimber, target)).not.toBeSuccessfulCommand();
  expect(p2.isExerted(ownClimber)).toBe(false);
  for (const destination of [first, second]) {
    expect(
      p2.moveCharacterToLocation(ownClimber, destination, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(p2).toBeAtLocation({ card: ownClimber, location: destination });
    expect(p2.getCardStrength(ownClimber)).toBe(4);
    expect(p2).toHaveKeyword({ card: ownClimber, keyword: "Evasive" });
  }
  for (const [destination, strength] of [
    [first, 3],
    [elsewhere, 2],
    [second, 3],
  ] as const) {
    expect(
      p2.moveCharacterToLocation(ownNative, destination, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(p2.getCardStrength(ownNative)).toBe(strength);
    expect(p2).toHaveKeyword({ card: ownNative, keyword: "Evasive" });
  }
  expect(p2.challenge(ownClimber, target)).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: target, value: 4 });
  expect(p2).toHaveDamage({ card: ownClimber, value: 1 });
  expect(
    p2.moveCharacterToLocation(ownClimber, elsewhere, { inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(p2.getCardStrength(ownClimber)).toBe(3);
  expect(p2).not.toHaveKeyword({ card: ownClimber, keyword: "Evasive" });
  expect(p2.isExerted(ownClimber)).toBe(true);
  expect(p2).toHaveDamage({ card: ownClimber, value: 1 });
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(7);
  expect(p2.passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(target)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(0);
  expect(p2.challenge(ownClimber, target)).not.toBeSuccessfulCommand();
  expect(p2.isExerted(ownClimber)).toBe(false);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  expect(p2.moveCharacterToLocation(ownClimber, second, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(p2.challenge(ownClimber, target)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(target)).toBe("discard");
  expect(p2).toHaveDamage({ card: ownClimber, value: 2 });
  expect(p2.getCardStrength(ownClimber)).toBe(4);
  expect(p2.getCardStrength(ownNative)).toBe(3);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(7);
  expect(p2.getAvailableInk(PLAYER_TWO)).toBe(0);
});
