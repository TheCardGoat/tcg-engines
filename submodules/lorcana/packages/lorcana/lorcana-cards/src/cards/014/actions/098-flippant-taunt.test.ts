// CR 3.1.2 and 8.7.1–8.7.4: Reckless prevents questing, requires a
// challenge only if able, permits other exert actions, and expires as printed.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockLocation,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { flippantTaunt } from "./098-flippant-taunt";
const target = createMockCharacter({
  id: "taunt-target",
  name: "target",
  cost: 4,
  strength: 4,
  willpower: 8,
  lore: 2,
});
const defender = createMockCharacter({
  id: "taunt-defender",
  name: "defender",
  cost: 2,
  strength: 1,
  willpower: 8,
});
const ward = createMockCharacter({
  id: "taunt-ward",
  name: "ward",
  cost: 1,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const native = createMockCharacter({
  id: "taunt-native",
  name: "native",
  cost: 1,
  abilities: [{ type: "keyword", keyword: "Reckless" }],
  willpower: 8,
});
const item = createMockItem({ id: "taunt-item", name: "Item", cost: 1 });
const location = createMockLocation({
  id: "taunt-location",
  name: "location",
  cost: 1,
  willpower: 8,
});
const song = createMockSong({ id: "taunt-song", name: "song", text: "", cost: 2, abilities: [] });
it("player two's grant survives player one's turn and expires when player two starts again", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6, play: [target], inkDrops: 3 },
    { hand: [flippantTaunt], deck: 6, inkDrops: 2 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().playCard(flippantTaunt, { targets: [target], inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerOne()).toHaveKeyword({ card: target, keyword: "Reckless" });
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveKeyword({ card: target, keyword: "Reckless" });
  expect(game.asPlayerOne().quest(target)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: target, keyword: "Reckless" });
});
describe("Flippant Taunt", () => {
  it("prevents questing and passing with a legal challenge; expires at caster's next turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [flippantTaunt],
        inkwell: 1,
        deck: 6,
        play: [{ card: defender, exerted: true, isDrying: false }],
      },
      { deck: 6, play: [{ card: target, isDrying: false }] },
    );
    expect(
      game.asPlayerOne().playCard(flippantTaunt, { targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toHaveKeyword({ card: target, keyword: "Reckless" });
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo()).toHaveKeyword({ card: target, keyword: "Reckless" });
    expect(game.asPlayerTwo().quest(target)).not.toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().passTurn()).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(target, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(defender)).toBe(4);
    expect(game.asPlayerTwo().getDamage(target)).toBe(1);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).not.toHaveKeyword({ card: target, keyword: "Reckless" });
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(target)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(2);
  });
  it("allows passing without a legal defender while still preventing questing", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [flippantTaunt], inkwell: 1, deck: 6 },
      { deck: 6, play: [target] },
    );
    expect(
      game.asPlayerOne().playCard(flippantTaunt, { targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(target)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).not.toHaveKeyword({ card: target, keyword: "Reckless" });
  });
  it("preserves printed Reckless after the grant expires", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [flippantTaunt], inkwell: 1, deck: 6 },
      { deck: 6, play: [native] },
    );
    expect(
      game.asPlayerOne().playCard(flippantTaunt, { targets: [native] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toHaveKeyword({ card: native, keyword: "Reckless" });
  });
  it("permits singing instead of challenging", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [flippantTaunt], inkwell: 1, deck: 6, play: [{ card: defender, exerted: true }] },
      { hand: [song], deck: 6, play: [target] },
    );
    expect(
      game.asPlayerOne().playCard(flippantTaunt, { targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().singSong(song, target)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(target)).toBe(true);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  });
  it("permits challenges against the caster's location with only one opponent", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [flippantTaunt], inkwell: 1, deck: 6, play: [location] },
      { deck: 6, play: [target] },
    );
    expect(
      game.asPlayerOne().playCard(flippantTaunt, { targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(target, location)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(location)).toBe(4);
  });
  it("rejects own, Ward, wrong type/zone and multiple targets before payment; allows retry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [flippantTaunt], inkwell: 1, play: [defender] },
      { hand: [native], play: [target, ward, item, location] },
    );
    for (const targets of [[defender], [ward], [item], [location], [native], [target, ward]]) {
      expect(game.asPlayerOne().playCard(flippantTaunt, { targets })).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(game.asPlayerOne().getCardZone(flippantTaunt)).toBe("hand");
      expect(game.asPlayerOne()).not.toHaveKeyword({ card: target, keyword: "Reckless" });
    }
    expect(
      game.asPlayerOne().playCard(flippantTaunt, { targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("rejects insufficient payment without granting Reckless", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [flippantTaunt] },
      { play: [target] },
    );
    expect(
      game.asPlayerOne().playCard(flippantTaunt, { targets: [target] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne()).not.toHaveKeyword({ card: target, keyword: "Reckless" });
    expect(game.asPlayerOne().getCardZone(flippantTaunt)).toBe("hand");
  });
  it("accepts a saved ink drop at zero bank ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [flippantTaunt], inkDrops: 2 },
      { play: [target] },
    );
    expect(
      game.asPlayerOne().playCard(flippantTaunt, { targets: [target], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne()).toHaveKeyword({ card: target, keyword: "Reckless" });
  });
  it("is inkable", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [flippantTaunt] });
    expect(game.asPlayerOne().ink(flippantTaunt)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(flippantTaunt)).toBe("inkwell");
  });
});
it("applies separate copies only to their chosen damaged/exerted characters", () => {
  const other = createMockCharacter({
    id: "other-taunt-target",
    name: "Other",
    cost: 2,
    willpower: 8,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [flippantTaunt, flippantTaunt], inkwell: 2, deck: 6 },
    { play: [{ card: target, damage: 2, exerted: true }, other], deck: 6 },
  );
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(copies[0]!, { targets: [target] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveKeyword({ card: target, keyword: "Reckless" });
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: other, keyword: "Reckless" });
  expect(game.asPlayerOne().playCard(copies[1]!, { targets: [other] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveKeyword({ card: other, keyword: "Reckless" });
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: target, keyword: "Reckless" });
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: other, keyword: "Reckless" });
});
it("resolves without a grant when there is no legal opposing character", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [flippantTaunt], inkwell: 1 },
    { play: [ward, location, item] },
  );
  expect(game.asPlayerOne().playCard(flippantTaunt)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(flippantTaunt)).toBe("discard");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: ward, keyword: "Reckless" });
});

