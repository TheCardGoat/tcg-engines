import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { lionheartIncumbentMayor } from "./018-lionheart-incumbent-mayor";

const allyOne = createMockCharacter({
  id: "lionheart-ally-one",
  name: "Ally One",
  cost: 2,
  lore: 1,
  strength: 2,
  willpower: 2,
});

const allyTwo = createMockCharacter({
  id: "lionheart-ally-two",
  name: "Ally Two",
  cost: 2,
  lore: 2,
  strength: 2,
  willpower: 2,
});

function effectiveLoreOf(
  testEngine: ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>,
  card: Parameters<
    ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>["findCardInstanceId"]
  >[0],
): number {
  const id = testEngine.findCardInstanceId(card, "play");
  return testEngine.asServer().getCard(id).lore ?? 0;
}

describe("Lionheart - Incumbent Mayor", () => {
  it("gives up to 2 chosen characters +1 {L} this turn when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [lionheartIncumbentMayor],
      inkwell: lionheartIncumbentMayor.cost,
      play: [allyOne, allyTwo],
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(lionheartIncumbentMayor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        targets: [allyOne, allyTwo],
      }),
    ).toBeSuccessfulCommand();

    expect(effectiveLoreOf(testEngine, allyOne)).toBe((allyOne.lore ?? 0) + 1);
    expect(effectiveLoreOf(testEngine, allyTwo)).toBe((allyTwo.lore ?? 0) + 1);
  });

  it("the +1 {L} expires at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lionheartIncumbentMayor],
        inkwell: lionheartIncumbentMayor.cost,
        play: [allyOne],
        deck: 6,
      },
      { deck: 6 },
    );

    expect(testEngine.asPlayerOne().playCard(lionheartIncumbentMayor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        targets: [allyOne],
      }),
    ).toBeSuccessfulCommand();
    expect(effectiveLoreOf(testEngine, allyOne)).toBe((allyOne.lore ?? 0) + 1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(effectiveLoreOf(testEngine, allyOne)).toBe(allyOne.lore);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(effectiveLoreOf(testEngine, allyOne)).toBe(allyOne.lore);
  });

  it("lets both selected characters quest for their increased lore", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [lionheartIncumbentMayor],
      inkwell: lionheartIncumbentMayor.cost,
      play: [allyOne, allyTwo],
      deck: 6,
    });
    expect(engine.asPlayerOne().playCard(lionheartIncumbentMayor)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveOnlyBag({ targets: [allyOne, allyTwo] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(allyOne)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(allyTwo)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(5);
  });

  it("can choose zero characters for Approval Rating", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [lionheartIncumbentMayor],
      inkwell: lionheartIncumbentMayor.cost,
      play: [allyOne],
      deck: 6,
    });
    expect(engine.asPlayerOne().playCard(lionheartIncumbentMayor)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().resolveOnlyBag({ targets: [] })).toBeSuccessfulCommand();
    expect(effectiveLoreOf(engine, allyOne)).toBe(allyOne.lore);
  });

  it.each([false, true])("can enter exerted with Bodyguard: %s", (enterPlayExerted: boolean) => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [lionheartIncumbentMayor],
      inkwell: lionheartIncumbentMayor.cost,
      deck: 6,
    });
    expect(
      engine.asPlayerOne().playCard(lionheartIncumbentMayor, { enterPlayExerted }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().resolveOnlyBag({ targets: [] })).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(lionheartIncumbentMayor)).toBe(enterPlayExerted);
  });
  it("can choose himself and an opposing character; both bonuses expire next turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [lionheartIncumbentMayor], inkwell: 6, deck: 6 },
      { play: [allyOne], deck: 6 },
    );
    expect(game.asPlayerOne().playCard(lionheartIncumbentMayor)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolveOnlyBag({ targets: [lionheartIncumbentMayor, allyOne] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCard(lionheartIncumbentMayor).lore).toBe(3);
    expect(game.asPlayerTwo().getCard(allyOne).lore).toBe(2);
    expect(game.asPlayerOne().quest(lionheartIncumbentMayor).success).toBe(false);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCard(lionheartIncumbentMayor).lore).toBe(2);
    expect(game.asPlayerTwo().getCard(allyOne).lore).toBe(1);
    expect(game.asPlayerTwo().quest(allyOne)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(1);
  });

  it("rejects three chosen characters without applying a partial bonus", () => {
    const thirdAlly = { ...allyOne, id: "lionheart-third-ally" };
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [lionheartIncumbentMayor],
      inkwell: 6,
      play: [allyOne, allyTwo, thirdAlly],
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(lionheartIncumbentMayor)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolveOnlyBag({ targets: [allyOne, allyTwo, thirdAlly] }).success,
    ).toBe(false);
    expect(game.asPlayerOne().getCard(allyOne).lore).toBe(1);
    expect(game.asPlayerOne().getCard(allyTwo).lore).toBe(2);
    expect(game.asPlayerOne().getCard(thirdAlly).lore).toBe(1);
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    expect(game.asPlayerOne().resolveOnlyBag({ targets: [allyOne] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCard(allyOne).lore).toBe(2);
    expect(game.asPlayerOne().getCard(allyTwo).lore).toBe(2);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });
  it("Player Two grants and quests for increased lore only during that turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { hand: [lionheartIncumbentMayor], play: [allyOne, allyTwo], inkwell: 6, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(lionheartIncumbentMayor, { enterPlayExerted: true }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveOnlyBag({ targets: [allyOne, allyTwo] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().isExerted(lionheartIncumbentMayor)).toBe(true);
    expect(game.asPlayerTwo().quest(allyOne)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(allyTwo)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(5);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCard(allyOne).lore).toBe(1);
    expect(game.asPlayerTwo().getCard(allyTwo).lore).toBe(2);
  });
  it("an exerted Lionheart protects other exerted characters from challenges", () => {
    const attacker = createMockCharacter({
      id: "lionheart-attacker",
      name: "Attacker",
      cost: 1,
      strength: 5,
      willpower: 6,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: lionheartIncumbentMayor, exerted: true },
          { card: allyOne, exerted: true },
        ],
        deck: 6,
      },
      { play: [attacker], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(attacker, allyOne).success).toBe(false);
    expect(game.asPlayerTwo().isExerted(attacker)).toBe(false);
    expect(game.asPlayerOne().getDamage(allyOne)).toBe(0);
    expect(game.asPlayerTwo().challenge(attacker, lionheartIncumbentMayor)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(lionheartIncumbentMayor)).toBe(5);
    expect(game.asPlayerTwo().getDamage(attacker)).toBe(4);
    expect(game.asPlayerOne().getCardZone(lionheartIncumbentMayor)).toBe("play");
  });
  it("Player Two's exact copies stack on self, allow friendly Ward and reject opposing Ward", () => {
    const wardCharacter = createMockCharacter({
      id: "lionheart-ward",
      name: "Ward Ally",
      cost: 1,
      lore: 1,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [allyOne, wardCharacter], deck: 6 },
      {
        hand: [lionheartIncumbentMayor, lionheartIncumbentMayor],
        play: [wardCharacter],
        inkwell: 12,
        deck: 6,
      },
    );
    const copies = game.getCardInstanceIdsInZone("hand", PLAYER_TWO);
    const opposingAlly = game.findCardInstanceId(allyOne, "play", PLAYER_ONE);
    const ownWard = game.findCardInstanceId(wardCharacter, "play", PLAYER_TWO);
    const opposingWard = game.findCardInstanceId(wardCharacter, "play", PLAYER_ONE);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(copies[0]!, { enterPlayExerted: false }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolveOnlyBag({ targets: [copies[0]!] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveOnlyBag({ targets: [opposingWard] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCard(copies[0]!).lore).toBe(2);
    expect(
      game.asPlayerTwo().resolveOnlyBag({ targets: [copies[0]!, opposingAlly] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCard(copies[0]!).lore).toBe(3);
    expect(game.asPlayerOne().getCard(opposingAlly).lore).toBe(2);
    expect(
      game.asPlayerTwo().playCard(copies[1]!, { enterPlayExerted: true }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveOnlyBag({ targets: [copies[0]!, ownWard] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCard(copies[0]!).lore).toBe(4);
    expect(game.asPlayerTwo().getCard(copies[1]!).lore).toBe(2);
    expect(game.asPlayerTwo().getCard(ownWard).lore).toBe(2);
    expect(game.asPlayerTwo().quest(ownWard)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCard(copies[0]!).lore).toBe(2);
    expect(game.asPlayerTwo().getCard(ownWard).lore).toBe(1);
    expect(game.asPlayerOne().getCard(opposingAlly).lore).toBe(1);
    expect(game.asPlayerOne().quest(opposingAlly)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
  });
});
