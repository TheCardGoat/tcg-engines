// Rules grounding: Hyperia City ink-drop mechanic — each ink drop may be
// removed to pay 1 {I} of any color; drops persist between turns.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { befuddle } from "../../001/actions/062-befuddle";
import { baymaxLabAssistant } from "./085-baymax-lab-assistant";

const itemA = createMockItem({
  id: "baymax-lab-item-a",
  name: "Lab Beaker",
  cost: 1,
});

const itemB = createMockItem({
  id: "baymax-lab-item-b",
  name: "Lab Goggles",
  cost: 1,
});

describe("Baymax - Lab Assistant", () => {
  it("RESUPPLY gets 2 ink drops when you have 2 or more items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [baymaxLabAssistant],
      play: [itemA, itemB],
      inkwell: baymaxLabAssistant.cost,
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(baymaxLabAssistant)).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(2);
  });

  it("RESUPPLY does nothing with fewer than 2 items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [baymaxLabAssistant],
      play: [itemA],
      inkwell: baymaxLabAssistant.cost,
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(baymaxLabAssistant)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});

for (const count of [0, 3]) {
  it(`gets ${count >= 2 ? 2 : 0} drops with ${count} own items`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [baymaxLabAssistant],
      play: Array.from({ length: count }, () => itemA),
      inkwell: 4,
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(baymaxLabAssistant)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(count >= 2 ? 2 : 0);
  });
}
it("counts only own items in play, excluding the opponent and other zones", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [baymaxLabAssistant, itemB], play: [itemA], discard: [itemB], inkwell: 4, deck: 6 },
    { play: [itemA, itemB], inkDrops: 3, deck: 6 },
  );
  expect(game.asPlayerOne().playCard(baymaxLabAssistant)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
});
it("two identical items qualify and each Baymax copy adds exactly two to the existing pool", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [baymaxLabAssistant, baymaxLabAssistant],
      play: [itemA, itemA],
      inkwell: 8,
      inkDrops: 3,
      deck: 6,
    },
    { inkDrops: 4, deck: 6 },
  );
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  for (const [index, copy] of copies.entries()) {
    expect(game.asPlayerOne().playCard(copy)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(5 + 2 * index);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  }
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(7);
  expect(game.asPlayerOne().quest(copies[0]!)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(7);
});
it("cannot use its future reward to pay its own play cost", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [baymaxLabAssistant],
    play: [itemA, itemB],
    inkwell: 3,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(baymaxLabAssistant)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(baymaxLabAssistant)).toBe("hand");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});
it("spends saved drops before awarding the new two", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [baymaxLabAssistant],
    play: [itemA, itemB],
    inkwell: 2,
    inkDrops: 2,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(baymaxLabAssistant, { inkDrops: 2 })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
});

it("rechecks the item threshold on the next play after an item leaves", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [baymaxLabAssistant, baymaxLabAssistant, befuddle],
      play: [itemA, itemB],
      inkwell: 9,
      deck: 6,
    },
    { play: [itemA, itemB], deck: 6 },
  );
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE).slice(0, 2);
  expect(game.asPlayerOne().playCard(copies[0]!)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().playCard(befuddle, { targets: [itemB] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(copies[1]!)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
});
it("the reward pays for a later item without bank ink and does not repeat Resupply", () => {
  const purchase = createMockItem({ id: "baymax-purchase", name: "New Equipment", cost: 2 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [baymaxLabAssistant, purchase],
    play: [itemA, itemB],
    inkwell: 4,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(baymaxLabAssistant)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().playCard(purchase, { inkDrops: 2 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getCardZone(purchase)).toBe("play");
});

for (const count of [1, 2, 3]) {
  it(`player two counts ${count} own items and preserves player one's pool`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [itemA, itemB], inkDrops: 4, deck: 6 },
      {
        hand: [baymaxLabAssistant],
        play: Array.from({ length: count }, () => itemA),
        inkwell: 4,
        inkDrops: 3,
        deck: 6,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(baymaxLabAssistant)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(count >= 2 ? 5 : 3);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
  });
}

it("Player Two gets no retroactive or quest reward when items arrive after a zero-item entry", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [itemA, itemB], inkDrops: 4, deck: 8 },
    {
      play: [baymaxLabAssistant],
      hand: [baymaxLabAssistant, baymaxLabAssistant, itemA, itemB],
      discard: [itemA],
      inkwell: 10,
      inkDrops: 3,
      deck: 8,
    },
  );
  const original = game.findCardInstanceId(baymaxLabAssistant, "play", PLAYER_TWO);
  const copies = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === baymaxLabAssistant.id);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(copies[0]!)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  for (const item of [itemA, itemB]) {
    const itemId = game.findCardInstanceId(item, "hand", PLAYER_TWO);
    expect(game.asPlayerTwo().playCard(itemId)).toBeSuccessfulCommand();
  }
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().playCard(copies[1]!)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().quest(original)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(1);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(copies[0]!)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(2);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(5);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});
