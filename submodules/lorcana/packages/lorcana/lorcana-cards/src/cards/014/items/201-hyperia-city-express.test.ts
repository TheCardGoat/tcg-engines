// CR 4.7, 6.4.2.3 and 1.9: free own-location movement, continuous source bonuses, lethal damage check.
// Rules grounding: Hyperia City Express (set14-201).
// EASY COMMUTE {E} — Move a character of yours to a location for free.
// STYLISH CONVENIENCE — Your Hyperia City locations get +2 {W}.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { hyperiaCityExpress } from "./201-hyperia-city-express";
import { portAuthorityCenterHub } from "../locations";

const commuter = createMockCharacter({
  id: "express-commuter",
  name: "Express Commuter",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const foreignLocation = createMockLocation({
  id: "express-foreign-location",
  name: "Foreign Location",
  cost: 2,
  willpower: 5,
  lore: 1,
});

describe("Hyperia City Express", () => {
  it("requires the movement targets after activating without an initial choice", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hyperiaCityExpress, commuter, foreignLocation],
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(hyperiaCityExpress, {
        ability: "EASY COMMUTE",
      }),
    ).toBeSuccessfulCommand();
    const selection = player.getPendingEffects()[0]?.selectionContext;
    expect(selection?.kind).toBe("target-selection");
    if (selection?.kind !== "target-selection")
      throw new Error("Expected movement target selection");
    expect(selection.minSelections).toBe(2);
    expect(
      player.resolvePendingByCard(hyperiaCityExpress, {
        targets: [],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(hyperiaCityExpress, {
        targets: [commuter, foreignLocation],
      }),
    ).toBeSuccessfulCommand();
    expect(player).toBeAtLocation({ card: commuter, location: foreignLocation });
  });
  it("can use the item immediately after playing it and pays only its play cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hyperiaCityExpress],
      play: [commuter, foreignLocation],
      inkwell: 1,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(hyperiaCityExpress)).toBeSuccessfulCommand();
    expect(
      player.activateAbility(hyperiaCityExpress, {
        ability: "EASY COMMUTE",
        targets: [commuter, foreignLocation],
      }),
    ).toBeSuccessfulCommand();
    expect(player).toBeAtLocation({ card: commuter, location: foreignLocation });
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(
      player.activateAbility(hyperiaCityExpress, {
        ability: "EASY COMMUTE",
        targets: [commuter, foreignLocation],
      }),
    ).not.toBeSuccessfulCommand();
  });

  it("rejects an opponent's location without exerting the item", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hyperiaCityExpress, commuter],
        deck: [],
      },
      { play: [foreignLocation], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(hyperiaCityExpress, {
        ability: "EASY COMMUTE",
        targets: [commuter, foreignLocation],
      }),
    ).not.toBeSuccessfulCommand();
    expect(player.getCard(hyperiaCityExpress).exerted).toBe(false);
    expect(player).not.toBeAtLocation({ card: commuter, location: foreignLocation });
  });

  it("moves a drying character to a non-Hyperia location without ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hyperiaCityExpress, { card: commuter, isDrying: true }, foreignLocation],
      inkwell: 0,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(hyperiaCityExpress, {
        ability: "EASY COMMUTE",
        targets: [commuter, foreignLocation],
      }),
    ).toBeSuccessfulCommand();
    expect(player).toBeAtLocation({ card: commuter, location: foreignLocation });
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getCard(hyperiaCityExpress).exerted).toBe(true);
    expect(player.getCard(commuter).exerted).toBe(false);
  });

  it("rejects an opponent's character without exerting the item", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hyperiaCityExpress, foreignLocation],
        inkwell: 0,
        deck: [],
      },
      { play: [commuter], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(hyperiaCityExpress, {
        ability: "EASY COMMUTE",
        targets: [commuter, foreignLocation],
      }),
    ).not.toBeSuccessfulCommand();
    expect(player.getCard(hyperiaCityExpress).exerted).toBe(false);
    expect(engine.asPlayerTwo()).not.toBeAtLocation({ card: commuter, location: foreignLocation });
  });

  it("does not boost an opponent's Hyperia City location", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hyperiaCityExpress],
        deck: [],
      },
      { play: [portAuthorityCenterHub], deck: [] },
    );
    expect(engine.asPlayerTwo().getCard(portAuthorityCenterHub).willpower).toBe(8);
  });

  it("stacks two Express bonuses on your Hyperia City location", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hyperiaCityExpress, hyperiaCityExpress, portAuthorityCenterHub, foreignLocation],
      deck: [],
    });
    expect(engine.asPlayerOne().getCard(portAuthorityCenterHub).willpower).toBe(12);
    expect(engine.asPlayerOne().getCard(foreignLocation).willpower).toBe(5);
  });

  it("EASY COMMUTE — moves a character of yours to a location for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 0,
      play: [hyperiaCityExpress, { card: commuter, isDrying: false }, portAuthorityCenterHub],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(hyperiaCityExpress, {
        ability: "EASY COMMUTE",
        targets: [commuter, portAuthorityCenterHub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: commuter,
      location: portAuthorityCenterHub,
    });
  });

  it("STYLISH CONVENIENCE — your Hyperia City locations get +2 {W}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hyperiaCityExpress, portAuthorityCenterHub, foreignLocation],
    });

    // Port Authority has 8 {W} printed → 10 while the Express is in play.
    expect(testEngine.asPlayerOne().getCard(portAuthorityCenterHub).willpower).toBe(10);
  });

  it("STYLISH CONVENIENCE — non-Hyperia City locations are not boosted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hyperiaCityExpress, foreignLocation],
    });

    expect(testEngine.asPlayerOne().getCard(foreignLocation).willpower).toBe(5);
  });

  it("negative — an exerted Hyperia City Express cannot be activated", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 0,
      play: [
        { card: hyperiaCityExpress, exerted: true },
        { card: commuter, isDrying: false },
        portAuthorityCenterHub,
      ],
    });

    const result = testEngine.asPlayerOne().activateAbility(hyperiaCityExpress, {
      ability: "EASY COMMUTE",
      targets: [commuter, portAuthorityCenterHub],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne()).not.toBeAtLocation({
      card: commuter,
      location: portAuthorityCenterHub,
    });
  });
});

