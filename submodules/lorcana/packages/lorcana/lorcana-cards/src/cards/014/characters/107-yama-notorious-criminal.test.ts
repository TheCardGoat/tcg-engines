// CR 2.2.0: 4.6 (challenges), 6.2.7.1 (floating triggers), 6.3 (activation).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockLocation,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { yamaNotoriousCriminal } from "./107-yama-notorious-criminal";

const firstAttacker = createMockCharacter({
  id: "yama-first-attacker",
  name: "First Attacker",
  cost: 2,
  strength: 3,
  willpower: 4,
});

const secondAttacker = createMockCharacter({
  id: "yama-second-attacker",
  name: "Second Attacker",
  cost: 2,
  strength: 3,
  willpower: 4,
});

const victim = createMockCharacter({
  id: "yama-victim",
  name: "Victim",
  cost: 2,
  strength: 1,
  willpower: 20,
});

describe("Yama - Notorious Criminal", () => {
  it("gets 1 ink drop whenever one of your characters challenges after paying 6 {I}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [yamaNotoriousCriminal, firstAttacker],
        inkwell: 6,
        deck: 6,
      },
      {
        play: [{ card: victim, exerted: true }],
        deck: 6,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(yamaNotoriousCriminal, {
        ability: "Keep 'Em Coming",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("gets one drop per challenge in the same turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [yamaNotoriousCriminal, firstAttacker, secondAttacker],
        inkwell: 6,
      },
      {
        play: [{ card: victim, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(yamaNotoriousCriminal, {
        ability: "Keep 'Em Coming",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().challenge(secondAttacker, victim)).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(2);
  });

  it("stops granting drops on later turns", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [yamaNotoriousCriminal, firstAttacker],
        inkwell: 6,
      },
      {
        play: [{ card: victim, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(yamaNotoriousCriminal, {
        ability: "Keep 'Em Coming",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(victim)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("grants no drops while the ability has not been activated", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [yamaNotoriousCriminal, firstAttacker],
        inkwell: 6,
      },
      {
        play: [{ card: victim, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});

const spot = createMockLocation({
  id: "yama-location",
  name: "Training Hall",
  cost: 1,
  willpower: 20,
});
const banish = createMockAction({
  id: "yama-banish",
  name: "Remove Yama",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
});
const activate = (
  game: LorcanaMultiplayerTestEngine,
  card: Parameters<
    ReturnType<LorcanaMultiplayerTestEngine["asPlayerOne"]>["activateAbility"]
  >[0] = yamaNotoriousCriminal,
) => game.asPlayerOne().activateAbility(card, { ability: "Keep 'Em Coming" });
it("does not reward challenges against locations", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [yamaNotoriousCriminal, firstAttacker], inkwell: 6 },
    { play: [spot] },
  );
  expect(activate(game)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(firstAttacker, spot)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});
it("a paid floating trigger persists after Yama leaves play", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [yamaNotoriousCriminal, firstAttacker], hand: [banish], inkwell: 6 },
    { play: [{ card: victim, exerted: true }] },
  );
  expect(activate(game)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().playCard(banish, { targets: [yamaNotoriousCriminal] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(yamaNotoriousCriminal)).toBe("discard");
  expect(game.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
});
it("repeated activations cost six each and create independent rewards without exerting Yama", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [yamaNotoriousCriminal, firstAttacker], inkwell: 12 },
    { play: [{ card: victim, exerted: true }] },
  );
  expect(activate(game)).toBeSuccessfulCommand();
  expect(activate(game)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().isExerted(yamaNotoriousCriminal)).toBe(false);
  expect(game.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(2);
  expect(
    game.asPlayerOne().resolveBag(game.asPlayerOne().getBagEffects()[0]!.id, {}),
  ).toBeSuccessfulCommand();
  if (game.asPlayerOne().getBagCount() > 0)
    expect(game.asPlayerOne().resolvePendingByCard(yamaNotoriousCriminal)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
});
it("two copies each create a reward for the same challenge", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [yamaNotoriousCriminal, yamaNotoriousCriminal, firstAttacker], inkwell: 12 },
    { play: [{ card: victim, exerted: true }] },
  );
  const ids = game.getCardInstanceIdsInZone("play", PLAYER_ONE);
  expect(activate(game, ids[0])).toBeSuccessfulCommand();
  expect(activate(game, ids[1])).toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(2);
  expect(game.asPlayerOne().resolvePendingByCard(ids[0])).toBeSuccessfulCommand();
  if (game.asPlayerOne().getBagCount() > 0)
    expect(game.asPlayerOne().resolvePendingByCard(ids[1])).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
});
it("can activate while drying or exerted because no exert cost is printed", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [{ card: yamaNotoriousCriminal, exerted: true, isDrying: true }, firstAttacker],
      inkwell: 6,
    },
    { play: [{ card: victim, exerted: true }] },
  );
  expect(activate(game)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(yamaNotoriousCriminal)).toBe(true);
  expect(game.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
});
it("rejected activation has no reward; five ink is insufficient", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [yamaNotoriousCriminal, firstAttacker], inkwell: 5 },
    { play: [{ card: victim, exerted: true }] },
  );
  expect(activate(game)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);
  expect(game.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});
it("activation can spend claimed drops; generated drops persist and pay for a later card", () => {
  const purchase = createMockCharacter({ id: "yama-purchase", name: "Purchase", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [yamaNotoriousCriminal, firstAttacker],
      hand: [purchase],
      inkwell: 5,
      inkDrops: 1,
      deck: 6,
    },
    { play: [{ card: victim, exerted: true }], deck: 6 },
  );
  expect(
    game
      .asPlayerOne()
      .activateAbility(yamaNotoriousCriminal, { ability: "Keep 'Em Coming", inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});
it("Yama can quest without gaining drops and then activate while exerted", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [yamaNotoriousCriminal, firstAttacker], inkwell: 6 },
    { play: [{ card: victim, exerted: true }] },
  );
  expect(game.asPlayerOne().quest(yamaNotoriousCriminal)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(activate(game)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
});
it("an illegal challenge grants no drop and a valid retry does", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [yamaNotoriousCriminal, firstAttacker, secondAttacker], inkwell: 6 },
    { play: [{ card: victim, exerted: true }, secondAttacker] },
  );
  expect(activate(game)).toBeSuccessfulCommand();
  const opposingReady = game.findCardInstanceId(secondAttacker, "play", PLAYER_TWO);
  expect(game.asPlayerOne().challenge(firstAttacker, opposingReady)).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
});
it("normal play costs four, remains drying and cannot be inked", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [yamaNotoriousCriminal],
    inkwell: 4,
    deck: 6,
  });
  expect(
    game.asPlayerOne().putIntoInkwell(PLAYER_ONE, yamaNotoriousCriminal),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(yamaNotoriousCriminal)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().quest(yamaNotoriousCriminal)).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("player two pays and gains only their own drops, then the floating reward expires", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [yamaNotoriousCriminal, victim], inkDrops: 3, deck: 6 },
    { play: [yamaNotoriousCriminal, firstAttacker], inkwell: 5, inkDrops: 1, deck: 6 },
  );
  expect(game.asPlayerOne().quest(victim)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const enemyYama = game.findCardInstanceId(yamaNotoriousCriminal, "play", PLAYER_ONE);
  const ownYama = game.findCardInstanceId(yamaNotoriousCriminal, "play", PLAYER_TWO);
  expect(
    game.asPlayerTwo().activateAbility(enemyYama, { ability: "Keep 'Em Coming", inkDrops: 1 }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(
    game.asPlayerTwo().activateAbility(ownYama, { ability: "Keep 'Em Coming", inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerTwo().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(victim)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
});

it("Player Two copies reject unbacked payment, retain both floating rewards after source removal and expire together", () => {
  const purchase = createMockCharacter({ id: "yama-p2-purchase", name: "Purchase", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [victim], deck: 6, inkDrops: 4 },
    {
      play: [yamaNotoriousCriminal, yamaNotoriousCriminal, firstAttacker, secondAttacker],
      hand: [banish, purchase, purchase],
      inkwell: 11,
      inkDrops: 1,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().quest(victim)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const [first, second] = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  expect(
    game.asPlayerTwo().activateAbility(first, {
      ability: "Keep 'Em Coming",
      inkDrops: 2,
    }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(11);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(
    game.asPlayerTwo().activateAbility(first, { ability: "Keep 'Em Coming" }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().quest(second)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(
    game.asPlayerTwo().activateAbility(second, { ability: "Keep 'Em Coming" }),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().activateAbility(second, {
      ability: "Keep 'Em Coming",
      inkDrops: 1,
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(first)).toBe(false);
  expect(game.asPlayerTwo().isExerted(second)).toBe(true);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().playCard(banish, { targets: [first] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(first)).toBe("discard");
  const reward = (attacker: typeof firstAttacker) => {
    expect(game.asPlayerTwo().challenge(attacker, victim)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(2);
    expect(
      game.asPlayerTwo().resolveBag(game.asPlayerTwo().getBagEffects()[0]!.id, {}),
    ).toBeSuccessfulCommand();
    if (game.asPlayerTwo().getBagCount() > 0) {
      expect(
        game.asPlayerTwo().resolveBag(game.asPlayerTwo().getBagEffects()[0]!.id, {}),
      ).toBeSuccessfulCommand();
    }
  };
  reward(firstAttacker);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  reward(secondAttacker);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  expect(game.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerOne().quest(victim)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(firstAttacker, victim)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  const carriedPurchase = game.findCardInstanceId(purchase, "hand", PLAYER_TWO);
  expect(game.asPlayerTwo().playCard(carriedPurchase, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(11);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
});
