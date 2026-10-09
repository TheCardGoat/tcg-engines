// CR 2.2.0: 4.7.1–4.7.4, 6.1.4, 6.1.5.1.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { heiheiAtTheCrosswalk } from "./103-heihei-at-the-crosswalk";

const firstLocation = createMockLocation({
  id: "heihei-first-location",
  name: "Crosswalk Corner",
  cost: 2,
  lore: 0,
  moveCost: 4,
});

const secondLocation = createMockLocation({
  id: "heihei-second-location",
  name: "Park Entrance",
  cost: 2,
  lore: 0,
  moveCost: 4,
});

describe("Heihei - At the Crosswalk", () => {
  it("player two moves only their Heihei for free and gains only their lore", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          firstLocation,
          secondLocation,
          { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
        ],
        deck: 6,
        lore: 5,
      },
      {
        play: [
          firstLocation,
          secondLocation,
          { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
        ],
        deck: 6,
        inkDrops: 3,
        lore: 7,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const own = game.findCardInstanceId(heiheiAtTheCrosswalk, "play", PLAYER_TWO);
    const enemy = game.findCardInstanceId(heiheiAtTheCrosswalk, "play", PLAYER_ONE);
    const destination = game.findCardInstanceId(secondLocation, "play", PLAYER_TWO);
    const enemyDestination = game.findCardInstanceId(secondLocation, "play", PLAYER_ONE);
    expect(
      game.asPlayerTwo().activateAbility(own, { targets: [enemyDestination] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().activateAbility(enemy, { targets: [destination] }),
    ).not.toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(7);
    expect(
      game.asPlayerTwo().activateAbility(own, { targets: [destination] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo()).toBeAtLocation({ card: own, location: destination });
    expect(game.asPlayerOne()).toBeAtLocation({
      card: enemy,
      location: game.findCardInstanceId(firstLocation, "play", PLAYER_ONE),
    });
    expect(game.getLore(PLAYER_TWO)).toBe(8);
    expect(game.getLore(PLAYER_ONE)).toBe(5);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().isExerted(own)).toBe(false);
    expect(
      game.asPlayerTwo().activateAbility(own, {
        targets: [game.findCardInstanceId(firstLocation, "play", PLAYER_TWO)],
      }),
    ).not.toBeSuccessfulCommand();
  });
  it("AIMLESS WANDERING moves him to another location for free and gains 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
        firstLocation,
        secondLocation,
      ],
      deck: 2,
    });

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    expect(
      testEngine.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, {
        ability: "AIMLESS WANDERING",
        targets: [secondLocation],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: heiheiAtTheCrosswalk,
      location: secondLocation,
    });
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("AIMLESS WANDERING only works once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
        firstLocation,
        secondLocation,
      ],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, {
        ability: "AIMLESS WANDERING",
        targets: [secondLocation],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(
      testEngine.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, {
        ability: "AIMLESS WANDERING",
        targets: [firstLocation],
      }),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("AIMLESS WANDERING can be used again on a later turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
        firstLocation,
        secondLocation,
      ],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, {
        ability: "AIMLESS WANDERING",
        targets: [secondLocation],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, {
        ability: "AIMLESS WANDERING",
        targets: [firstLocation],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: heiheiAtTheCrosswalk,
      location: firstLocation,
    });
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });
});

it("rejects his current and opposing locations without lore or consuming the valid move", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        firstLocation,
        secondLocation,
        { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
      ],
      deck: 6,
    },
    { play: [secondLocation], deck: 6 },
  );
  const own = game.findCardInstanceId(secondLocation, "play", PLAYER_ONE);
  const enemy = game.findCardInstanceId(secondLocation, "play", PLAYER_TWO);
  for (const target of [firstLocation, enemy]) {
    expect(
      game
        .asPlayerOne()
        .activateAbility(heiheiAtTheCrosswalk, { ability: "AIMLESS WANDERING", targets: [target] }),
    ).not.toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne()).toBeAtLocation({
      card: heiheiAtTheCrosswalk,
      location: firstLocation,
    });
  }
  expect(
    game
      .asPlayerOne()
      .activateAbility(heiheiAtTheCrosswalk, { ability: "AIMLESS WANDERING", targets: [own] }),
  ).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
});
it("does not award lore without another legal destination", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [firstLocation, { card: heiheiAtTheCrosswalk, atLocation: firstLocation }],
    deck: 6,
  });
  expect(
    game
      .asPlayerOne()
      .activateAbility(heiheiAtTheCrosswalk, { ability: "AIMLESS WANDERING", targets: [] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne()).toBeAtLocation({
    card: heiheiAtTheCrosswalk,
    location: firstLocation,
  });
});

it("cannot activate outside a location or during the opponent's turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [firstLocation, secondLocation, heiheiAtTheCrosswalk], inkwell: 4, deck: 6 },
    { deck: 6 },
  );
  expect(
    game.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, { targets: [secondLocation] }),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().moveCharacterToLocation(heiheiAtTheCrosswalk, firstLocation),
  ).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, { targets: [secondLocation] }),
  ).not.toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(0);
});

