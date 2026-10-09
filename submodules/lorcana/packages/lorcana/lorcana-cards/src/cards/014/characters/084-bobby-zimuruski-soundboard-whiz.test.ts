// Rules grounding: Hyperia City ink-drop mechanic — each ink drop may be
// removed to pay 1 {I} of any color; drops persist between turns.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
  createMockCharacter,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { befuddle } from "../../001/actions/062-befuddle";
import { distract } from "../../003/actions/159-distract";
import { leaningTowerOfCheesea } from "../items/101-leaning-tower-of-cheese-a";
import { bobbyZimuruskiSoundboardWhiz } from "./084-bobby-zimuruski-soundboard-whiz";

const cheeseTower = createMockItem({
  id: "bobby-test-cheese-tower",
  name: "Leaning Tower of Cheese-a",
  cost: 1,
});

const otherItem = createMockItem({
  id: "bobby-test-other-item",
  name: "Unrelated Gadget",
  cost: 1,
});

describe("Bobby Zimuruski - Soundboard Whiz", () => {
  it("has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [bobbyZimuruskiSoundboardWhiz],
      deck: 6,
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: bobbyZimuruskiSoundboardWhiz,
      keyword: "Ward",
    });
  });

  it("Scrumptious! lets your Leaning Tower of Cheese-a get 1 ink drop for {E} and 1 {I}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [bobbyZimuruskiSoundboardWhiz, cheeseTower],
      inkwell: 2,
      deck: 6,
    });

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);

    expect(
      testEngine.asPlayerOne().activateAbility(cheeseTower, { ability: "Scrumptious!" }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().isExerted(cheeseTower)).toBe(true);
  });

  it("Scrumptious! does not grant the ability to items with other names", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [bobbyZimuruskiSoundboardWhiz, otherItem],
      inkwell: 2,
      deck: 6,
    });

    const result = testEngine.asPlayerOne().activateAbility(otherItem, { ability: "Scrumptious!" });

    expect(result).not.toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().isExerted(otherItem)).toBe(false);
  });
});

it("requires one ink and a ready item; failed costs preserve ink and drops", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [bobbyZimuruskiSoundboardWhiz, cheeseTower], inkwell: 1, deck: 6 },
    { deck: 6 },
  );
  const player = game.asPlayerOne();
  expect(player.activateAbility(cheeseTower, { ability: "Scrumptious!" })).toBeSuccessfulCommand();
  expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(
    player.activateAbility(cheeseTower, { ability: "Scrumptious!", inkDrops: 1 }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(player.isExerted(cheeseTower)).toBe(true);
});
it("cannot activate a ready item with no ink before getting its reward", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [bobbyZimuruskiSoundboardWhiz, cheeseTower],
    deck: 6,
  });
  expect(
    game.asPlayerOne().activateAbility(cheeseTower, { ability: "Scrumptious!" }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(cheeseTower)).toBe(false);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});
