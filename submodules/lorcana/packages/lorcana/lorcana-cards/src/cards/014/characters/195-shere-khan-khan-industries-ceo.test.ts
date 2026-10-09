// CR 4.6.6, 6.2.3 and 6.2.5: challenge victory and per-source, turn-gated rewards.
// CR 6.1.13.4 and 8.11: this-turn grants expire and chosen targets respect Ward.
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { aladdinPrinceAli } from "../../001/characters/069-aladdin-prince-ali";
import { bellesHouseMauricesWorkshop } from "../../003/locations/168-belles-house-maurices-workshop";
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { shereKhanKhanIndustriesCeo } from "./195-shere-khan-khan-industries-ceo";

const myBruiser = createMockCharacter({
  id: "khan-bruiser",
  name: "Bruiser",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const readyEnemy = createMockCharacter({
  id: "khan-ready-enemy",
  name: "Ready Enemy",
  cost: 2,
  strength: 1,
  willpower: 4,
});

const doomedEnemy = createMockCharacter({
  id: "khan-doomed-enemy",
  name: "Doomed Enemy",
  cost: 1,
  strength: 0,
  willpower: 4,
});

describe("Shere Khan - Khan Industries CEO", () => {
  it("NEW INCENTIVE lets a chosen character challenge ready characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shereKhanKhanIndustriesCeo],
        inkwell: shereKhanKhanIndustriesCeo.cost,
        play: [myBruiser],
      },
      { play: [readyEnemy] },
    );

    expect(testEngine.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(shereKhanKhanIndustriesCeo, {
        targets: [myBruiser],
      }),
    ).toBeSuccessfulCommand();

    // A ready character is normally not a legal defender; the grant allows it.
    expect(testEngine.asPlayerOne().challenge(myBruiser, readyEnemy)).toBeSuccessfulCommand();
  });

  it("CORNER THE MARKET grants an ink drop when another character of yours banishes in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shereKhanKhanIndustriesCeo],
        inkwell: shereKhanKhanIndustriesCeo.cost,
        play: [myBruiser],
      },
      { play: [{ card: doomedEnemy, exerted: true }] },
    );

    expect(testEngine.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
    // NEW INCENTIVE's chosen-character target is mandatory; grant it to my own
    // bruiser (harmless here) so the bag is empty before challenging.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(shereKhanKhanIndustriesCeo, {
        targets: [myBruiser],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().challenge(myBruiser, doomedEnemy)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(doomedEnemy)).toBe("discard");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });
});

it("Corner the Market rewards only the first other-character victory each turn", () => {
  const secondAlly = createMockCharacter({
    id: "khan-second-ally",
    name: "Second Ally",
    cost: 1,
    strength: 4,
    willpower: 4,
  });
  const secondEnemy = createMockCharacter({
    id: "khan-second-enemy",
    name: "Second Enemy",
    cost: 1,
    strength: 0,
    willpower: 4,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        { card: shereKhanKhanIndustriesCeo, isDrying: false },
        { card: myBruiser, isDrying: false },
        { card: secondAlly, isDrying: false },
      ],
      deck: 3,
    },
    {
      play: [
        { card: doomedEnemy, exerted: true },
        { card: secondEnemy, exerted: true },
      ],
      deck: 3,
    },
  );
  expect(game.asPlayerOne().challenge(myBruiser, doomedEnemy)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().challenge(secondAlly, secondEnemy)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerTwo().getCardZone(secondEnemy)).toBe("discard");
});

it("Corner the Market excludes Shere Khan's own victory", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: shereKhanKhanIndustriesCeo, isDrying: false }], deck: 3 },
    { play: [{ card: doomedEnemy, exerted: true }], deck: 3 },
  );
  expect(
    game.asPlayerOne().challenge(shereKhanKhanIndustriesCeo, doomedEnemy),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(doomedEnemy)).toBe("discard");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("New Incentive does not override Fresh Ink on Shere Khan himself", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanKhanIndustriesCeo], inkwell: 4, deck: 3 },
    { play: [readyEnemy], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [shereKhanKhanIndustriesCeo] }),
  ).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().challenge(shereKhanKhanIndustriesCeo, readyEnemy),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(shereKhanKhanIndustriesCeo)).toBe(false);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("New Incentive expires before the chosen character's next own turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [shereKhanKhanIndustriesCeo],
      inkwell: 4,
      play: [{ card: myBruiser, isDrying: false }],
      deck: 3,
    },
    { play: [readyEnemy], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [myBruiser] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(myBruiser, readyEnemy)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(myBruiser)).toBe(false);
  expect(game.asPlayerTwo().getDamage(readyEnemy)).toBe(0);
});

