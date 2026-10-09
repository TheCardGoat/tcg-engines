import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { demonaImperiousSpellcaster } from "./056-demona-imperious-spellcaster";

const discardFodder = createMockCharacter({
  id: "demona-056-fodder",
  name: "Spell Component",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const gargoyleAlly = createMockCharacter({
  id: "demona-056-gargoyle-ally",
  name: "Stone Wing",
  cost: 3,
  strength: 3,
  willpower: 4,
  classifications: ["Gargoyle"],
});

const plainAlly = createMockCharacter({
  id: "demona-056-plain-ally",
  name: "Plain Wing",
  cost: 3,
  strength: 3,
  willpower: 4,
});

const exertedCur = createMockCharacter({
  id: "demona-056-cur",
  name: "Stray Cur",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Demona - Imperious Spellcaster", () => {
  it("discards a card to give a chosen Gargoyle Rush and Evasive until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [demonaImperiousSpellcaster, gargoyleAlly],
      hand: [discardFodder],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(demonaImperiousSpellcaster, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [gargoyleAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.hasKeyword(gargoyleAlly, "Rush")).toBe(true);
    expect(testEngine.hasKeyword(gargoyleAlly, "Evasive")).toBe(true);
  });

  it("cannot choose a character without the Gargoyle classification", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [demonaImperiousSpellcaster, plainAlly],
      hand: [discardFodder],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(demonaImperiousSpellcaster, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [plainAlly],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("hand");
    expect(testEngine.hasKeyword(plainAlly, "Rush")).toBe(false);
    expect(testEngine.hasKeyword(plainAlly, "Evasive")).toBe(false);
  });

  it("lets the boosted Gargoyle challenge the turn it is played (Rush)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [demonaImperiousSpellcaster],
        hand: [gargoyleAlly, discardFodder],
        inkwell: gargoyleAlly.cost,
        deck: 2,
      },
      {
        play: [{ card: exertedCur, exerted: true }],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().playCard(gargoyleAlly)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(demonaImperiousSpellcaster, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [gargoyleAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().challenge(gargoyleAlly, exertedCur)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(exertedCur)).toBe("discard");
  });

  it("the granted keywords expire at the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [demonaImperiousSpellcaster, gargoyleAlly],
      hand: [discardFodder],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(demonaImperiousSpellcaster, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [gargoyleAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(gargoyleAlly, "Rush")).toBe(true);
    expect(testEngine.hasKeyword(gargoyleAlly, "Evasive")).toBe(true);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.hasKeyword(gargoyleAlly, "Rush")).toBe(false);
    expect(testEngine.hasKeyword(gargoyleAlly, "Evasive")).toBe(false);
  });

  it("STONE BY DAY — does not ready while you have 3 or more cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: demonaImperiousSpellcaster, exerted: true }],
        hand: [discardFodder, discardFodder, discardFodder],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(demonaImperiousSpellcaster)).toBe(true);
  });

  it("readies normally while you have fewer than 3 cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: demonaImperiousSpellcaster, exerted: true }],
        hand: [discardFodder],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(demonaImperiousSpellcaster)).toBe(false);
  });
  it("checks Stone By Day before drawing the third hand card", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: demonaImperiousSpellcaster, exerted: true }],
        hand: [discardFodder, discardFodder],
        deck: 3,
      },
      { deck: 3 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(engine.asPlayerOne().isExerted(demonaImperiousSpellcaster)).toBe(false);
  });

  it("requires a discard card and does not grant either keyword for free", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [demonaImperiousSpellcaster, gargoyleAlly],
      deck: 3,
    });
    expect(
      engine
        .asPlayerOne()
        .activateAbility(demonaImperiousSpellcaster, { abilityIndex: 0, targets: [gargoyleAlly] }),
    ).not.toBeSuccessfulCommand();
    expect(engine.hasKeyword(gargoyleAlly, "Rush")).toBe(false);
    expect(engine.hasKeyword(gargoyleAlly, "Evasive")).toBe(false);
  });

  it("can repeat while exerted and choose herself or an opposing Gargoyle", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: demonaImperiousSpellcaster, exerted: true }],
        hand: [discardFodder, discardFodder],
        deck: 3,
      },
      { play: [gargoyleAlly, plainAlly], deck: 3 },
    );
    const payments = engine.getCardInstanceIdsInZone("hand", "player_one");
    expect(
      engine.asPlayerOne().activateAbility(demonaImperiousSpellcaster, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [demonaImperiousSpellcaster],
      }),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().activateAbility(demonaImperiousSpellcaster, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [gargoyleAlly],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.hasKeyword(demonaImperiousSpellcaster, "Rush")).toBe(true);
    expect(engine.hasKeyword(demonaImperiousSpellcaster, "Evasive")).toBe(true);
    expect(engine.hasKeyword(gargoyleAlly, "Rush")).toBe(true);
    expect(engine.hasKeyword(gargoyleAlly, "Evasive")).toBe(true);
    expect(engine.hasKeyword(plainAlly, "Evasive")).toBe(false);
    expect(engine.getCardInstanceIdsInZone("discard", "player_one")).toEqual(payments);
    expect(engine.asPlayerOne().isExerted(demonaImperiousSpellcaster)).toBe(true);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().challenge(plainAlly, demonaImperiousSpellcaster),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.hasKeyword(demonaImperiousSpellcaster, "Evasive")).toBe(false);
    expect(engine.hasKeyword(gargoyleAlly, "Evasive")).toBe(false);
    expect(engine.hasKeyword(demonaImperiousSpellcaster, "Rush")).toBe(false);
    expect(engine.hasKeyword(gargoyleAlly, "Rush")).toBe(false);
  });

  it("can use the discard ability while drying and gain Rush herself", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [demonaImperiousSpellcaster, discardFodder], inkwell: 3, deck: 3 },
      { play: [{ card: exertedCur, exerted: true }], deck: 3 },
    );
    expect(engine.asPlayerOne().playCard(demonaImperiousSpellcaster)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().activateAbility(demonaImperiousSpellcaster, {
        abilityIndex: 0,
        costs: { discardCards: [discardFodder] },
        targets: [demonaImperiousSpellcaster],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(demonaImperiousSpellcaster)).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().challenge(demonaImperiousSpellcaster, exertedCur),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(exertedCur)).toBe("discard");
  });
  it("player-two grants to an opposing Gargoyle expire at the source controller's next start", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [gargoyleAlly], deck: 6 },
      {
        play: [{ card: demonaImperiousSpellcaster, exerted: true }],
        hand: [discardFodder, discardFodder, discardFodder],
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().isExerted(demonaImperiousSpellcaster)).toBe(true);
    const payment = engine.getCardInstanceIdsInZone("hand", "player_two")[0]!;
    expect(
      engine.asPlayerTwo().activateAbility(demonaImperiousSpellcaster, {
        abilityIndex: 0,
        costs: { discardCards: [payment] },
        targets: [gargoyleAlly],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(payment)).toBe("discard");
    expect(engine.hasKeyword(gargoyleAlly, "Rush")).toBe(true);
    expect(engine.hasKeyword(gargoyleAlly, "Evasive")).toBe(true);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.hasKeyword(gargoyleAlly, "Rush")).toBe(true);
    expect(engine.hasKeyword(gargoyleAlly, "Evasive")).toBe(true);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.hasKeyword(gargoyleAlly, "Rush")).toBe(false);
    expect(engine.hasKeyword(gargoyleAlly, "Evasive")).toBe(false);
    expect(engine.asPlayerTwo().isExerted(demonaImperiousSpellcaster)).toBe(true);
  });
});
