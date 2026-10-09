import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { fredBigStomper } from "./091-fred-big-stomper";

const enemyLocation = createMockLocation({
  id: "stomper-enemy-location",
  name: "Enemy Hangout",
  cost: 2,
});

const ownLocation = createMockLocation({
  id: "stomper-own-location",
  name: "Home Base",
  cost: 2,
});

describe("Fred - Big Stomper", () => {
  it("KAIJU CRUSH may banish a chosen location in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fredBigStomper],
        inkwell: fredBigStomper.cost,
        deck: 6,
      },
      {
        play: [enemyLocation],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(fredBigStomper)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fredBigStomper, {
        resolveOptional: true,
        targets: [enemyLocation],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(enemyLocation)).toBe("discard");
  });

  it("KAIJU CRUSH may banish one of your own locations", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fredBigStomper],
      play: [ownLocation],
      inkwell: fredBigStomper.cost,
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(fredBigStomper)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fredBigStomper, {
        resolveOptional: true,
        targets: [ownLocation],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ownLocation)).toBe("discard");
  });

  it("KAIJU CRUSH can be declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fredBigStomper],
        inkwell: fredBigStomper.cost,
        deck: 6,
      },
      {
        play: [enemyLocation],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(fredBigStomper)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fredBigStomper, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(enemyLocation)).toBe("play");
  });
});

const character = createMockCharacter({ id: "stomper-character", name: "Bystander", cost: 1 });
const item = createMockItem({ id: "stomper-item", name: "Item", cost: 1 });

it("rejects characters, items, out-of-zone locations and multiple choices without consuming the effect", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [fredBigStomper, ownLocation],
      play: [character, item],
      discard: [enemyLocation],
      inkwell: 5,
      deck: 6,
    },
    { play: [enemyLocation, ownLocation], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(fredBigStomper)).toBeSuccessfulCommand();
  const hand = game.findCardInstanceId(ownLocation, "hand", PLAYER_ONE);
  const discarded = game.findCardInstanceId(enemyLocation, "discard", PLAYER_ONE);
  const enemy = game.findCardInstanceId(enemyLocation, "play", PLAYER_TWO);
  const second = game.findCardInstanceId(ownLocation, "play", PLAYER_TWO);
  for (const targets of [[character], [item], [hand], [discarded], [enemy, second]]) {
    expect(
      game.asPlayerOne().resolvePendingByCard(fredBigStomper, { resolveOptional: true, targets }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    expect(game.asPlayerTwo().getZonesCardCount().play).toBe(2);
    expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(0);
  }
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(fredBigStomper, { resolveOptional: true, targets: [enemy] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(enemy)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(second)).toBe("play");
});
it("accepting with no locations does nothing to other permanents", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [fredBigStomper],
    play: [character, item],
    inkwell: 5,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(fredBigStomper)).toBeSuccessfulCommand();
  if (game.asPlayerOne().getBagCount())
    expect(
      game.asPlayerOne().resolvePendingByCard(fredBigStomper, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().play).toBe(3);
  expect(game.asPlayerOne().getZonesCardCount().discard).toBe(0);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});
it("each played copy can independently banish or decline", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [fredBigStomper, fredBigStomper, fredBigStomper],
      play: [ownLocation],
      inkwell: 15,
      deck: 6,
    },
    { play: [enemyLocation], deck: 6 },
  );
  for (const target of [enemyLocation, null, ownLocation]) {
    const source = game.findCardInstanceId(fredBigStomper, "hand", PLAYER_ONE);
    expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(source, {
        resolveOptional: target !== null,
        ...(target ? { targets: [target] } : {}),
      }),
    ).toBeSuccessfulCommand();
  }
  expect(game.asPlayerOne().getCardZone(ownLocation)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(enemyLocation)).toBe("discard");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});
