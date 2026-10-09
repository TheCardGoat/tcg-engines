// Rules grounding: Inkcaster Skates (set14-067).
// THE LATEST TREND {E} — If a character quested this turn, get 1 ink drop.
// (You may remove an ink drop to pay 1 {I}.)
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { inkcasterSkates } from "./067-inkcaster-skates";

const quester = createMockCharacter({
  id: "skates-quester",
  name: "Skates Quester",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

const payer = createMockCharacter({
  id: "skates-payer",
  name: "Skates Payer",
  cost: 1,
  strength: 1,
  willpower: 2,
});

describe("Inkcaster Skates", () => {
  it("gets 1 ink drop if a character quested this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [inkcasterSkates, { card: quester, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);

    expect(
      testEngine.asPlayerOne().activateAbility(inkcasterSkates, {
        ability: "THE LATEST TREND",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("gets no ink drop when no character quested this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [inkcasterSkates, { card: quester, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(inkcasterSkates, {
        ability: "THE LATEST TREND",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().isExerted(inkcasterSkates)).toBe(true);
    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().activateAbility(inkcasterSkates)).not.toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("the gained ink drop can pay an ink cost the same turn", () => {
    // No inkwell ink: the only resource is the ink drop from THE LATEST TREND.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [payer],
      play: [inkcasterSkates, { card: quester, isDrying: false }],
      deck: [],
    });

    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().activateAbility(inkcasterSkates, {
        ability: "THE LATEST TREND",
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    expect(testEngine.asPlayerOne().playCard(payer, { inkDrops: 1 })).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(payer)).toBe("play");
  });

  it("keeps unspent ink drops for later turns", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [inkcasterSkates, { card: quester, isDrying: false }], deck: [payer, payer, payer] },
      { deck: [payer, payer, payer] },
    );

    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().activateAbility(inkcasterSkates, {
        ability: "THE LATEST TREND",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });
  it("adds only one drop after several quests and only for its controller", () => {
    const second = createMockCharacter({
      id: "skates-second",
      name: "Second Quester",
      cost: 2,
      lore: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [inkcasterSkates, quester, second], inkDrops: 2 },
      { inkDrops: 3 },
    );
    expect(engine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(second)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().activateAbility(inkcasterSkates)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(3);
    expect(engine.asPlayerOne().activateAbility(inkcasterSkates)).not.toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
  });

  it("does not count a quest from a previous turn after becoming ready again", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [inkcasterSkates, quester], deck: [payer, payer, payer] },
      { deck: [payer, payer, payer] },
    );
    expect(engine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().activateAbility(inkcasterSkates)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(inkcasterSkates)).toBe(false);
    expect(engine.asPlayerOne().activateAbility(inkcasterSkates)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("can activate on the turn it is played after a character already quested", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkcasterSkates],
      play: [quester],
      inkwell: 3,
    });
    expect(engine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(inkcasterSkates)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().activateAbility(inkcasterSkates)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.asPlayerOne().isExerted(inkcasterSkates)).toBe(true);
  });

  it("counts a quest even when that character has since left play", () => {
    const fleeting = createMockCharacter({
      id: "skates-fleeting",
      name: "Fleeting Quester",
      cost: 2,
      lore: 1,
      abilities: [
        {
          type: "activated",
          cost: { banishSelf: true },
          effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [inkcasterSkates, fleeting],
    });
    expect(engine.asPlayerOne().quest(fleeting)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().activateAbility(fleeting)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(fleeting)).toBe("discard");
    expect(engine.asPlayerOne().activateAbility(inkcasterSkates)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("cannot be inked or played for less than three ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkcasterSkates],
      inkwell: 2,
    });
    expect(engine.asPlayerOne().ink(inkcasterSkates)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(inkcasterSkates)).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(inkcasterSkates)).toBe("hand");
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
  it("player two ignores a previous-turn opposing quest and gains a spendable drop after their own quest", () => {
    const opposing = createMockCharacter({
      id: "skates-opposing",
      cost: 1,
      name: "Opposing Quester",
      lore: 1,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [opposing], deck: 6, inkDrops: 3 },
      { play: [inkcasterSkates, quester], hand: [payer], deck: 6 },
    );
    expect(game.asPlayerOne().quest(opposing)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().activateAbility(inkcasterSkates)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(game.isExerted(inkcasterSkates)).toBe(true);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.isExerted(inkcasterSkates)).toBe(false);
    expect(game.asPlayerTwo().quest(quester)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().activateAbility(inkcasterSkates)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerTwo().playCard(payer, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getCardZone(payer)).toBe("play");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  });
  it("Player Two's exact copies pay exertion independently and reset the quest condition next turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [inkcasterSkates, quester], deck: 6, inkDrops: 3 },
      { play: [inkcasterSkates, inkcasterSkates, quester, quester], deck: 6 },
    );
    const skates = game
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === inkcasterSkates.id);
    const questers = game
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === quester.id);
    const opposingQuester = game.findCardInstanceId(quester, "play", PLAYER_ONE);
    expect(game.asPlayerOne().quest(opposingQuester)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().activateAbility(skates[0]!)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(skates[0]!)).toBe(false);
    expect(game.asPlayerTwo().activateAbility(skates[0]!)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(skates[0]!)).toBe(true);
    expect(game.asPlayerTwo().isExerted(skates[1]!)).toBe(false);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    for (const questerId of questers)
      expect(game.asPlayerTwo().quest(questerId)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().activateAbility(skates[0]!)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().activateAbility(skates[1]!)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    for (const id of skates) expect(game.asPlayerTwo().isExerted(id)).toBe(false);
    expect(game.asPlayerTwo().activateAbility(skates[0]!)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.asPlayerTwo().quest(questers[0]!)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().activateAbility(skates[1]!)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
});