const removeExpress = createMockAction({
  id: "express-remove-source",
  name: "Remove Express",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_ITEM" } }],
});

it("removes the willpower bonus when Express leaves play", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [removeExpress],
    play: [hyperiaCityExpress, portAuthorityCenterHub, foreignLocation],
    deck: 6,
  });
  const p = g.asPlayerOne();
  expect(p.getCard(portAuthorityCenterHub).willpower).toBe(10);
  expect(p.playCard(removeExpress, { targets: [hyperiaCityExpress] })).toBeSuccessfulCommand();
  expect(p.getCardZone(hyperiaCityExpress)).toBe("discard");
  expect(p.getCard(portAuthorityCenterHub).willpower).toBe(8);
  expect(p.getCard(foreignLocation).willpower).toBe(5);
});

it("banishes a damaged location when losing the Express bonus makes its damage lethal", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [removeExpress],
    play: [hyperiaCityExpress, { card: portAuthorityCenterHub, damage: 9 }],
    deck: 6,
  });
  const p = g.asPlayerOne();
  expect(p.getCardZone(portAuthorityCenterHub)).toBe("play");
  expect(p.getCard(portAuthorityCenterHub).willpower).toBe(10);
  expect(p.playCard(removeExpress, { targets: [hyperiaCityExpress] })).toBeSuccessfulCommand();
  expect(p.getCardZone(portAuthorityCenterHub)).toBe("discard");
  expect(p.getCardZone(hyperiaCityExpress)).toBe("discard");
});

