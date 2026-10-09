import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goliathTransformedWarrior } from "./053-goliath-transformed-warrior";

const discardFodder = createMockCharacter({
  id: "goliath-test-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opposingThug = createMockCharacter({
  id: "goliath-test-thug",
  name: "Opposing Thug",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Goliath - Transformed Warrior", () => {
  it("WHEN NIGHT FALLS — discards a card to move up to 2 damage to an opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goliathTransformedWarrior, damage: 3 }],
        hand: [discardFodder],
        deck: 2,
      },
      {
        play: [{ card: opposingThug, isDrying: false }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [opposingThug],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getDamage(goliathTransformedWarrior)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(opposingThug)).toBe(2);
  });

  it("moves only the damage Goliath actually has", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goliathTransformedWarrior, damage: 1 }],
        hand: [discardFodder],
        deck: 2,
      },
      {
        play: [{ card: opposingThug, isDrying: false }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [opposingThug],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(goliathTransformedWarrior)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(opposingThug)).toBe(1);
  });

  it("cannot be activated without a card to discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goliathTransformedWarrior, damage: 2 }],
        hand: [],
        deck: 2,
      },
      {
        play: [{ card: opposingThug, isDrying: false }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        targets: [opposingThug],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(goliathTransformedWarrior)).toBe(2);
    expect(testEngine.asPlayerTwo().getDamage(opposingThug)).toBe(0);
  });

  it("can only be activated once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goliathTransformedWarrior, damage: 4 }],
        hand: [discardFodder, discardFodder],
        deck: 2,
      },
      {
        play: [{ card: opposingThug, isDrying: false }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [opposingThug],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [opposingThug],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(goliathTransformedWarrior)).toBe(2);
    expect(testEngine.asPlayerTwo().getDamage(opposingThug)).toBe(2);
  });

  it("STONE BY DAY — does not ready while you have 3 or more cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goliathTransformedWarrior, exerted: true }],
        hand: [discardFodder, discardFodder, discardFodder],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(goliathTransformedWarrior)).toBe(true);
  });

  it("readies normally while you have fewer than 3 cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goliathTransformedWarrior, exerted: true }],
        hand: [discardFodder],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(goliathTransformedWarrior)).toBe(false);
  });
  for (const amount of [0, 1]) {
    it(`lets the player choose to move ${amount} damage after paying the discard`, () => {
      const second = createMockCharacter({
        id: "goliath-second-target",
        name: "Second",
        cost: 1,
        willpower: 5,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: goliathTransformedWarrior, damage: 3 }], hand: [discardFodder], deck: 3 },
        { play: [opposingThug, second], deck: 3 },
      );
      expect(
        engine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
          abilityIndex: 0,
          costs: { discardCards: [discardFodder] },
        }),
      ).toBeSuccessfulCommand();
      expect(
        engine.asPlayerOne().resolveNextPending({ targets: [opposingThug], amount }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getDamage(goliathTransformedWarrior)).toBe(3 - amount);
      expect(engine.asPlayerTwo().getDamage(opposingThug)).toBe(amount);
      expect(engine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    });
  }

  it("checks Stone By Day before drawing the third hand card", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goliathTransformedWarrior, exerted: true }],
        hand: [discardFodder, discardFodder],
        deck: 3,
      },
      { deck: 3 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(engine.asPlayerOne().isExerted(goliathTransformedWarrior)).toBe(false);
  });

  it("rejects a friendly target without spending the discard or once-per-turn use", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goliathTransformedWarrior, damage: 2 }, discardFodder],
        hand: [discardFodder],
        deck: 3,
      },
      { play: [opposingThug], deck: 3 },
    );
    const friendly = engine.findCardInstanceId(discardFodder, "play", "player_one");
    const payment = engine.findCardInstanceId(discardFodder, "hand", "player_one");
    expect(
      engine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [payment] },
        targets: [friendly],
      }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(payment)).toBe("hand");
    expect(
      engine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [payment] },
        targets: [opposingThug],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(goliathTransformedWarrior)).toBe(0);
  });

  it("resets once-per-turn use on the next own turn and rejects opponent activation", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goliathTransformedWarrior, damage: 4, exerted: true }],
        hand: [discardFodder, discardFodder],
        deck: 3,
      },
      { play: [opposingThug], deck: 3 },
    );
    expect(
      engine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [opposingThug],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerTwo()
        .activateAbility(goliathTransformedWarrior, { abilityIndex: 0, targets: [opposingThug] }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [opposingThug],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(goliathTransformedWarrior)).toBe(0);
    expect(engine.asPlayerTwo().getDamage(opposingThug)).toBe(4);
  });
  it("player two pays one discard while exerted and moves lethal damage to only its chosen opponent", () => {
    const fragile = createMockCharacter({
      id: "goliath-p2-fragile",
      name: "Fragile",
      cost: 1,
      willpower: 2,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [fragile, opposingThug], deck: 6 },
      {
        play: [{ card: goliathTransformedWarrior, damage: 3, exerted: true }],
        hand: [discardFodder, discardFodder, discardFodder],
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().isExerted(goliathTransformedWarrior)).toBe(true);
    const payment = engine.getCardInstanceIdsInZone("hand", "player_two")[0]!;
    expect(
      engine.asPlayerTwo().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [payment] },
        targets: [fragile],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(payment)).toBe("discard");
    expect(engine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
    expect(engine.asPlayerTwo().getDamage(goliathTransformedWarrior)).toBe(1);
    expect(engine.asPlayerOne().getCardZone(fragile)).toBe("discard");
    expect(engine.asPlayerOne().getDamage(opposingThug)).toBe(0);
    expect(engine.asPlayerTwo().isExerted(goliathTransformedWarrior)).toBe(true);
    const remaining = engine.getCardInstanceIdsInZone("hand", "player_two")[0]!;
    expect(
      engine.asPlayerTwo().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [remaining] },
        targets: [opposingThug],
      }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(remaining)).toBe("hand");
    expect(engine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
  });
  it("player-two zero movement consumes its use and resets on the next own turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [opposingThug], deck: 6 },
      {
        play: [{ card: goliathTransformedWarrior, damage: 3, exerted: true }],
        hand: [discardFodder, discardFodder, discardFodder],
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const payments = engine.getCardInstanceIdsInZone("hand", "player_two");
    expect(
      engine.asPlayerTwo().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [payments[0]!] },
      }),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().resolveNextPending({ targets: [opposingThug], amount: 0 }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(goliathTransformedWarrior)).toBe(3);
    expect(engine.asPlayerOne().getDamage(opposingThug)).toBe(0);
    expect(engine.getCardInstanceIdsInZone("discard", "player_two")).toEqual([payments[0]!]);
    expect(
      engine.asPlayerTwo().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [payments[1]!] },
        targets: [opposingThug],
      }),
    ).not.toBeSuccessfulCommand();
    expect(engine.getCardInstanceIdsInZone("hand", "player_two")).toContain(payments[1]!);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().isExerted(goliathTransformedWarrior)).toBe(true);
    expect(
      engine.asPlayerTwo().activateAbility(goliathTransformedWarrior, {
        abilityIndex: 0,
        costs: { discardCards: [payments[1]!] },
        targets: [opposingThug],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(goliathTransformedWarrior)).toBe(1);
    expect(engine.asPlayerOne().getDamage(opposingThug)).toBe(2);
    expect(engine.getCardInstanceIdsInZone("discard", "player_two")).toEqual([
      payments[0]!,
      payments[1]!,
    ]);
  });
});
