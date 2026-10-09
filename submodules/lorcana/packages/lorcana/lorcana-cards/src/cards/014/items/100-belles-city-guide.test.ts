// Belle's City Guide: Insider Info {E} — If you played an action this turn, gain 1 lore.
// CR 2.2.0: 4.4, 5.5.4, 6.3.1–6.3.1.2; item abilities work on the play turn.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockItem,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { bellesCityGuide } from "./100-belles-city-guide";

const action = createMockAction({ id: "guide-action", name: "Action", cost: 1 });
const song = createMockSong({ id: "guide-song", name: "Song", cost: 1, text: "A song." });
const character = createMockCharacter({
  id: "guide-character",
  name: "Character",
  cost: 1,
  lore: 1,
});
const item = createMockItem({ id: "guide-item", name: "Item", cost: 1 });
const activate = (
  game: LorcanaMultiplayerTestEngine,
  card: typeof bellesCityGuide | string = bellesCityGuide,
) => game.asPlayerOne().activateAbility(card, { ability: "Insider Info" });

describe("Belle's City Guide", () => {
  it("player two uses sung and multiple actions with independent guides, saved drops and reset", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [bellesCityGuide], deck: 8, lore: 7, inkDrops: 7 },
      {
        hand: [song, action, bellesCityGuide],
        play: [bellesCityGuide, bellesCityGuide, character],
        discard: [bellesCityGuide],
        inkDrops: 4,
        deck: 8,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const p2 = game.asPlayerTwo();
    const guides = game
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .filter((id) => p2.getCardDefinitionByInstanceId(id).id === bellesCityGuide.id);
    const first = guides[0]!;
    const second = guides[1]!;
    const singer = game.findCardInstanceId(character, "play", PLAYER_TWO)!;
    const handGuide = game.findCardInstanceId(bellesCityGuide, "hand", PLAYER_TWO)!;
    const opposing = game.findCardInstanceId(bellesCityGuide, "play", PLAYER_ONE)!;
    const discarded = game.findCardInstanceId(bellesCityGuide, "discard", PLAYER_TWO)!;
    expect(p2.playCard(song, { cost: { cost: "sing", singer } })).toBeSuccessfulCommand();
    expect(p2.isExerted(singer)).toBe(true);
    for (const source of [handGuide, opposing, discarded]) {
      expect(p2.activateAbility(source, { ability: "Insider Info" })).not.toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_TWO)).toBe(0);
      expect(p2.isExerted(first)).toBe(false);
      expect(p2.isExerted(second)).toBe(false);
      expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
    }
    expect(p2.activateAbility(first, { ability: "Insider Info" })).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(1);
    expect(p2.isExerted(second)).toBe(false);
    expect(p2.activateAbility(first, { ability: "Insider Info" })).not.toBeSuccessfulCommand();
    expect(p2.playCard(action, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
    expect(p2.activateAbility(second, { ability: "Insider Info" })).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(2);
    expect(p2.playCard(handGuide, { inkDrops: 2 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(p2.activateAbility(handGuide, { ability: "Insider Info" })).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(3);
    expect(p2.getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.getLore(PLAYER_ONE)).toBe(7);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(7);
    expect(game.asPlayerOne().isExerted(opposing)).toBe(false);
    expect(p2.passTurn()).toBeSuccessfulCommand();
    expect(p2.activateAbility(first, { ability: "Insider Info" })).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(p2.isExerted(first)).toBe(false);
    expect(p2.activateAbility(first, { ability: "Insider Info" })).toBeSuccessfulCommand();
    expect(p2.isExerted(first)).toBe(true);
    expect(p2.isExerted(second)).toBe(false);
    expect(game.getLore(PLAYER_TWO)).toBe(3);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(p2.getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("player two counts their own action and wins without adding lore to the opponent", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [bellesCityGuide], deck: 6, lore: 7 },
      { hand: [action], play: [bellesCityGuide], inkwell: 1, deck: 6, lore: 19, inkDrops: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const guide = game.findCardInstanceId(bellesCityGuide, "play", PLAYER_TWO);
    const enemyGuide = game.findCardInstanceId(bellesCityGuide, "play", PLAYER_ONE);
    expect(game.asPlayerTwo().playCard(action)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().activateAbility(enemyGuide, { ability: "Insider Info" }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().activateAbility(guide, { ability: "Insider Info" }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(guide)).toBe(true);
    expect(game.asPlayerOne().isExerted(enemyGuide)).toBe(false);
    expect(game.getLore(PLAYER_TWO)).toBe(20);
    expect(game.getLore(PLAYER_ONE)).toBe(7);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
    expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
  });
  it("gains exactly one lore, exerts, and spends no ink or drops after an action", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [action], inkwell: 2, inkDrops: 3, play: [bellesCityGuide], deck: 6, lore: 5 },
      { deck: 6, lore: 7 },
    );
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(action)).toBe("discard");
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(bellesCityGuide)).toBe(true);
    expect(game.getLore(PLAYER_ONE)).toBe(6);
    expect(game.getLore(PLAYER_TWO)).toBe(7);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(activate(game)).not.toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(6);
  });

  it("can exert without an action, but gains no lore and cannot activate again after a later action", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action],
      inkwell: 1,
      play: [bellesCityGuide],
      deck: 6,
    });
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(bellesCityGuide)).toBe(true);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(activate(game)).not.toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(0);
  });

  it("readies next own turn and forgets the previous turn's action", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [action], inkwell: 1, play: [bellesCityGuide], deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(bellesCityGuide)).toBe(false);
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(bellesCityGuide)).toBe(true);
    expect(game.getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not count played items, characters, inking, or quests as actions", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [item, character, action],
      inkwell: 2,
      deck: 6,
      play: [bellesCityGuide, character],
    });
    const quester = game.findCardInstanceId(character, "play", PLAYER_ONE);
    expect(game.asPlayerOne().playCard(item)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().playCard(game.findCardInstanceId(character, "hand", PLAYER_ONE)),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().ink(action)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().isExerted(bellesCityGuide)).toBe(true);
  });

  it("does not count an action rejected for insufficient ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action],
      play: [bellesCityGuide],
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(action)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(action)).toBe("hand");
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(0);
  });

  it("counts a sung song at zero bank ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      play: [bellesCityGuide, character],
      deck: 6,
    });
    const singer = game.findCardInstanceId(character, "play", PLAYER_ONE);
    expect(
      game.asPlayerOne().playCard(song, { cost: { cost: "sing", singer } }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(character)).toBe(true);
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("gains only one lore after two actions", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action, song],
      inkwell: 2,
      play: [bellesCityGuide],
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
  });

  it("each copy uses the same action history and exerts independently", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action],
      inkwell: 1,
      play: [bellesCityGuide, bellesCityGuide],
      deck: 6,
    });
    const copies = game.getCardInstanceIdsInZone("play", PLAYER_ONE);
    const first = copies[0]!;
    const second = copies[1]!;
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(activate(game, first)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(first)).toBe(true);
    expect(game.asPlayerOne().isExerted(second)).toBe(false);
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(activate(game, second)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(second)).toBe(true);
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });

  it("does not count the opponent's action and rejects activation on the opponent's turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [bellesCityGuide], deck: 6 },
      { hand: [action], inkwell: 1, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(action)).toBeSuccessfulCommand();
    expect(activate(game)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(bellesCityGuide)).toBe(false);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(0);
  });

  it("can be played after the action and activate immediately for no extra ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action, bellesCityGuide],
      inkwell: 3,
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(bellesCityGuide)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().isExerted(bellesCityGuide)).toBe(true);
  });

  it("rejects opposing, hand, and discarded sources without paying or gaining lore", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [bellesCityGuide], discard: [bellesCityGuide], deck: 6 },
      { play: [bellesCityGuide], deck: 6 },
    );
    for (const id of [
      game.findCardInstanceId(bellesCityGuide, "hand", PLAYER_ONE),
      game.findCardInstanceId(bellesCityGuide, "discard", PLAYER_ONE),
      game.findCardInstanceId(bellesCityGuide, "play", PLAYER_TWO),
    ]) {
      expect(activate(game, id)).not.toBeSuccessfulCommand();
    }
    expect(
      game.asPlayerTwo().isExerted(game.findCardInstanceId(bellesCityGuide, "play", PLAYER_TWO)),
    ).toBe(false);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.getLore(PLAYER_TWO)).toBe(0);
  });

  it("requires two ink to play, accepts saved drops, and is not inkable", () => {
    for (const drops of [0, 1]) {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [bellesCityGuide],
        inkwell: 1,
        inkDrops: drops,
        deck: 6,
      });
      expect(game.asPlayerOne().ink(bellesCityGuide)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().playCard(bellesCityGuide)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(bellesCityGuide)).toBe("hand");
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(game.getInkDrops(PLAYER_ONE)).toBe(drops);
      if (drops === 1) {
        expect(
          game.asPlayerOne().playCard(bellesCityGuide, { inkDrops: 1 }),
        ).toBeSuccessfulCommand();
        expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
        expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
      }
    }
  });

  it("wins when the conditional lore reaches twenty", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [action], inkwell: 1, play: [bellesCityGuide], deck: 6, lore: 19 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(activate(game)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(20);
    expect(game.asServer().getWinner()).toBe(PLAYER_ONE);
  });
});