it("Corner the Market can reward a new victory on the next own turn", () => {
  const second = createMockCharacter({
    id: "khan-reset-victim",
    name: "Second Victim",
    cost: 1,
    strength: 0,
    willpower: 4,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        { card: shereKhanKhanIndustriesCeo, isDrying: false },
        { card: myBruiser, isDrying: false },
      ],
      deck: 3,
    },
    {
      play: [
        { card: doomedEnemy, exerted: true },
        { card: second, exerted: true },
      ],
      deck: 3,
    },
  );
  expect(game.asPlayerOne().challenge(myBruiser, doomedEnemy)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(second)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(myBruiser, second)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
});

it("Corner the Market pays only Player Two for their other character's victory", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: doomedEnemy, exerted: true }], deck: 3 },
    {
      play: [
        { card: shereKhanKhanIndustriesCeo, isDrying: false },
        { card: myBruiser, isDrying: false },
      ],
      deck: 3,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(myBruiser, doomedEnemy)).toBeSuccessfulCommand();
  expect(game.getInkDrops("player_two")).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("Corner the Market does not reward a defensive victory on the opponent turn", () => {
  const attacker = createMockCharacter({
    id: "khan-suicide",
    name: "Attacker",
    cost: 1,
    strength: 1,
    willpower: 1,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [shereKhanKhanIndustriesCeo, { card: myBruiser, exerted: true }], deck: 3 },
    { play: [attacker], deck: 3 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(attacker, myBruiser)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(attacker)).toBe("discard");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("two Shere Khans each reward the same other character's victory", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        shereKhanKhanIndustriesCeo,
        shereKhanKhanIndustriesCeo,
        { card: myBruiser, isDrying: false },
      ],
      deck: 3,
    },
    { play: [{ card: doomedEnemy, exerted: true }], deck: 3 },
  );
  expect(game.asPlayerOne().challenge(myBruiser, doomedEnemy)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(2);
  expect(
    game.asPlayerOne().resolvePendingByCard(shereKhanKhanIndustriesCeo),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
});

it("Corner the Market does not reward damage without banishment", () => {
  const survivor = createMockCharacter({
    id: "khan-survivor",
    name: "Survivor",
    cost: 1,
    strength: 0,
    willpower: 5,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [shereKhanKhanIndustriesCeo, { card: myBruiser, isDrying: false }], deck: 3 },
    { play: [{ card: survivor, exerted: true }], deck: 3 },
  );
  expect(game.asPlayerOne().challenge(myBruiser, survivor)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getDamage(survivor)).toBe(4);
  expect(game.asPlayerTwo().getCardZone(survivor)).toBe("play");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

for (const target of [aladdinPrinceAli, bellesHouseMauricesWorkshop]) {
  it(`New Incentive rejects opposing ${target.name} then accepts a friendly character`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shereKhanKhanIndustriesCeo],
        inkwell: 4,
        play: [{ card: myBruiser, isDrying: false }],
        deck: 3,
      },
      { play: [target, readyEnemy], deck: 3 },
    );
    expect(game.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [target] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [myBruiser] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().challenge(myBruiser, readyEnemy)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  });
}

it("New Incentive can target a friendly Ward character", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [shereKhanKhanIndustriesCeo],
      inkwell: 4,
      play: [{ card: aladdinPrinceAli, isDrying: false }],
      deck: 3,
    },
    { play: [readyEnemy], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [aladdinPrinceAli] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(aladdinPrinceAli, readyEnemy)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getDamage(readyEnemy)).toBe(aladdinPrinceAli.strength);
});

it("New Incentive accepts an opposing character but grants no opponent-turn carryover", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [shereKhanKhanIndustriesCeo],
      inkwell: 4,
      play: [{ card: myBruiser, isDrying: false }],
      deck: 3,
    },
    { play: [readyEnemy], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [readyEnemy] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(readyEnemy, myBruiser)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(readyEnemy)).toBe(false);
});