it("questing gives two lore and does not banish a location", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [fredBigStomper, ownLocation], deck: 6 },
    { play: [enemyLocation], deck: 6 },
  );
  expect(game.asPlayerOne().quest(fredBigStomper)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().getCardZone(ownLocation)).toBe("play");
  expect(game.asPlayerTwo().getCardZone(enemyLocation)).toBe("play");
});
it("insufficient play payment preserves Fred and both locations", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [fredBigStomper], play: [ownLocation], inkwell: 4, deck: 6 },
    { play: [enemyLocation], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(fredBigStomper)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerOne().getCardZone(fredBigStomper)).toBe("hand");
  expect(game.asPlayerOne().getCardZone(ownLocation)).toBe("play");
  expect(game.asPlayerTwo().getCardZone(enemyLocation)).toBe("play");
  expect(game.asPlayerOne().getBagCount()).toBe(0);
});
it("banishing a location keeps the character there in play and clears its location", () => {
  const place = createMockLocation({
    id: "stomper-occupied-location",
    name: "Occupied Location",
    cost: 1,
    moveCost: 1,
    willpower: 8,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [fredBigStomper],
    play: [place, character],
    inkwell: 6,
    deck: 6,
  });
  expect(game.asPlayerOne().moveCharacterToLocation(character, place)).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toBeAtLocation({ card: character, location: place });
  expect(game.asPlayerOne().playCard(fredBigStomper)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(fredBigStomper, { resolveOptional: true, targets: [place] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(place)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(character)).toBe("play");
  expect(game.asPlayerOne()).not.toBeAtLocation({ card: character, location: place });
});

it("player two may banish either owner's location without affecting the other", () => {
  for (const owner of [PLAYER_ONE, PLAYER_TWO]) {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ownLocation], deck: 6 },
      { hand: [fredBigStomper], play: [ownLocation], inkwell: 5, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const target = game.findCardInstanceId(ownLocation, "play", owner);
    const other = game.findCardInstanceId(
      ownLocation,
      "play",
      owner === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE,
    );
    expect(game.asPlayerTwo().playCard(fredBigStomper)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(fredBigStomper, { resolveOptional: true, targets: [target] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(fredBigStomper, { resolveOptional: true, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(target)).toBe("discard");
    expect(game.asPlayerTwo().getCardZone(other)).toBe("play");
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    const log = JSON.stringify(
      game
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .flatMap((entry) => entry.public),
    );
    expect(log).toContain(target);
  }
});

for (const owner of [PLAYER_ONE, PLAYER_TWO]) {
  it(`Player Two banishes ${owner}'s occupied exact location and preserves all occupants`, () => {
    const location = createMockLocation({
      id: "stomper-exact-occupied",
      name: "Occupied Place",
      cost: 1,
      moveCost: 1,
      willpower: 8,
    });
    const occupant = createMockCharacter({
      id: "stomper-exact-occupant",
      name: "Occupant",
      cost: 1,
      willpower: 4,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [location, occupant, { card: occupant, damage: 1 }], inkwell: 2, deck: 6 },
      {
        play: [location, occupant, { card: occupant, damage: 1 }],
        hand: [fredBigStomper],
        inkwell: 7,
        deck: 6,
      },
    );
    const p1Location = game.findCardInstanceId(location, "play", PLAYER_ONE)!;
    const p2Location = game.findCardInstanceId(location, "play", PLAYER_TWO)!;
    const occupants = {
      [PLAYER_ONE]: game.getCardInstanceIdsInZone("play", PLAYER_ONE).slice(1),
      [PLAYER_TWO]: game.getCardInstanceIdsInZone("play", PLAYER_TWO).slice(1),
    };
    for (const id of occupants[PLAYER_ONE])
      expect(game.asPlayerOne().moveCharacterToLocation(id, p1Location)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    for (const id of occupants[PLAYER_TWO])
      expect(game.asPlayerTwo().moveCharacterToLocation(id, p2Location)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(fredBigStomper)).toBeSuccessfulCommand();
    const chosen = owner === PLAYER_ONE ? p1Location : p2Location;
    const otherOwner = owner === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    const other = owner === PLAYER_ONE ? p2Location : p1Location;
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(fredBigStomper, { resolveOptional: true, targets: [chosen] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(chosen)).toBe("play");
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(fredBigStomper, { resolveOptional: true, targets: [chosen] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(chosen)).toBe("discard");
    expect(game.asPlayerTwo().getCardZone(other)).toBe("play");
    for (const [index, id] of occupants[owner].entries()) {
      expect(game.asLorcanaPlayer(owner).getCardZone(id)).toBe("play");
      expect(game.asLorcanaPlayer(owner)).not.toBeAtLocation({ card: id, location: chosen });
      expect(game.asLorcanaPlayer(owner).getDamage(id)).toBe(index);
    }
    for (const id of occupants[otherOwner])
      expect(game.asLorcanaPlayer(otherOwner)).toBeAtLocation({ card: id, location: other });
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
}
