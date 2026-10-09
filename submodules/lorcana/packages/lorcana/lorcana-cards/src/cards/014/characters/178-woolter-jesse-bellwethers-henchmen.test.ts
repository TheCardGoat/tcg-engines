// CR 8.3.2–8.3.3: optional exerted entry and if-able Bodyguard limiter.
// CR 8.5.1–8.5.2: Challenger applies only while attacking.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { woolterJesseBellwethersHenchmen } from "./178-woolter-jesse-bellwethers-henchmen";

const sixWillpowerDefender = createMockCharacter({
  id: "woolter-jesse-six-willpower-defender",
  name: "Six Willpower Defender",
  cost: 4,
  strength: 1,
  willpower: 6,
});

const plainAlly = createMockCharacter({
  id: "woolter-jesse-plain-ally",
  name: "Plain Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const attacker = createMockCharacter({
  id: "woolter-jesse-attacker",
  name: "Attacker",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Woolter & Jesse - Bellwether's Henchmen", () => {
  it("has Challenger +2 and banishes a 6 {W} defender when challenging", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: woolterJesseBellwethersHenchmen, isDrying: false }],
        deck: 1,
      },
      {
        play: [{ card: sixWillpowerDefender, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().getKeywordValue(woolterJesseBellwethersHenchmen, "Challenger"),
    ).toBe(2);

    expect(
      testEngine.asPlayerOne().challenge(woolterJesseBellwethersHenchmen, sixWillpowerDefender),
    ).toBeSuccessfulCommand();

    // 4 {S} + 2 Challenger = 6 damage.
    expect(testEngine.asPlayerTwo().getCardZone(sixWillpowerDefender)).toBe("discard");
    expect(testEngine.asPlayerOne().getDamage(woolterJesseBellwethersHenchmen)).toBe(1);
    expect(testEngine.asPlayerOne().getCardStrength(woolterJesseBellwethersHenchmen)).toBe(4);
  });

  it("must be challenged first while exerted (Bodyguard)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: woolterJesseBellwethersHenchmen, exerted: true },
          { card: plainAlly, exerted: true },
        ],
        deck: 1,
      },
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().challenge(attacker, plainAlly)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(plainAlly)).toBe("play");

    expect(
      testEngine.asPlayerTwo().challenge(attacker, woolterJesseBellwethersHenchmen),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(woolterJesseBellwethersHenchmen)).toBe(2);
    expect(testEngine.asPlayerTwo().getCardZone(attacker)).toBe("discard");
  });

  it("a ready Bodyguard does not stop challenging an exerted ally", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [woolterJesseBellwethersHenchmen, { card: plainAlly, exerted: true }], deck: 3 },
      { play: [{ card: attacker, isDrying: false }], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(attacker, plainAlly)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(plainAlly)).toBe(2);
    expect(game.asPlayerOne().getDamage(woolterJesseBellwethersHenchmen)).toBe(0);
  });
  it.each([false, true])(
    "pays three ink and chooses Bodyguard entry: %s",
    (enterPlayExerted: boolean) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [woolterJesseBellwethersHenchmen],
        inkwell: 3,
        deck: 3,
      });
      const player = game.asPlayerOne();
      expect(
        player.playCard(woolterJesseBellwethersHenchmen, { enterPlayExerted }),
      ).toBeSuccessfulCommand();
      expect(player.getAvailableInk("player_one")).toBe(0);
      expect(player.isExerted(woolterJesseBellwethersHenchmen)).toBe(enterPlayExerted);
      expect(player.quest(woolterJesseBellwethersHenchmen)).not.toBeSuccessfulCommand();
      expect(player.passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(player.quest(woolterJesseBellwethersHenchmen)).toBeSuccessfulCommand();
      expect(game.getLore("player_one")).toBe(1);
      expect(player.getCardStrength(woolterJesseBellwethersHenchmen)).toBe(4);
    },
  );

  it("uses base strength when defending", () => {
    const toughAttacker = createMockCharacter({
      id: "woolter-tough-attacker",
      name: "Tough Attacker",
      cost: 3,
      strength: 1,
      willpower: 7,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: woolterJesseBellwethersHenchmen, exerted: true }], deck: 3 },
      { play: [{ card: toughAttacker, isDrying: false }], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().challenge(toughAttacker, woolterJesseBellwethersHenchmen),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(toughAttacker)).toBe(4);
    expect(game.asPlayerOne().getDamage(woolterJesseBellwethersHenchmen)).toBe(1);
    expect(game.asPlayerOne().getCardStrength(woolterJesseBellwethersHenchmen)).toBe(4);
  });
  it("allows either exerted Bodyguard but protects other exerted characters", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: woolterJesseBellwethersHenchmen, exerted: true },
          { card: woolterJesseBellwethersHenchmen, exerted: true },
          { card: plainAlly, exerted: true },
        ],
        deck: 3,
      },
      {
        play: [
          { card: attacker, isDrying: false },
          { card: attacker, isDrying: false },
        ],
        deck: 3,
      },
    );
    const guards = game
      .getCardInstanceIdsInZone("play", "player_one")
      .filter((id) => game.getCardDefinitionId(id) === woolterJesseBellwethersHenchmen.id);
    const attackers = game.getCardInstanceIdsInZone("play", "player_two");
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(attackers[0]!, plainAlly)).not.toBeSuccessfulCommand();
    expect(game.isExerted(attackers[0]!)).toBe(false);
    expect(game.asPlayerOne().getDamage(plainAlly)).toBe(0);
    expect(game.asPlayerOne().getDamage(guards[0]!)).toBe(0);
    expect(game.asPlayerOne().getDamage(guards[1]!)).toBe(0);
    expect(game.asPlayerTwo().challenge(attackers[0]!, guards[0]!)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(attackers[1]!, guards[1]!)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(guards[0]!)).toBe(2);
    expect(game.asPlayerOne().getDamage(guards[1]!)).toBe(2);
    expect(game.asPlayerOne().getDamage(plainAlly)).toBe(0);
  });

  it("an inaccessible Evasive Bodyguard does not protect another exerted character", () => {
    const giveEvasive = createMockAction({
      id: "woolter-evasive-grant",
      name: "Give Evasive",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "gain-keyword",
            keyword: "Evasive",
            target: "CHOSEN_CHARACTER",
            duration: "until-start-of-next-turn",
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [giveEvasive],
        play: [
          { card: woolterJesseBellwethersHenchmen, exerted: true },
          { card: plainAlly, exerted: true },
        ],
        deck: 3,
      },
      { play: [{ card: attacker, isDrying: false }], deck: 3 },
    );
    expect(
      g.asPlayerOne().playCard(giveEvasive, { targets: [woolterJesseBellwethersHenchmen] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().hasKeyword(woolterJesseBellwethersHenchmen, "Evasive")).toBe(true);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().challenge(attacker, woolterJesseBellwethersHenchmen),
    ).not.toBeSuccessfulCommand();
    expect(g.isExerted(attacker)).toBe(false);
    expect(g.asPlayerTwo().challenge(attacker, plainAlly)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(plainAlly)).toBe(2);
    expect(g.asPlayerOne().getDamage(woolterJesseBellwethersHenchmen)).toBe(0);
  });

  it("player two gains Challenger strength on their own attack", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sixWillpowerDefender, exerted: true }], deck: 3 },
      { play: [{ card: woolterJesseBellwethersHenchmen, isDrying: false }], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // The defender readies at the start of its controller's turn, not the opponent's turn.
    expect(
      game.asPlayerTwo().challenge(woolterJesseBellwethersHenchmen, sixWillpowerDefender),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(sixWillpowerDefender)).toBe("discard");
    expect(game.asPlayerTwo().getDamage(woolterJesseBellwethersHenchmen)).toBe(1);
    expect(game.asPlayerTwo().getCardStrength(woolterJesseBellwethersHenchmen)).toBe(4);
  });

  it("rejects play below three ink and rejects normal inking", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [woolterJesseBellwethersHenchmen],
      inkwell: 2,
      deck: 3,
    });
    expect(
      game.asPlayerOne().playCard(woolterJesseBellwethersHenchmen, { enterPlayExerted: true }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().putIntoInkwell("player_one", woolterJesseBellwethersHenchmen),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(woolterJesseBellwethersHenchmen)).toBe("hand");
    expect(game.asServer().getAvailableInk("player_one")).toBe(2);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });
});