it("Shere Khan cannot be inked and unpaid play changes no resources", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [shereKhanKhanIndustriesCeo],
    inkwell: 3,
    deck: 3,
  });
  expect(
    game.asPlayerOne().putIntoInkwell(PLAYER_ONE, shereKhanKhanIndustriesCeo),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(shereKhanKhanIndustriesCeo)).toBe("hand");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("Shere Khan normal entry pays four and can quest next turn without market reward", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanKhanIndustriesCeo], inkwell: 4, deck: 3 },
    { play: [{ card: doomedEnemy, exerted: true }], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [shereKhanKhanIndustriesCeo] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(shereKhanKhanIndustriesCeo)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().challenge(shereKhanKhanIndustriesCeo, doomedEnemy),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
});

it("Corner the Market ignores action banishment", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [shereKhanKhanIndustriesCeo], hand: [dragonFire], inkwell: 5, deck: 3 },
    { play: [doomedEnemy], deck: 3 },
  );
  expect(
    game.asPlayerOne().playCard(dragonFire, { targets: [doomedEnemy] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(doomedEnemy)).toBe("discard");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("mandatory New Incentive rejects missing, multiple and wrong-player targets before valid retry", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanKhanIndustriesCeo], play: [myBruiser], inkwell: 4, deck: 3 },
    { play: [readyEnemy], deck: 3 },
  );
  expect(g.asPlayerOne().playCard(shereKhanKhanIndustriesCeo)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(1);
  expect(
    g.asPlayerTwo().resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [readyEnemy] }),
  ).not.toBeSuccessfulCommand();
  expect(
    g.asPlayerOne().resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [] }),
  ).not.toBeSuccessfulCommand();
  expect(
    g
      .asPlayerOne()
      .resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [myBruiser, readyEnemy] }),
  ).not.toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(1);
  expect(g.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(
    g.asPlayerOne().resolvePendingByCard(shereKhanKhanIndustriesCeo, { targets: [myBruiser] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(0);
  expect(g.asPlayerOne().challenge(myBruiser, readyEnemy)).toBeSuccessfulCommand();
  expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
});

it("one CEO's own victory rewards only the other CEO without using the winner's limit", () => {
  const otherVictim = createMockCharacter({
    id: "khan-other-victim",
    name: "Other Victim",
    cost: 1,
    strength: 0,
    willpower: 4,
  });
  const purchase = createMockCharacter({ id: "khan-purchase", name: "Purchase", cost: 1 });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [shereKhanKhanIndustriesCeo, shereKhanKhanIndustriesCeo, myBruiser],
      hand: [purchase],
      deck: 3,
    },
    {
      play: [
        { card: doomedEnemy, exerted: true },
        { card: otherVictim, exerted: true },
      ],
      deck: 3,
    },
  );
  const ceos = g
    .getCardInstanceIdsInZone("play", PLAYER_ONE)
    .filter((id) => g.getCardDefinitionId(id) === shereKhanKhanIndustriesCeo.id);
  expect(g.asPlayerOne().challenge(ceos[0]!, doomedEnemy)).toBeSuccessfulCommand();
  expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(g.asPlayerOne().challenge(myBruiser, otherVictim)).toBeSuccessfulCommand();
  expect(g.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(g.asPlayerOne().getBagCount()).toBe(0);
  expect(g.asPlayerOne().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(purchase)).toBe("play");
  expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(g.getInkDrops("player_two")).toBe(0);
});

it("a location victory does not consume Corner the Market before a character victory", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [shereKhanKhanIndustriesCeo, myBruiser, myBruiser], deck: 3 },
    {
      play: [
        { card: bellesHouseMauricesWorkshop, damage: 3 },
        { card: doomedEnemy, exerted: true },
      ],
      deck: 3,
    },
  );
  const allies = g
    .getCardInstanceIdsInZone("play", PLAYER_ONE)
    .filter((id) => g.getCardDefinitionId(id) === myBruiser.id);
  expect(
    g.asPlayerOne().challenge(allies[0]!, bellesHouseMauricesWorkshop),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getCardZone(bellesHouseMauricesWorkshop)).toBe("discard");
  expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(g.asPlayerOne().getBagCount()).toBe(0);
  expect(g.asPlayerOne().challenge(allies[1]!, doomedEnemy)).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getCardZone(doomedEnemy)).toBe("discard");
  expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(g.asPlayerOne().getBagCount()).toBe(0);
});
