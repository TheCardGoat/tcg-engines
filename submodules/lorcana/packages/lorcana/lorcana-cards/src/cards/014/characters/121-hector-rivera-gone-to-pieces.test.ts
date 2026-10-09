// CR 2.2.0: 6.4.1 (continuous static), 8.6.1 (Evasive), 8.11.1–8.11.2 (Singer).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { hctorRiveraGoneToPieces as base } from "./121-hector-rivera-gone-to-pieces";
import { hctorRiveraGoneToPiecesD23 as promo } from "./d23-013-hector-rivera-gone-to-pieces";
const song = (cost: number) =>
  createMockSong({
    id: "pieces-song-" + cost,
    name: "Song " + cost,
    cost,
    text: "Gain 2 lore.",
    abilities: [{ type: "action", effect: { type: "gain-lore", amount: 2, target: "CONTROLLER" } }],
  });
const six = song(6),
  seven = song(7);
const plain = createMockAction({ id: "pieces-plain", name: "Plain Action", cost: 0 });
const recover = (id: string) =>
  createMockAction({
    id,
    name: id,
    cost: 0,
    abilities: [
      {
        type: "action",
        effect: { type: "return-from-discard", cardType: "action", target: "CONTROLLER" },
      },
    ],
  });
const attacker = createMockCharacter({
  id: "pieces-attacker",
  name: "Attacker",
  cost: 2,
  strength: 2,
  willpower: 7,
});
const evasive = createMockCharacter({
  id: "pieces-evasive",
  name: "Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 7,
  abilities: [{ type: "keyword", keyword: "Evasive" }],
});
for (const hector of [base, promo])
  describe("Hector Gone to Pieces " + hector.id, () => {
    it.each([1, 2, 3, 4, 5, 6])(
      "Singer 6 resolves cost %s at zero ink and activates both bonuses",
      (cost: number) => {
        const chosen = song(cost);
        const game = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [hector],
          hand: [chosen],
        });
        expect(game.asPlayerOne().singSong(chosen, hector)).toBeSuccessfulCommand();
        expect(game.asPlayerOne().getCardZone(chosen)).toBe("discard");
        expect(game.asPlayerOne().isExerted(hector)).toBe(true);
        expect(game.getLore(PLAYER_ONE)).toBe(2);
        expect(game.asPlayerOne().getCardLore(hector)).toBe(2);
        expect(game.asPlayerOne().hasKeyword(hector, "Evasive")).toBe(true);
      },
    );
    it("rejects seven despite bank ink then sings six without ink payment", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hector],
        hand: [six, seven],
        inkwell: 7,
      });
      expect(game.asPlayerOne().singSong(seven, hector)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(seven)).toBe("hand");
      expect(game.asPlayerOne().isExerted(hector)).toBe(false);
      expect(game.asPlayerOne().singSong(six, hector)).toBeSuccessfulCommand();
      expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(7);
    });
    it.each([{ isDrying: true }, { exerted: true }])(
      "rejects unavailable singer %j",
      (state: { isDrying?: boolean; exerted?: boolean }) => {
        const game = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [{ card: hector, ...state }],
          hand: [six],
        });
        expect(game.asPlayerOne().singSong(six, hector)).not.toBeSuccessfulCommand();
        expect(game.asPlayerOne().getCardZone(six)).toBe("hand");
      },
    );
    it("cannot sing with opposing Hector", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [six] },
        { play: [hector] },
      );
      expect(
        game.asPlayerOne().singSong(six, game.findCardInstanceId(hector, "play", PLAYER_TWO)),
      ).not.toBeSuccessfulCommand();
    });
    it.each([{ discard: [] }, { discard: [plain] }])(
      "quests one and lacks Evasive with non-song discard %j",
      ({ discard }: { discard: readonly (typeof plain)[] }) => {
        const game = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [hector],
          discard: [...discard],
        });
        expect(game.asPlayerOne().hasKeyword(hector, "Evasive")).toBe(false);
        expect(game.asPlayerOne().quest(hector)).toBeSuccessfulCommand();
        expect(game.getLore(PLAYER_ONE)).toBe(1);
      },
    );
    it("own songs in hand/deck and opposing discarded songs do not count", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [hector], hand: [six], deck: [seven] },
        { discard: [six] },
      );
      expect(game.asPlayerOne().hasKeyword(hector, "Evasive")).toBe(false);
      expect(game.asPlayerOne().quest(hector)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(1);
    });
    it("several own songs grant only one lore and one Evasive", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hector],
        discard: [six, seven],
      });
      expect(game.asPlayerOne().hasKeyword(hector, "Evasive")).toBe(true);
      expect(game.asPlayerOne().quest(hector)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(2);
    });
    it("song entry enables both; removing one of two preserves them and the last ends both", () => {
      const free = song(0),
        first = recover("pieces-recover-one"),
        second = recover("pieces-recover-two");
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hector],
        hand: [free, first, second],
        discard: [six],
      });
      expect(game.asPlayerOne().playCard(free)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardLore(hector)).toBe(2);
      expect(game.asPlayerOne().hasKeyword(hector, "Evasive")).toBe(true);
      expect(game.asPlayerOne().playCard(first, { targets: [six] })).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardLore(hector)).toBe(2);
      expect(game.asPlayerOne().hasKeyword(hector, "Evasive")).toBe(true);
      expect(game.asPlayerOne().playCard(second, { targets: [free] })).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardLore(hector)).toBe(1);
      expect(game.asPlayerOne().hasKeyword(hector, "Evasive")).toBe(false);
      expect(game.asPlayerOne().quest(hector)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(3);
    });
    it("Evasive rejects plain attacker but permits opposing Evasive", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: hector, exerted: true }], discard: [six], deck: 6 },
        { play: [attacker, evasive], deck: 6 },
      );
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().challenge(attacker, hector)).not.toBeSuccessfulCommand();
      expect(game.asPlayerTwo().challenge(evasive, hector)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getDamage(hector)).toBe(2);
      expect(game.asPlayerTwo().getDamage(evasive)).toBe(5);
    });
    it("without own song a plain attacker can challenge", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: hector, exerted: true }], deck: 6 },
        { play: [attacker], discard: [six], deck: 6 },
      );
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().challenge(attacker, hector)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getDamage(hector)).toBe(2);
    });
    it("conditional Evasive lets Hector challenge Evasive for five damage", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [hector], discard: [six] },
        { play: [{ card: evasive, exerted: true }] },
      );
      expect(game.asPlayerOne().challenge(hector, evasive)).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().getDamage(evasive)).toBe(5);
    });
    it("without own song Hector cannot challenge Evasive", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [hector] },
        { play: [{ card: evasive, exerted: true }] },
      );
      expect(game.asPlayerOne().challenge(hector, evasive)).not.toBeSuccessfulCommand();
    });
    it("copies get own bonuses without boosting the opposing copy", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [hector, hector], discard: [six] },
        { play: [hector] },
      );
      for (const id of game.getCardInstanceIdsInZone("play", PLAYER_ONE))
        expect(game.asPlayerOne().quest(id)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(4);
      const enemy = game.findCardInstanceId(hector, "play", PLAYER_TWO);
      expect(game.asPlayerTwo().getCardLore(enemy)).toBe(1);
      expect(game.asPlayerTwo().hasKeyword(enemy, "Evasive")).toBe(false);
    });
    it("printed four-ink entry dries even with active Evasive; next own quest gains two", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [hector, six], discard: [seven], inkwell: 4, deck: 6 },
        { deck: 6 },
      );
      expect(game.asPlayerOne().playCard(hector)).toBeSuccessfulCommand();
      expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().hasKeyword(hector, "Evasive")).toBe(true);
      expect(game.asPlayerOne().quest(hector)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().singSong(six, hector)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerOne().quest(hector)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(2);
    });
    it("player two loses both bonuses when its last song leaves despite an opposing song", () => {
      const returnSong = recover("pieces-player-two-recover");
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [hector], discard: [seven], deck: 6, lore: 4 },
        { play: [hector], discard: [six], hand: [returnSong], deck: 6, lore: 7 },
      );
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const own = game.findCardInstanceId(hector, "play", PLAYER_TWO);
      const enemy = game.findCardInstanceId(hector, "play", PLAYER_ONE);
      expect(game.asPlayerTwo().getCardLore(own)).toBe(2);
      expect(game.asPlayerTwo().hasKeyword(own, "Evasive")).toBe(true);
      expect(game.asPlayerTwo().playCard(returnSong, { targets: [six] })).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().getCardZone(six)).toBe("hand");
      expect(game.asPlayerTwo().getCardLore(own)).toBe(1);
      expect(game.asPlayerTwo().hasKeyword(own, "Evasive")).toBe(false);
      expect(game.asPlayerOne().getCardLore(enemy)).toBe(2);
      expect(game.asPlayerOne().hasKeyword(enemy, "Evasive")).toBe(true);
      expect(game.asPlayerTwo().quest(own)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_TWO)).toBe(8);
      expect(game.getLore(PLAYER_ONE)).toBe(4);
      expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    });
    it("three ink cannot play; inking does not grant the bonuses", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [hector], inkwell: 3 });
      expect(game.asPlayerOne().playCard(hector)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().putIntoInkwell(PLAYER_ONE, hector)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(hector)).toBe("inkwell");
    });
  });

