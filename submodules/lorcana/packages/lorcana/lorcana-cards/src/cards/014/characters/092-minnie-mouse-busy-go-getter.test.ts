// CR 8.8.1-8.8.3: Resist reduces each damage event, zero is no damage, and moved/put damage is unaffected.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseBusyGogetter } from "./092-minnie-mouse-busy-go-getter";

const attacker = (strength: number) =>
  createMockCharacter({
    id: `minnie-attacker-${strength}`,
    name: `Attacker ${strength}`,
    cost: 1,
    strength,
    willpower: 6,
  });
const damage = (amount: number) =>
  createMockAction({
    id: `minnie-damage-${amount}`,
    name: `Damage ${amount}`,
    cost: 1,
    abilities: [
      { type: "action", effect: { type: "deal-damage", amount, target: "CHOSEN_CHARACTER" } },
    ],
  });

describe("Minnie Mouse - Busy Go-Getter", () => {
  it("has no Resist during own turns and exactly two during consecutive opponent turns", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [minnieMouseBusyGogetter], deck: 6 },
      { deck: 6 },
    );
    for (let round = 0; round < 2; round++) {
      expect(game.getKeywordValue(minnieMouseBusyGogetter, "Resist")).toBeNull();
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.getKeywordValue(minnieMouseBusyGogetter, "Resist")).toBe(2);
      expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(game.getKeywordValue(minnieMouseBusyGogetter, "Resist")).toBeNull();
    }
  });
  for (const amount of [1, 2, 3, 4]) {
    it(`reduces opposing action damage ${amount} by two and banishes only when lethal`, () => {
      const action = damage(amount);
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [minnieMouseBusyGogetter], deck: 6 },
        { hand: [action], inkwell: 1, deck: 6 },
      );
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        game.asPlayerTwo().playCard(action, { targets: [minnieMouseBusyGogetter] }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(minnieMouseBusyGogetter)).toBe(
        amount === 4 ? "discard" : "play",
      );
      const prevented = game
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .flatMap((entry) => entry.public)
        .filter((entry) => entry.key === "lorcana.outcome.damagePrevented");
      expect(prevented).toHaveLength(amount <= 2 ? 1 : 0);
      if (amount <= 2) expect(prevented[0]?.values.amount).toBe(amount);

      if (amount < 4)
        expect(game.asPlayerOne()).toHaveDamage({
          card: minnieMouseBusyGogetter,
          value: Math.max(0, amount - 2),
        });
    });
  }
  for (const strength of [2, 3, 4]) {
    it(`reduces incoming challenge strength ${strength} and returns one damage`, () => {
      const enemy = attacker(strength);
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [minnieMouseBusyGogetter], deck: 6 },
        { play: [enemy], deck: 6 },
      );
      expect(game.asPlayerOne().quest(minnieMouseBusyGogetter)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(2);
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().challenge(enemy, minnieMouseBusyGogetter)).toBeSuccessfulCommand();
      expect(game.asPlayerTwo()).toHaveDamage({ card: enemy, value: 1 });
      expect(game.asPlayerOne().getCardZone(minnieMouseBusyGogetter)).toBe(
        strength === 4 ? "discard" : "play",
      );
      if (strength < 4)
        expect(game.asPlayerOne()).toHaveDamage({
          card: minnieMouseBusyGogetter,
          value: strength - 2,
        });
    });
  }
  it("reduces each separate damage event instead of the turn total", () => {
    const one = damage(1),
      three = damage(3);
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [minnieMouseBusyGogetter], deck: 6 },
      { hand: [one, three, three], inkwell: 3, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    for (const [index, card] of [one, three, three].entries()) {
      expect(
        game.asPlayerTwo().playCard(game.findCardInstanceId(card, "hand", PLAYER_TWO), {
          targets: [minnieMouseBusyGogetter],
        }),
      ).toBeSuccessfulCommand();
      if (index < 2)
        expect(game.asPlayerOne()).toHaveDamage({ card: minnieMouseBusyGogetter, value: index });
    }
    expect(game.asPlayerOne().getCardZone(minnieMouseBusyGogetter)).toBe("discard");
  });
  it("own-turn damage is not reduced", () => {
    const one = damage(1);
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [minnieMouseBusyGogetter],
      hand: [one, one],
      inkwell: 2,
      deck: 6,
    });
    for (let n = 0; n < 2; n++) {
      expect(
        game.asPlayerOne().playCard(game.findCardInstanceId(one, "hand", PLAYER_ONE), {
          targets: [minnieMouseBusyGogetter],
        }),
      ).toBeSuccessfulCommand();
      if (!n) expect(game.asPlayerOne()).toHaveDamage({ card: minnieMouseBusyGogetter, value: 1 });
    }
    expect(game.asPlayerOne().getCardZone(minnieMouseBusyGogetter)).toBe("discard");
  });
  it("own-turn challenges take full damage", () => {
    const enemy = attacker(2);
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [minnieMouseBusyGogetter], deck: 6 },
      { play: [{ card: enemy, exerted: true }], deck: 6 },
    );
    expect(game.asPlayerOne().challenge(minnieMouseBusyGogetter, enemy)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(minnieMouseBusyGogetter)).toBe("discard");
    expect(game.asPlayerTwo()).toHaveDamage({ card: enemy, value: 1 });
  });
  it("two copies each gain two Resist without granting it to another character", () => {
    const ally = attacker(1);
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [minnieMouseBusyGogetter, minnieMouseBusyGogetter, ally], deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    for (const id of game.getCardInstanceIdsInZone("play", PLAYER_ONE))
      expect(game.getKeywordValue(id, "Resist")).toBe(
        id === game.findCardInstanceId(ally, "play", PLAYER_ONE) ? null : 2,
      );
  });
  it("normal play costs two, cannot ink Minnie, and quests for two after drying", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [minnieMouseBusyGogetter], inkwell: 2, deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().ink(minnieMouseBusyGogetter)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(minnieMouseBusyGogetter)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().quest(minnieMouseBusyGogetter)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(minnieMouseBusyGogetter)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });
});
it("stacks an additional Resist grant with Great Find", () => {
  const grant = createMockAction({
    id: "minnie-extra-resist",
    name: "Extra Resist",
    cost: 1,
    abilities: [
      {
        type: "action",
        effect: {
          type: "gain-keyword",
          keyword: "Resist",
          value: 1,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
    ],
  });
  const hit = damage(4);
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [minnieMouseBusyGogetter], deck: 6 },
    { hand: [grant, hit], inkwell: 2, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().playCard(grant, { targets: [minnieMouseBusyGogetter] }),
  ).toBeSuccessfulCommand();
  expect(game.getKeywordValue(minnieMouseBusyGogetter, "Resist")).toBe(3);
  expect(
    game.asPlayerTwo().playCard(hit, { targets: [minnieMouseBusyGogetter] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: minnieMouseBusyGogetter, value: 1 });
  expect(game.asPlayerOne().getCardZone(minnieMouseBusyGogetter)).toBe("play");
});
it("moved damage bypasses Resist and can banish Minnie", () => {
  const source = attacker(1);
  const move = createMockAction({
    id: "minnie-move-damage",
    name: "Move Damage",
    cost: 1,
    abilities: [
      {
        type: "action",
        effect: {
          type: "move-damage",
          amount: 2,
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    ],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [minnieMouseBusyGogetter], deck: 6 },
    { play: [{ card: source, damage: 2 }], hand: [move], inkwell: 1, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.getKeywordValue(minnieMouseBusyGogetter, "Resist")).toBe(2);
  expect(
    game.asPlayerTwo().playCard(move, { targets: [source, minnieMouseBusyGogetter] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveDamage({ card: source, value: 0 });
  expect(game.asPlayerOne().getCardZone(minnieMouseBusyGogetter)).toBe("discard");
});

it("player two's Minnie reduces opponent damage but takes full damage on their own turn", () => {
  const hit = damage(2);
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [hit], inkwell: 1, deck: 6 },
    { play: [minnieMouseBusyGogetter], hand: [hit], inkwell: 1, deck: 6 },
  );
  const minnie = game.findCardInstanceId(minnieMouseBusyGogetter, "play", PLAYER_TWO);
  expect(game.getKeywordValue(minnie, "Resist")).toBe(2);
  const first = game.findCardInstanceId(hit, "hand", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(first, { targets: [minnie] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveDamage({ card: minnie, value: 0 });
  const publicLog = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(publicLog).toContain("lorcana.outcome.damagePrevented");
  expect(publicLog).toContain(minnie);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.getKeywordValue(minnie, "Resist")).toBeNull();
  const second = game.findCardInstanceId(hit, "hand", PLAYER_TWO);
  expect(game.asPlayerTwo().playCard(second, { targets: [minnie] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(minnie)).toBe("discard");
});

for (const owner of [PLAYER_ONE, PLAYER_TWO, "player_three"]) {
  it(`both exact Minnies have Resist only on opponents' turns with controller ${owner}`, () => {
    const hit = damage(2);
    const fixture = (seat: string) => ({
      play: seat === owner ? [minnieMouseBusyGogetter, minnieMouseBusyGogetter, attacker(1)] : [],
      hand: [hit, hit],
      inkwell: 2,
      deck: 8,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      fixture(PLAYER_ONE),
      fixture(PLAYER_TWO),
      { additionalPlayers: { player_three: fixture("player_three") } },
    );
    const copies = game.getCardInstanceIdsInZone("play", owner).slice(0, 2);
    const ally = game.getCardInstanceIdsInZone("play", owner)[2]!;
    for (const active of [PLAYER_ONE, PLAYER_TWO, "player_three"]) {
      for (const id of copies)
        expect(game.getKeywordValue(id, "Resist")).toBe(active === owner ? null : 2);
      expect(game.getKeywordValue(ally, "Resist")).toBeNull();
      if (active !== owner) {
        for (const id of copies) {
          const action = game.findCardInstanceId(hit, "hand", active)!;
          expect(
            game.asLorcanaPlayer(active).playCard(action, { targets: [id] }),
          ).toBeSuccessfulCommand();
          expect(game.asLorcanaPlayer(owner).getDamage(id)).toBe(0);
          expect(game.asLorcanaPlayer(owner).getCardZone(id)).toBe("play");
        }
      }
      expect(game.asLorcanaPlayer(active).passTurn()).toBeSuccessfulCommand();
    }
    for (const id of copies)
      expect(game.getKeywordValue(id, "Resist")).toBe(owner === PLAYER_ONE ? null : 2);
  });
}