it("lets real Cheese-a items spend an old drop for one new drop and preserves it across turns", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [bobbyZimuruskiSoundboardWhiz, leaningTowerOfCheesea], inkDrops: 2, deck: 6 },
    { deck: 6 },
  );
  expect(
    game
      .asPlayerOne()
      .activateAbility(leaningTowerOfCheesea, { ability: "Scrumptious!", inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerOne().isExerted(leaningTowerOfCheesea)).toBe(true);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().isExerted(leaningTowerOfCheesea)).toBe(false);
});
it("grants only your items, excluding opposing copies and same-name characters", () => {
  const imposter = createMockCharacter({
    id: "bobby-imposter",
    name: "Leaning Tower of Cheese-a",
    cost: 1,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [bobbyZimuruskiSoundboardWhiz, imposter], inkwell: 2, deck: 6 },
    { play: [cheeseTower], inkwell: 2, deck: 6 },
  );
  expect(
    game.asPlayerOne().activateAbility(imposter, { ability: "Scrumptious!" }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().activateAbility(cheeseTower, { ability: "Scrumptious!" }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
});
it("multiple Bobby copies grant choices but still yield only one drop per paid activation", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [bobbyZimuruskiSoundboardWhiz, bobbyZimuruskiSoundboardWhiz, cheeseTower, cheeseTower],
    inkwell: 2,
    deck: 6,
  });
  const items = game.getCardInstanceIdsInZone("play", PLAYER_ONE).slice(2);
  for (const [index, item] of items.entries()) {
    expect(
      game.asPlayerOne().activateAbility(item, { ability: "Scrumptious!" }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(index + 1);
    expect(game.asPlayerOne().isExerted(item)).toBe(true);
  }
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});
it("removes the granted ability when Bobby leaves play", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [bobbyZimuruskiSoundboardWhiz, cheeseTower],
    hand: [befuddle],
    inkwell: 3,
    deck: 6,
  });
  expect(
    game.asPlayerOne().playCard(befuddle, { targets: [bobbyZimuruskiSoundboardWhiz] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(bobbyZimuruskiSoundboardWhiz)).toBe("hand");
  expect(
    game.asPlayerOne().activateAbility(cheeseTower, { ability: "Scrumptious!" }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(cheeseTower)).toBe(false);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});
it("Ward rejects opponent choices but allows own effects", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [bobbyZimuruskiSoundboardWhiz], hand: [distract], inkwell: 2, deck: 6 },
    { hand: [distract], inkwell: 2, deck: 6 },
  );
  expect(
    game.asPlayerOne().playCard(distract, { targets: [bobbyZimuruskiSoundboardWhiz] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().playCard(distract, { targets: [bobbyZimuruskiSoundboardWhiz] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().getCardZone(distract)).toBe("hand");
});
it("playing Bobby immediately grants the ability to an existing item while he is drying", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [bobbyZimuruskiSoundboardWhiz],
    play: [leaningTowerOfCheesea],
    inkwell: 3,
    deck: 6,
  });
  const player = game.asPlayerOne();
  expect(
    player.activateAbility(leaningTowerOfCheesea, { ability: "Scrumptious!" }),
  ).not.toBeSuccessfulCommand();
  expect(player.playCard(bobbyZimuruskiSoundboardWhiz)).toBeSuccessfulCommand();
  expect(player.quest(bobbyZimuruskiSoundboardWhiz)).not.toBeSuccessfulCommand();
  expect(
    player.activateAbility(leaningTowerOfCheesea, { ability: "Scrumptious!" }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
});

it("player two can spend an old drop on their granted real item without affecting the opponent pool", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [leaningTowerOfCheesea], inkDrops: 4, deck: 6 },
    { play: [bobbyZimuruskiSoundboardWhiz, leaningTowerOfCheesea], inkDrops: 2, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const own = game.findCardInstanceId(leaningTowerOfCheesea, "play", PLAYER_TWO)!;
  const opposing = game.findCardInstanceId(leaningTowerOfCheesea, "play", PLAYER_ONE)!;
  expect(
    game.asPlayerTwo().activateAbility(opposing, { ability: "Scrumptious!", inkDrops: 1 }),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().activateAbility(own, { ability: "Scrumptious!", inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().isExerted(own)).toBe(true);
  expect(game.asPlayerOne().isExerted(opposing)).toBe(false);
  expect(
    game.asPlayerTwo().activateAbility(own, { ability: "Scrumptious!", inkDrops: 1 }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
});

it("retains the grant after one Bobby leaves and removes it after the last, with affordable costs", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [
      bobbyZimuruskiSoundboardWhiz,
      bobbyZimuruskiSoundboardWhiz,
      leaningTowerOfCheesea,
      leaningTowerOfCheesea,
      leaningTowerOfCheesea,
    ],
    hand: [befuddle, befuddle],
    inkwell: 5,
    deck: 6,
  });
  const [firstSource, lastSource, firstItem, secondItem, lastItem] = game.getCardInstanceIdsInZone(
    "play",
    PLAYER_ONE,
  );
  const [firstReturn, secondReturn] = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  expect(
    game.asPlayerOne().activateAbility(firstItem!, { ability: "Scrumptious!" }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(
    game.asPlayerOne().playCard(firstReturn!, { targets: [firstSource!] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(firstSource!)).toBe("hand");
  expect(
    game.asPlayerOne().activateAbility(secondItem!, { ability: "Scrumptious!" }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(
    game.asPlayerOne().playCard(secondReturn!, { targets: [lastSource!] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(lastSource!)).toBe("hand");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
  for (const inkDrops of [0, 1])
    expect(
      game.asPlayerOne().activateAbility(lastItem!, { ability: "Scrumptious!", inkDrops }),
    ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(lastItem!)).toBe(false);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
});