it("Player Two moves an exact exerted copy and exerts only the selected Express", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [commuter, foreignLocation], deck: 3 },
    {
      play: [
        hyperiaCityExpress,
        hyperiaCityExpress,
        commuter,
        { card: commuter, exerted: true, isDrying: true },
        foreignLocation,
        foreignLocation,
      ],
      inkwell: 2,
      deck: 3,
    },
  );
  const p = g.asPlayerTwo();
  const ids = g.getCardInstanceIdsInZone("play", "player_two");
  const express = ids.filter((id) => g.getCardDefinitionId(id) === hyperiaCityExpress.id);
  const commuters = ids.filter((id) => g.getCardDefinitionId(id) === commuter.id);
  const locations = ids.filter((id) => g.getCardDefinitionId(id) === foreignLocation.id);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  // The fixture exerted character readies at its controller start. Exert it through a public quest.
  expect(p.quest(commuters[1]!)).toBeSuccessfulCommand();
  expect(
    p.activateAbility(express[1]!, {
      ability: "EASY COMMUTE",
      targets: [commuters[1]!, locations[1]!],
    }),
  ).toBeSuccessfulCommand();
  expect(p).toBeAtLocation({ card: commuters[1]!, location: locations[1]! });
  expect(p).not.toBeAtLocation({ card: commuters[0]!, location: locations[1]! });
  expect(p).not.toBeAtLocation({ card: commuters[1]!, location: locations[0]! });
  expect(p.isExerted(commuters[1]!)).toBe(true);
  expect(p.isExerted(commuters[0]!)).toBe(false);
  expect(p.isExerted(express[1]!)).toBe(true);
  expect(p.isExerted(express[0]!)).toBe(false);
  expect(p.getAvailableInk("player_two")).toBe(2);
  expect(p.getPendingEffects()).toHaveLength(0);
});

it("Player Two stacked bonuses apply to a new location and remove one source at a time", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [portAuthorityCenterHub], deck: 3 },
    {
      hand: [removeExpress, removeExpress, portAuthorityCenterHub],
      play: [hyperiaCityExpress, hyperiaCityExpress, { card: foreignLocation }],
      inkwell: 4,
      deck: 3,
    },
  );
  const p = g.asPlayerTwo();
  const sources = g
    .getCardInstanceIdsInZone("play", "player_two")
    .filter((id) => g.getCardDefinitionId(id) === hyperiaCityExpress.id);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const handPort = g
    .getCardInstanceIdsInZone("hand", "player_two")
    .find((id) => g.getCardDefinitionId(id) === portAuthorityCenterHub.id)!;
  expect(p.playCard(handPort)).toBeSuccessfulCommand();
  const port = g
    .getCardInstanceIdsInZone("play", "player_two")
    .find((id) => g.getCardDefinitionId(id) === portAuthorityCenterHub.id)!;
  expect(p.getCard(port).willpower).toBe(12);
  expect(
    g.asPlayerOne().getCard(g.getCardInstanceIdsInZone("play", "player_one")[0]!).willpower,
  ).toBe(8);
  expect(p.getCard(foreignLocation).willpower).toBe(5);
  expect(p.playCard(removeExpress, { targets: [sources[0]!] })).toBeSuccessfulCommand();
  expect(p.getCard(port).willpower).toBe(10);
  expect(p.getCardZone(sources[1]!)).toBe("play");
  expect(p.playCard(removeExpress, { targets: [sources[1]!] })).toBeSuccessfulCommand();
  expect(p.getCard(port).willpower).toBe(8);
  expect(p.getCard(foreignLocation).willpower).toBe(5);
});

it("a damaged Player Two location survives one stacked source removal and dies after the last", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [portAuthorityCenterHub], deck: 3 },
    {
      hand: [removeExpress, removeExpress],
      play: [hyperiaCityExpress, hyperiaCityExpress, { card: portAuthorityCenterHub, damage: 9 }],
      deck: 3,
    },
  );
  const p = g.asPlayerTwo();
  const ids = g.getCardInstanceIdsInZone("play", "player_two");
  const sources = ids.filter((id) => g.getCardDefinitionId(id) === hyperiaCityExpress.id);
  const port = ids.find((id) => g.getCardDefinitionId(id) === portAuthorityCenterHub.id)!;
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(p.playCard(removeExpress, { targets: [sources[0]!] })).toBeSuccessfulCommand();
  expect(p.getCard(port).willpower).toBe(10);
  expect(p.getCardZone(port)).toBe("play");
  expect(p.getDamage(port)).toBe(9);
  expect(p.playCard(removeExpress, { targets: [sources[1]!] })).toBeSuccessfulCommand();
  expect(p.getCardZone(port)).toBe("discard");
  expect(g.asPlayerOne().getCardZone(g.getCardInstanceIdsInZone("play", "player_one")[0]!)).toBe(
    "play",
  );
});
