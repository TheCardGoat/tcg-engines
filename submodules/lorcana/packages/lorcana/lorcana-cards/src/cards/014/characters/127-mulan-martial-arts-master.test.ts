// CR 6.1.13.4 / 6.2.7.1: temporary grants last this turn and create independent triggers.
// CR 4.4 / 4.5 / 8.9.1 / 8.15.1: quest, character challenges, Rush and Ward limits.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockLocation,
  createMockItem,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { distract } from "../../003/actions/159-distract";
import { minnieMouseBusyGogetter } from "./092-minnie-mouse-busy-go-getter";
import { mulanMartialArtsMaster as mulan } from "./127-mulan-martial-arts-master";

const ally = createMockCharacter({
  id: "mulan-master-ally",
  name: "Ally",
  cost: 2,
  strength: 2,
  willpower: 9,
});
const enemy = createMockCharacter({
  id: "mulan-master-enemy",
  name: "Enemy",
  cost: 2,
  strength: 1,
  willpower: 12,
});
const fatal = createMockCharacter({
  id: "mulan-master-fatal",
  name: "Fatal",
  cost: 2,
  strength: 9,
  willpower: 12,
});
const ward = createMockCharacter({
  id: "mulan-master-ward",
  name: "Ward",
  cost: 1,
  strength: 1,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const location = createMockLocation({
  id: "mulan-master-place",
  name: "Place",
  cost: 1,
  willpower: 12,
  lore: 0,
});
const item = createMockItem({ id: "mulan-master-item", name: "Item", cost: 1 });
const ready = createMockAction({
  id: "mulan-master-ready",
  name: "Ready",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
});
const remove = createMockAction({
  id: "mulan-master-remove",
  name: "Remove",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
});
const returnCard = createMockAction({
  id: "mulan-master-return",
  name: "Return",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
});
const filler = createMockCharacter({
  id: "mulan-master-deck-filler",
  name: "Deck Filler",
  cost: 1,
});
const deck = [filler, filler, filler, filler, filler, filler];

describe("Mulan - Martial Arts Master", () => {
  // CR 7.1.6: replaying the target creates a new object and clears all three temporary grants.
  it("player two replay clears Strength, draw and Rush; a new Rush grant does not restore the old draw", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: enemy, exerted: true }], deck },
      { play: [mulan, ally], hand: [mulan, returnCard, ready], inkwell: 6, deck },
    );
    const oldMulan = g.findCardInstanceId(mulan, "play", PLAYER_TWO);
    const newMulan = g.findCardInstanceId(mulan, "hand", PLAYER_TWO);
    const target = g.findCardInstanceId(ally, "play", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(newMulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(newMulan, { targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(oldMulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(oldMulan, { targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(target)).toBe(4);
    expect(g.asPlayerTwo()).toHaveKeyword({ card: target, keyword: "Rush" });
    expect(g.asPlayerTwo().playCard(returnCard, { targets: [target] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(target)).toBe("hand");
    expect(g.asPlayerTwo().playCard(target)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(target)).toBe(2);
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: target, keyword: "Rush" });
    expect(g.asPlayerTwo().isDrying(target)).toBe(true);
    expect(g.asPlayerTwo().challenge(target, enemy)).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(ready, { targets: [oldMulan] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(oldMulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(oldMulan, { targets: [target] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(oldMulan, { targets: [target] }),
    ).toBeSuccessfulCommand();
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    const opposingBefore = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerTwo()).toHaveKeyword({ card: target, keyword: "Rush" });
    expect(g.asPlayerTwo().challenge(target, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(enemy)).toBe(2);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(before);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opposingBefore);
    expect(g.getLore(PLAYER_TWO)).toBe(4);
  });
  it("player two owns the entry choice and the granted attacker draws only for player two", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: enemy, exerted: true }], deck },
      { hand: [mulan], play: [ally], inkwell: 4, deck },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(ally)).toBe(4);
    expect(g.asPlayerTwo().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(enemy)).toBe(4);
    expect(g.asPlayerTwo().getZonesCardCount().deck).toBe(4);
    expect(g.asPlayerTwo().getZonesCardCount().hand).toBe(2);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });
  it("player two owns the quest choice and Rush permits a fresh ally challenge but no quest", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: enemy, exerted: true }], deck },
      { play: [mulan], hand: [ally], inkwell: 2, deck },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(ally)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(ally, enemy)).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(mulan)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(2);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toHaveKeyword({ card: ally, keyword: "Rush" });
    expect(g.asPlayerTwo().quest(ally)).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(enemy)).toBe(2);
    expect(g.asPlayerTwo().getZonesCardCount().deck).toBe(5);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(6);
  });

  it("grants exact Strength and draws the top card on a character challenge", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan], play: [ally], inkwell: 4, deck: [ward, item] },
      { play: [{ card: enemy, exerted: true }], deck },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(ally)).toBe(4);
    expect(g.asPlayerOne().getCardStrength(mulan)).toBe(2);
    expect(g.asPlayerOne().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(enemy)).toBe(4);
    expect(g.asPlayerOne().getDamage(ally)).toBe(1);
    expect(g.asPlayerOne().getCardZone(item)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(ward)).toBe("deck");
    expect(g.asPlayerTwo().getZonesCardCount().hand).toBe(0);
  });
  it("does not draw for challenging a location", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan], play: [ally], inkwell: 4, deck },
      { play: [location] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ally, location)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(location)).toBe(4);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(6);
  });
  it("does not draw for another attacker", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan], play: [ally, ward], inkwell: 4, deck },
      { play: [{ card: enemy, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ward, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });
  it("does not draw when the chosen opposing character is a defender", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan], play: [ally], inkwell: 4, deck },
      { play: [{ card: enemy, exerted: true }], deck },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [enemy] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(enemy)).toBe(3);
    expect(g.asPlayerOne().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ally)).toBe(3);
    expect(g.asPlayerTwo().getZonesCardCount().hand).toBe(0);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });
  it("allows self but grants neither Rush nor permission to quest while drying", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan], inkwell: 4, deck },
      { play: [{ card: enemy, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [mulan] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(mulan)).toBe(4);
    expect(g.asPlayerOne().challenge(mulan, enemy).success).toBe(false);
    expect(g.asPlayerOne().quest(mulan).success).toBe(false);
  });
  it("allows own Ward for both grants", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mulan],
      play: [ward],
      inkwell: 4,
      deck,
    });
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ward] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(ward)).toBe(3);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ward] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveKeyword({ card: ward, keyword: "Rush" });
  });
  it("rejects opposing Ward, item, location, hidden and multiple entry targets with retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan, enemy], play: [ally, item, location], discard: [fatal], inkwell: 4, deck },
      { play: [ward] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    for (const targets of [[ward], [item], [location], [enemy], [fatal], [ally, mulan]]) {
      expect(g.asPlayerOne().resolvePendingByCard(mulan, { targets }).success).toBe(false);
      expect(g.asPlayerOne().getCardStrength(ally)).toBe(2);
    }
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(ally)).toBe(4);
  });
  it("draws for each repeated challenge in the same turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan, ready], play: [ally], inkwell: 4, deck },
      { play: [{ card: enemy, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(g.asPlayerOne().playCard(ready, { targets: [ally] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(enemy)).toBe(8);
    expect(g.asPlayerOne().getDamage(ally)).toBe(2);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(4);
  });
  it("stacks independent grants from two Mulan copies", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan, mulan], play: [ally], inkwell: 8, deck },
      { play: [{ card: enemy, exerted: true }] },
    );
    const ids = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    for (const id of ids) {
      expect(g.asPlayerOne().playCard(id)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().resolvePendingByCard(id, { targets: [ally] })).toBeSuccessfulCommand();
    }
    expect(g.asPlayerOne().getCardStrength(ally)).toBe(6);
    const grants = g
      .asPlayerOne()
      .getBoard()
      .activeEffects.filter((effect) => effect.type === "temporary-ability");
    expect(grants).toHaveLength(2);
    expect(new Set(grants.map((effect) => effect.sourceId)).size).toBe(2);
    expect(g.asPlayerOne().challenge(ally, enemy)).toBeSuccessfulCommand();
    const bag = g.asPlayerOne().getBagEffects();
    expect(bag).toHaveLength(2);
    for (const entry of bag) {
      expect(entry.payload).toEqual(
        expect.objectContaining({
          abilityName: "Whenever this character challenges another character, draw a card.",
        }),
      );
    }
    expect(g.asPlayerOne().resolveBag(bag[0]!.id, {})).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(enemy)).toBe(6);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(4);
  });
  it("retains the grant after Mulan leaves play", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan, remove], play: [ally], inkwell: 4, deck },
      { play: [{ card: enemy, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(remove, { targets: [mulan] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(mulan)).toBe("discard");
    expect(g.asPlayerOne().getCardStrength(ally)).toBe(4);
    expect(g.asPlayerOne().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(5);
    expect(g.asPlayerOne().getDamage(enemy)).toBe(4);
    expect(g.asPlayerOne().getDamage(ally)).toBe(1);
  });
  it("does not carry the grant across the target leaving play and being replayed", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan, returnCard], play: [ally], inkwell: 6, deck },
      { play: [{ card: enemy, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(returnCard, { targets: [ally] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(ally)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(ally)).toBe(2);
  });
  it("draws before combat even when the attacker will be banished", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan], play: [ally], inkwell: 4, deck: [item] },
      { play: [{ card: fatal, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ally, fatal)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(item)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(ally)).toBe("discard");
    expect(g.asPlayerOne().getDamage(fatal)).toBe(4);
  });
  it("expires both Strength and challenge draw before the next turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan], play: [ally], inkwell: 4, deck },
      { play: [enemy], deck },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(ally)).toBe(2);
    expect(g.asPlayerTwo().quest(enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    const hand = g.asPlayerOne().getZonesCardCount().hand;
    expect(g.asPlayerOne().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(enemy)).toBe(2);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(hand);
  });
  it("quest grants Rush to a fresh character without allowing it to quest", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [mulan], hand: [ally], inkwell: 2, deck },
      { play: [{ card: enemy, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(ally)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ally, enemy).success).toBe(false);
    expect(g.asPlayerOne().quest(mulan)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveKeyword({ card: ally, keyword: "Rush" });
    expect(g.asPlayerOne().quest(ally).success).toBe(false);
    expect(g.asPlayerOne().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(enemy)).toBe(2);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });
  it("can grant Rush to self without readying Mulan", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ play: [mulan], deck });
    expect(g.asPlayerOne().quest(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [mulan] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveKeyword({ card: mulan, keyword: "Rush" });
    expect(g.asPlayerOne().isExerted(mulan)).toBe(true);
    expect(g.asPlayerOne().quest(mulan).success).toBe(false);
  });
  it("allows an opposing character to receive Rush and expires it this turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [mulan], deck },
      { play: [enemy], deck },
    );
    expect(g.asPlayerOne().quest(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [enemy] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toHaveKeyword({ card: enemy, keyword: "Rush" });
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: enemy, keyword: "Rush" });
  });
  it("rejects illegal Rush targets and allows a valid retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [mulan, ally, item, location], hand: [enemy], discard: [fatal], deck },
      { play: [ward] },
    );
    expect(g.asPlayerOne().quest(mulan)).toBeSuccessfulCommand();
    for (const targets of [[ward], [item], [location], [enemy], [fatal], [ally, mulan]])
      expect(g.asPlayerOne().resolvePendingByCard(mulan, { targets }).success).toBe(false);
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveKeyword({ card: ally, keyword: "Rush" });
  });
  it("gives separate Rush choices for repeated quests after readying", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mulan, ally, ward],
      hand: [ready],
      deck,
    });
    expect(g.asPlayerOne().quest(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(ready, { targets: [mulan] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ward] }),
    ).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(4);
    expect(g.asPlayerOne()).toHaveKeyword({ card: ally, keyword: "Rush" });
    expect(g.asPlayerOne()).toHaveKeyword({ card: ward, keyword: "Rush" });
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: ally, keyword: "Rush" });
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: ward, keyword: "Rush" });
  });
  it("rejects insufficient payment without entering play or creating a grant", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mulan],
      play: [ally],
      inkwell: 3,
      deck,
    });
    expect(g.asPlayerOne().playCard(mulan).success).toBe(false);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(g.asPlayerOne().getCardZone(mulan)).toBe("hand");
    expect(g.asPlayerOne().getCardStrength(ally)).toBe(2);
    expect(g.asPlayerOne().getBagEffects()).toHaveLength(0);
  });
  it("can pay four using three bank ink and a saved drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mulan],
      inkwell: 3,
      inkDrops: 1,
      deck,
    });
    expect(g.asPlayerOne().playCard(mulan, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [mulan] }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardZone(mulan)).toBe("play");
  });
  it("is inkable and does not create an entry grant when inked", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [mulan], play: [ally], deck });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, mulan)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(mulan)).toBe("inkwell");
    expect(g.asPlayerOne().getCardStrength(ally)).toBe(2);
    expect(g.asPlayerOne().getBagEffects()).toHaveLength(0);
  });
});