for (const owner of [PLAYER_TWO, "player_three"]) {
  it(`three-player grants on ${owner} protect only the caster and preserve native Reckless`, () => {
    const cheapSong = createMockSong({
      id: `taunt-three-song-${owner}`,
      name: "Song",
      text: "",
      cost: 1,
      abilities: [],
    });
    const opposing = {
      play: [target, native, { card: defender, exerted: true }, location],
      hand: [cheapSong],
      deck: 8,
    };
    const other = { play: [{ card: defender, exerted: true }, location], deck: 8 };
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [flippantTaunt, flippantTaunt],
        play: [{ card: defender, exerted: true }, location],
        inkDrops: 2,
        deck: 8,
      },
      owner === PLAYER_TWO ? opposing : other,
      { additionalPlayers: { player_three: owner === "player_three" ? opposing : other } },
    );
    const first = game.findCardInstanceId(target, "play", owner)!;
    const second = game.findCardInstanceId(native, "play", owner)!;
    const casterDefender = game.findCardInstanceId(defender, "play", PLAYER_ONE)!;
    const casterLocation = game.findCardInstanceId(location, "play", PLAYER_ONE)!;
    const otherPlayer = owner === PLAYER_TWO ? "player_three" : PLAYER_TWO;
    const otherDefender = game.findCardInstanceId(defender, "play", otherPlayer)!;
    const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(
      game.asPlayerOne().playCard(copies[0]!, { targets: [first], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toHaveKeyword({ card: first, keyword: "Reckless" });
    expect(
      game.asPlayerOne().playCard(copies[1]!, { targets: [second], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    if (owner === "player_three") {
      expect(game.asPlayerTwo().quest(otherDefender)).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    }
    const client = game.asLorcanaPlayer(owner);
    expect(client.quest(first)).not.toBeSuccessfulCommand();
    expect(client.challenge(first, casterDefender)).not.toBeSuccessfulCommand();
    expect(client.challenge(first, casterLocation)).not.toBeSuccessfulCommand();
    expect(client.isExerted(first)).toBe(false);
    expect(client.getDamage(first)).toBe(0);
    expect(client.challenge(first, otherDefender)).toBeSuccessfulCommand();
    expect(client.getDamage(first)).toBe(1);
    expect(client.getDamage(otherDefender)).toBe(4);
    expect(
      client.singSong(game.findCardInstanceId(cheapSong, "hand", owner)!, second),
    ).toBeSuccessfulCommand();
    expect(client.isExerted(second)).toBe(true);
    expect(client.passTurn()).toBeSuccessfulCommand();
    if (owner === PLAYER_TWO)
      expect(game.asLorcanaPlayer("player_three").passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).not.toHaveKeyword({ card: first, keyword: "Reckless" });
    expect(game.asPlayerOne()).toHaveKeyword({ card: second, keyword: "Reckless" });
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });
}