it("moves a drying character for free and does not exert him", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [heiheiAtTheCrosswalk],
    play: [firstLocation, secondLocation],
    inkwell: 6,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(heiheiAtTheCrosswalk)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().moveCharacterToLocation(heiheiAtTheCrosswalk, firstLocation),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(
    game.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, { targets: [secondLocation] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().isExerted(heiheiAtTheCrosswalk)).toBe(false);
  expect(game.getLore(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().quest(heiheiAtTheCrosswalk)).not.toBeSuccessfulCommand();
});

it("moves an exerted character and keeps his exerted state", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [
      firstLocation,
      secondLocation,
      { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
    ],
    deck: 6,
  });
  expect(game.asPlayerOne().quest(heiheiAtTheCrosswalk)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, { targets: [secondLocation] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(heiheiAtTheCrosswalk)).toBe(true);
  expect(game.getLore(PLAYER_ONE)).toBe(2);
});

it("rejects a non-location, a hand location and excess targets before a valid retry", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [
      firstLocation,
      secondLocation,
      { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
    ],
    hand: [secondLocation],
    deck: 6,
  });
  const handLocation = game.findCardInstanceId(secondLocation, "hand", PLAYER_ONE);
  const validLocation = game.findCardInstanceId(secondLocation, "play", PLAYER_ONE);
  for (const targets of [[heiheiAtTheCrosswalk], [handLocation], [firstLocation, validLocation]]) {
    expect(
      game.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, { targets }),
    ).not.toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(0);
  }
  expect(
    game.asPlayerOne().activateAbility(heiheiAtTheCrosswalk, { targets: [validLocation] }),
  ).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
});

it("tracks the once-per-turn use separately for two copies", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [
      firstLocation,
      secondLocation,
      { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
      { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
    ],
    deck: 6,
  });
  const copies = game.getCardInstanceIdsInZone("play", PLAYER_ONE).slice(2);
  expect(copies).toHaveLength(2);
  for (const copy of copies) {
    expect(
      game.asPlayerOne().activateAbility(copy, { targets: [secondLocation] }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().activateAbility(copy, { targets: [firstLocation] }),
    ).not.toBeSuccessfulCommand();
  }
  expect(game.getLore(PLAYER_ONE)).toBe(2);
});

it("resolves the browser's slotted SELF and chosen-location payload", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [
      firstLocation,
      secondLocation,
      { card: heiheiAtTheCrosswalk, atLocation: firstLocation },
    ],
    deck: 6,
  });
  expect(game.asPlayerOne().activateAbility(heiheiAtTheCrosswalk)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolveNextPending({
      targets: {
        kind: "move-to-location",
        subject: [game.findCardInstanceId(heiheiAtTheCrosswalk, "play", PLAYER_ONE)],
        location: [game.findCardInstanceId(secondLocation, "play", PLAYER_ONE)],
      },
    }),
  ).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
});

it("two newly played player-two copies keep separate free moves and reset next own turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6, lore: 5 },
    {
      hand: [heiheiAtTheCrosswalk, heiheiAtTheCrosswalk],
      play: [firstLocation, secondLocation],
      inkwell: 12,
      inkDrops: 3,
      deck: 6,
      lore: 7,
    },
  );
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_TWO);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(copies).toHaveLength(2);
  const start = game.findCardInstanceId(firstLocation, "play", PLAYER_TWO)!;
  const end = game.findCardInstanceId(secondLocation, "play", PLAYER_TWO)!;
  for (const copy of copies) {
    expect(game.asPlayerTwo().playCard(copy)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().moveCharacterToLocation(copy, start)).toBeSuccessfulCommand();
  }
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  for (const [index, copy] of copies.entries()) {
    expect(
      game.asPlayerTwo().activateAbility(copy, { targets: [start] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().activateAbility(copy, { targets: [end] })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo()).toBeAtLocation({ card: copy, location: end });
    expect(game.asPlayerTwo().isExerted(copy)).toBe(false);
    expect(game.asPlayerTwo().quest(copy)).not.toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(8 + index);
    expect(
      game.asPlayerTwo().activateAbility(copy, { targets: [start] }),
    ).not.toBeSuccessfulCommand();
  }
  expect(game.getLore(PLAYER_ONE)).toBe(5);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  for (const copy of copies) {
    expect(game.asPlayerTwo().activateAbility(copy, { targets: [start] })).toBeSuccessfulCommand();
  }
  expect(game.getLore(PLAYER_TWO)).toBe(11);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
});

it("player two gets no lore from a current-only location despite an opposing destination", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [secondLocation], deck: 6, lore: 5 },
    {
      play: [firstLocation, { card: heiheiAtTheCrosswalk, atLocation: firstLocation }],
      hand: [secondLocation],
      deck: 6,
      lore: 7,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const own = game.findCardInstanceId(heiheiAtTheCrosswalk, "play", PLAYER_TWO)!;
  const enemy = game.findCardInstanceId(secondLocation, "play", PLAYER_ONE)!;
  const hidden = game.findCardInstanceId(secondLocation, "hand", PLAYER_TWO)!;
  for (const target of [enemy, hidden]) {
    expect(
      game.asPlayerTwo().activateAbility(own, { targets: [target] }),
    ).not.toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(7);
  }
  expect(game.asPlayerTwo().activateAbility(own, { targets: [] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toBeAtLocation({ card: own, location: firstLocation });
  expect(game.getLore(PLAYER_TWO)).toBe(7);
  expect(game.getLore(PLAYER_ONE)).toBe(5);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});
