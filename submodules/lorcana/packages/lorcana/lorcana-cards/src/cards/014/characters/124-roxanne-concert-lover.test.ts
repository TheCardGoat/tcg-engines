// CR 2.2.0: 4.7.1–4 (movement/free cost), 6.1.6 (another), 6.1.13.4 (this turn), 6.7.2.4 (optional resolution).
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockLocation,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { roxanneConcertLover as roxanne } from "./124-roxanne-concert-lover";
const other = createMockCharacter({
  id: "roxanne-other",
  name: "Other",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 2,
});
const spare = createMockCharacter({ id: "roxanne-spare", name: "Spare", cost: 1, lore: 1 });
const location = createMockLocation({
  id: "roxanne-location",
  name: "Location",
  cost: 1,
  moveCost: 7,
  lore: 0,
});
const second = createMockLocation({
  id: "roxanne-second",
  name: "Second Location",
  cost: 1,
  moveCost: 4,
  lore: 0,
});
const item = createMockItem({ id: "roxanne-item", name: "Item", cost: 0 });
const ward = createMockCharacter({
  id: "roxanne-ward",
  name: "Ward",
  cost: 1,
  lore: 1,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const watcher = createMockCharacter({
  id: "roxanne-watcher",
  name: "Watcher",
  cost: 0,
  abilities: [
    {
      id: "watch-move",
      type: "triggered",
      trigger: { event: "move", on: "YOUR_CHARACTERS", timing: "whenever" },
      effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
    },
  ],
});
const accept = (game: LorcanaMultiplayerTestEngine, targets = [other, location]) =>
  game.asPlayerOne().resolvePendingByCard(roxanne, { resolveOptional: true, targets });

describe("Roxanne - Concert Lover", () => {
  it("moves both for free after spending exactly two and buffs only the other character", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne],
      play: [other, spare, location, second],
      inkwell: 2,
      inkDrops: 2,
    });
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    expect(accept(game)).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: roxanne, location });
    expect(game.asPlayerOne()).toBeAtLocation({ card: other, location });
    expect(game.asPlayerOne().getCardLore(other)).toBe(3);
    expect(game.asPlayerOne().getCardLore(roxanne)).toBe(1);
    expect(game.asPlayerOne().getCardLore(spare)).toBe(1);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().quest(other)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerOne().quest(roxanne)).not.toBeSuccessfulCommand();
  });
  it("declining preserves positions and lore", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne],
      play: [other, location, second],
      inkwell: 2,
    });
    expect(game.asPlayerOne().moveCharacterToLocation(other, second)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(roxanne, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLocationId(other)).toBeUndefined();
    expect(game.asPlayerOne().getCardLocationId(roxanne)).toBeUndefined();
    expect(game.asPlayerOne().getCardLore(other)).toBe(2);
    expect(game.asPlayerOne().getCardLore(roxanne)).toBe(1);
    expect(game.asPlayerOne().quest(other)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
  it.each([{ exerted: true }, { isDrying: true }])(
    "moving does not ready or dry the other character %j",
    (state: { exerted?: boolean; isDrying?: boolean }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [roxanne],
        play: [{ card: other, damage: 2, ...state }, location],
        inkwell: 2,
      });
      expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
      expect(accept(game)).toBeSuccessfulCommand();
      expect(game.asPlayerOne()).toBeAtLocation({ card: other, location });
      expect(game.asPlayerOne().getDamage(other)).toBe(2);
      expect(game.asPlayerOne().getCardLore(other)).toBe(3);
      expect(game.asPlayerOne().quest(other)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().isExerted(other)).toBe(state.exerted === true);
    },
  );
  it("selects the second of two own locations without changing damage or readiness", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne],
      play: [{ card: other, damage: 1 }, location, second],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    expect(accept(game, [other, second])).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: other, location: second });
    expect(game.asPlayerOne()).toBeAtLocation({ card: roxanne, location: second });
    expect(game.asPlayerOne().getDamage(other)).toBe(1);
    expect(game.asPlayerOne().isExerted(other)).toBe(false);
  });
  it("moves an already-located character to the new shared location", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne],
      play: [other, location, second],
      inkwell: 9,
    });
    expect(game.asPlayerOne().moveCharacterToLocation(other, location)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    expect(accept(game, [other, second])).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: other, location: second });
    expect(game.asPlayerOne()).toBeAtLocation({ card: roxanne, location: second });
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("an own Ward character is eligible", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne],
      play: [ward, location],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(roxanne, { resolveOptional: true, targets: [ward, location] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: ward, location });
    expect(game.asPlayerOne().getCardLore(ward)).toBe(2);
  });
  it("self, opposing characters and items are not the other own character", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [roxanne], play: [other, item, location], inkwell: 2 },
      { play: [spare] },
    );
    const enemy = game.findCardInstanceId(spare, "play", PLAYER_TWO);
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    for (const target of [roxanne, enemy, item])
      expect(
        game
          .asPlayerOne()
          .resolvePendingByCard(roxanne, { resolveOptional: true, targets: [target, location] }),
      ).not.toBeSuccessfulCommand();
    expect(accept(game)).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: other, location });
  });
  it("opposing or out-of-play locations cannot be destinations", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [roxanne, second], play: [other, location], inkwell: 2 },
      { play: [second] },
    );
    const enemy = game.findCardInstanceId(second, "play", PLAYER_TWO);
    const hand = game.findCardInstanceId(second, "hand", PLAYER_ONE);
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    for (const target of [enemy, hand])
      expect(
        game
          .asPlayerOne()
          .resolvePendingByCard(roxanne, { resolveOptional: true, targets: [other, target] }),
      ).not.toBeSuccessfulCommand();
    expect(accept(game)).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: roxanne, location });
  });
  it("characters outside play cannot be moved", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne, spare],
      discard: [ward],
      play: [other, location],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    for (const target of [spare, ward])
      expect(
        game
          .asPlayerOne()
          .resolvePendingByCard(roxanne, { resolveOptional: true, targets: [target, location] }),
      ).not.toBeSuccessfulCommand();
    expect(accept(game)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(other)).toBe(3);
  });
  it("rejects extra characters or destinations, then permits a valid retry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne],
      play: [other, spare, location, second],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    for (const targets of [
      [other, spare, location],
      [other, location, second],
    ])
      expect(
        game.asPlayerOne().resolvePendingByCard(roxanne, { resolveOptional: true, targets }),
      ).not.toBeSuccessfulCommand();
    expect(accept(game)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(other)).toBe(3);
  });
  it.each([
    { targets: [other, spare] },
    { targets: [location, second] },
    { targets: [other, other] },
    { targets: [location, location] },
  ])(
    "incomplete typed pair makes no movement or bonus and permits retry %j",
    ({ targets }: { targets: readonly LorcanaCardDefinition[] }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [roxanne],
        play: [other, spare, location, second],
        inkwell: 2,
      });
      expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
      expect(
        game
          .asPlayerOne()
          .resolvePendingByCard(roxanne, { resolveOptional: true, targets: [...targets] }),
      ).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardLocationId(roxanne)).toBeUndefined();
      expect(game.asPlayerOne().getCardLocationId(other)).toBeUndefined();
      expect(game.asPlayerOne().getCardLore(other)).toBe(2);
      expect(
        game.asPlayerOne().getPendingEffects().length + game.asPlayerOne().getBagEffects().length,
      ).toBeGreaterThan(0);
      expect(accept(game)).toBeSuccessfulCommand();
      expect(game.asPlayerOne()).toBeAtLocation({ card: roxanne, location });
      expect(game.asPlayerOne()).toBeAtLocation({ card: other, location });
      expect(game.asPlayerOne().getCardLore(other)).toBe(3);
    },
  );
  it.each([{ play: [location] }, { play: [other] }, { play: [] }])(
    "declining with no character/location pair has no movement or bonus %j",
    ({
      play,
    }: {
      play: ReadonlyArray<
        ReturnType<typeof createMockCharacter> | ReturnType<typeof createMockLocation>
      >;
    }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [roxanne],
        play: [...play],
        inkwell: 2,
      });
      expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
      if (
        game.asPlayerOne().getBagEffects().length ||
        game.asPlayerOne().getPendingEffects().length
      )
        expect(
          game.asPlayerOne().resolvePendingByCard(roxanne, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardLore(roxanne)).toBe(1);
      expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
    },
  );
  it.each([{ play: [location] }, { play: [other] }, { play: [] }])(
    "accepting with no character/location pair has no movement or bonus %j",
    ({
      play,
    }: {
      play: ReadonlyArray<
        ReturnType<typeof createMockCharacter> | ReturnType<typeof createMockLocation>
      >;
    }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [roxanne],
        play: [...play],
        inkwell: 2,
      });
      expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
      if (
        game.asPlayerOne().getBagEffects().length ||
        game.asPlayerOne().getPendingEffects().length
      )
        expect(
          game.asPlayerOne().resolvePendingByCard(roxanne, { resolveOptional: true }),
        ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardLocationId(roxanne)).toBeUndefined();
      expect(game.asPlayerOne().getCardLore(roxanne)).toBe(1);
      expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
    },
  );
  it("lore expires as soon as the turn ends; locations persist and entry does not repeat", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [roxanne], play: [other, location], inkwell: 2, deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    expect(accept(game)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(other)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(other)).toBe(2);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: other, location });
    expect(game.asPlayerOne()).toBeAtLocation({ card: roxanne, location });
    expect(game.asPlayerOne().quest(other)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(roxanne)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(6);
    expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
  });
  it("another Roxanne can be moved and buffed but remains drying", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne, roxanne],
      play: [location],
      inkwell: 4,
    });
    const ids = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    const first = ids[0]!,
      next = ids[1]!;
    expect(game.asPlayerOne().playCard(first)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(first, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(next)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(next, { resolveOptional: true, targets: [first, location] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(first)).toBe(2);
    expect(game.asPlayerOne().getCardLore(next)).toBe(1);
    expect(game.asPlayerOne()).toBeAtLocation({ card: first, location });
    expect(game.asPlayerOne()).toBeAtLocation({ card: next, location });
    expect(game.asPlayerOne().quest(first)).not.toBeSuccessfulCommand();
  });
  it("emits one move event for each moved character", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne],
      play: [other, watcher, location],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    expect(accept(game)).toBeSuccessfulCommand();
    for (const effect of game.asPlayerOne().getBagEffects())
      expect(game.asPlayerOne().resolveBag(effect.id, {})).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });
  it("player two controls free movement and temporary lore without using opposing resources", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [other, location], inkwell: 2, inkDrops: 3, deck: 6 },
      { hand: [roxanne], play: [other, location], inkwell: 2, inkDrops: 1, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const own = game.findCardInstanceId(other, "play", PLAYER_TWO);
    const destination = game.findCardInstanceId(location, "play", PLAYER_TWO);
    const enemy = game.findCardInstanceId(other, "play", PLAYER_ONE);
    expect(game.asPlayerTwo().playCard(roxanne)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(roxanne, { resolveOptional: true, targets: [own, destination] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(roxanne, { resolveOptional: true, targets: [own, destination] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo()).toBeAtLocation({ card: own, location: destination });
    expect(game.asPlayerTwo()).toBeAtLocation({ card: roxanne, location: destination });
    expect(game.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerOne().getCardLore(enemy)).toBe(2);
    expect(game.asPlayerTwo().quest(own)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(3);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardLore(own)).toBe(2);
    expect(game.asPlayerTwo()).toBeAtLocation({ card: own, location: destination });
  });
  it("insufficient play payment leaves Roxanne in hand; she is inkable", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [roxanne],
      play: [other, location],
      inkwell: 1,
    });
    expect(game.asPlayerOne().playCard(roxanne)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(roxanne)).toBe("hand");
    expect(game.asPlayerOne().getCardLore(other)).toBe(2);
    expect(game.asPlayerOne().putIntoInkwell(PLAYER_ONE, roxanne)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(roxanne)).toBe("inkwell");
  });
  it("two transfers stack lore until turn end even after both sources leave play", () => {
    const remove = createMockAction({
      id: "roxanne-remove",
      name: "Remove",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: other, damage: 1, atLocation: location }, location, second],
        hand: [roxanne, roxanne, remove, remove],
        inkwell: 4,
        deck: 6,
      },
      { deck: 6 },
    );
    const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE).slice(0, 2);
    expect(game.asPlayerOne().playCard(copies[0]!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(copies[0]!, {
        resolveOptional: true,
        targets: [other, second],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(other)).toBe(3);
    expect(game.asPlayerOne().playCard(copies[1]!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(copies[1]!, {
        resolveOptional: true,
        targets: [other, location],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(other)).toBe(4);
    for (const source of copies) {
      expect(game.asPlayerOne().playCard(remove, { targets: [source] })).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(source)).toBe("discard");
      expect(game.asPlayerOne().getCardLore(other)).toBe(4);
    }
    expect(game.asPlayerOne()).toBeAtLocation({ card: other, location });
    expect(game.asPlayerOne().getDamage(other)).toBe(1);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().quest(other)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(other)).toBe(2);
    expect(game.asPlayerOne()).toBeAtLocation({ card: other, location });
  });
  it("cannot move the other character to its current location; a new destination permits retry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: other, atLocation: location }, location, second],
      hand: [roxanne],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(roxanne)).toBeSuccessfulCommand();
    expect(accept(game, [other, location])).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: other, location });
    expect(game.asPlayerOne().getCardLocationId(roxanne)).toBeUndefined();
    expect(game.asPlayerOne().getCardLore(other)).toBe(2);
    expect(accept(game, [other, second])).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toBeAtLocation({ card: other, location: second });
    expect(game.asPlayerOne()).toBeAtLocation({ card: roxanne, location: second });
    expect(game.asPlayerOne().getCardLore(other)).toBe(3);
  });
});