for (const hector of [base, promo]) {
  it(`Player Two exact ${hector.id} copies sing independently and retain only own first/last-song bonuses`, () => {
    const low = song(1),
      first = recover("pieces-p2-first"),
      last = recover("pieces-p2-last");
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [hector], discard: [six], deck: 6 },
      {
        play: [hector, hector, hector, hector],
        hand: [low, six, first, last],
        inkwell: 4,
        deck: 6,
      },
    );
    const copies = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const lowId = game.findCardInstanceId(low, "hand", PLAYER_TWO);
    const sixId = game.findCardInstanceId(six, "hand", PLAYER_TWO);
    const enemy = game.findCardInstanceId(hector, "play", PLAYER_ONE);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    for (const copy of copies) {
      expect(game.asPlayerTwo().getCardLore(copy)).toBe(1);
      expect(game.asPlayerTwo().hasKeyword(copy, "Evasive")).toBe(false);
    }
    expect(game.asPlayerTwo().singSong(lowId, copies[0])).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().singSong(sixId, copies[1])).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(4);
    expect(game.getLore(PLAYER_TWO)).toBe(4);
    for (const copy of copies) {
      expect(game.asPlayerTwo().getCardLore(copy)).toBe(2);
      expect(game.asPlayerTwo().hasKeyword(copy, "Evasive")).toBe(true);
    }
    expect(game.asPlayerTwo().quest(copies[2])).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(copies[3])).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(8);
    expect(game.asPlayerTwo().playCard(first, { targets: [lowId] })).toBeSuccessfulCommand();
    for (const copy of copies) {
      expect(game.asPlayerTwo().getCardLore(copy)).toBe(2);
      expect(game.asPlayerTwo().hasKeyword(copy, "Evasive")).toBe(true);
    }
    expect(game.asPlayerTwo().playCard(last, { targets: [sixId] })).toBeSuccessfulCommand();
    for (const copy of copies) {
      expect(game.asPlayerTwo().getCardLore(copy)).toBe(1);
      expect(game.asPlayerTwo().hasKeyword(copy, "Evasive")).toBe(false);
    }
    expect(game.asPlayerOne().getCardLore(enemy)).toBe(2);
    expect(game.asPlayerOne().hasKeyword(enemy, "Evasive")).toBe(true);
    expect(game.asServer().getCard(lowId).zone).toBe("hand");
    expect(game.asServer().getCard(sixId).zone).toBe("hand");
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    for (const copy of copies) expect(game.asPlayerTwo().quest(copy)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(12);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
  });
}