describe("Mulan challenge-draw boundaries", () => {
  it("draws after Distract lowers its attacker into Minnie Resist prevention", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan, distract], play: [ally], inkwell: 6, deck },
      { play: [{ card: minnieMouseBusyGogetter, exerted: true }], deck },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(distract, { targets: [ally] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(ally)).toBe(2);
    expect(g.asPlayerOne().challenge(ally, minnieMouseBusyGogetter)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(minnieMouseBusyGogetter)).toBe(0);
    expect(g.asPlayerTwo().getCardZone(minnieMouseBusyGogetter)).toBe("play");
    expect(g.asPlayerOne().getDamage(ally)).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(4);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });
  it("draws on declaring a character challenge even when Resist prevents all damage", () => {
    const protectedDefender = createMockCharacter({
      id: "mulan-master-resist",
      name: "Protected",
      cost: 1,
      strength: 0,
      willpower: 9,
      abilities: [{ type: "keyword", keyword: "Resist", value: 4 }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan], play: [ally], inkwell: 4, deck: [item] },
      { play: [{ card: protectedDefender, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ally, protectedDefender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(item)).toBe("hand");
    expect(g.asPlayerOne().getDamage(protectedDefender)).toBe(0);
    expect(g.asPlayerOne().getDamage(ally)).toBe(0);
  });
  it("does not draw when the granted character quests", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mulan],
      play: [ally],
      inkwell: 4,
      deck,
    });
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(ally)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(6);
  });
  it("draws nothing from an empty deck; combat resolves and loss occurs at turn end", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mulan], play: [ally], inkwell: 4, deck: [] },
      { play: [{ card: enemy, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(mulan)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(mulan, { targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBeUndefined();
    expect(g.asPlayerOne().challenge(ally, enemy)).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBeUndefined();
    expect(g.asPlayerOne().getDamage(enemy)).toBe(4);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBe(PLAYER_TWO);
  });
});
