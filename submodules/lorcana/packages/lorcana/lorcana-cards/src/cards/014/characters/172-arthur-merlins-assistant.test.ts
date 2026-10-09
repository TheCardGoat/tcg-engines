import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { arthurMerlinsAssistant } from "./172-arthur-merlins-assistant";

const hub = createMockLocation({ id: "arthur-hub", name: "Workshop", cost: 2, moveCost: 2 });

const otherHub = createMockLocation({
  id: "arthur-other-hub",
  name: "Annex",
  cost: 2,
  moveCost: 2,
});

describe("Arthur - Merlin's Assistant", () => {
  it("an unpaid move does not consume the first successful movement reward", () => {
    const freeHub = createMockLocation({
      id: "arthur-free-hub",
      name: "Free Hub",
      cost: 1,
      moveCost: 0,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arthurMerlinsAssistant, hub, freeHub],
      inkwell: 1,
    });
    expect(
      g.asPlayerOne().moveCharacterToLocation(arthurMerlinsAssistant, hub),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne()).not.toBeAtLocation({ card: arthurMerlinsAssistant, location: hub });
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(
      g.asPlayerOne().moveCharacterToLocation(arthurMerlinsAssistant, freeHub),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toBeAtLocation({ card: arthurMerlinsAssistant, location: freeHub });
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("rejects an unpaid play without spending ink or applying abilities", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurMerlinsAssistant],
      inkwell: 2,
    });
    expect(g.asPlayerOne().playCard(arthurMerlinsAssistant)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(arthurMerlinsAssistant)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.getCardInstanceIdsInZone("play", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("Magical Travel moves him to a location for free and grants 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [arthurMerlinsAssistant],
        inkwell: arthurMerlinsAssistant.cost,
        play: [hub],
        deck: 1,
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arthurMerlinsAssistant, {
        resolveOptional: true,
        targets: [hub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: arthurMerlinsAssistant,
      location: hub,
    });
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("declining Magical Travel moves nothing and grants no ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [arthurMerlinsAssistant],
        inkwell: arthurMerlinsAssistant.cost,
        play: [hub],
        deck: 1,
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arthurMerlinsAssistant, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).not.toBeAtLocation({
      card: arthurMerlinsAssistant,
      location: hub,
    });
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("Arcane Deliveries only pays out once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [arthurMerlinsAssistant],
        inkwell: arthurMerlinsAssistant.cost + 2,
        play: [hub, otherHub],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arthurMerlinsAssistant, {
        resolveOptional: true,
        targets: [hub],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    // A second move on the same turn grants no extra ink drop.
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(arthurMerlinsAssistant, otherHub),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: arthurMerlinsAssistant,
      location: otherHub,
    });
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("Arcane Deliveries resets after a turn that already paid a drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [arthurMerlinsAssistant], inkwell: 5, play: [hub, otherHub], deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(arthurMerlinsAssistant, { resolveOptional: true, targets: [hub] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().moveCharacterToLocation(arthurMerlinsAssistant, otherHub),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(g.asPlayerOne()).toBeAtLocation({ card: arthurMerlinsAssistant, location: otherHub });
  });

  it("Magical Travel rejects an opposing location and permits a friendly retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [arthurMerlinsAssistant], inkwell: 3, play: [hub] },
      { play: [otherHub] },
    );
    expect(g.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurMerlinsAssistant, {
        resolveOptional: true,
        targets: [otherHub],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne()).not.toBeAtLocation({
      card: arthurMerlinsAssistant,
      location: otherHub,
    });
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(arthurMerlinsAssistant, { resolveOptional: true, targets: [hub] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("declining entry leaves the first paid move eligible and rejects moving to the same location", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurMerlinsAssistant],
      inkwell: 5,
      play: [hub],
    });
    expect(g.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurMerlinsAssistant, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().moveCharacterToLocation(arthurMerlinsAssistant, hub),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(
      g.asPlayerOne().moveCharacterToLocation(arthurMerlinsAssistant, hub),
    ).not.toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("separate Arthur copies each earn their own once-per-turn drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arthurMerlinsAssistant, arthurMerlinsAssistant, hub],
      inkwell: 4,
    });
    const ids = g
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === arthurMerlinsAssistant.id);
    expect(g.asPlayerOne().moveCharacterToLocation(ids[0]!, hub)).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().moveCharacterToLocation(ids[1]!, hub)).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("player two owns the free move choice and the earned drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [otherHub], deck: 3 },
      { hand: [arthurMerlinsAssistant], play: [hub], inkwell: 3, deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(arthurMerlinsAssistant, { resolveOptional: true, targets: [hub] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(arthurMerlinsAssistant, { resolveOptional: true, targets: [hub] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toBeAtLocation({ card: arthurMerlinsAssistant, location: hub });
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("an earned drop pays part of a second move without granting a second drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurMerlinsAssistant],
      play: [hub, otherHub],
      inkwell: 4,
    });
    expect(g.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(arthurMerlinsAssistant, { resolveOptional: true, targets: [hub] }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(
      g.asPlayerOne().moveCharacterToLocation(arthurMerlinsAssistant, otherHub, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne()).toBeAtLocation({ card: arthurMerlinsAssistant, location: otherHub });
  });

  it("moving on an opponent turn gives no drop and does not consume the next own turn limit", () => {
    const move = createMockAction({
      id: "arthur-opponent-move",
      name: "Move opposing character to opposing location",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "move-to-location",
            character: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
            location: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["location"],
            },
            cost: "free",
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [move], deck: 3 },
      { play: [arthurMerlinsAssistant, hub, otherHub], inkwell: 2, deck: 3 },
    );
    expect(
      g.asPlayerOne().playCard(move, { targets: [arthurMerlinsAssistant, hub] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toBeAtLocation({ card: arthurMerlinsAssistant, location: hub });
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().moveCharacterToLocation(arthurMerlinsAssistant, otherHub),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("normal inking has no ability effect and a drying Arthur quests for one on his next turn", () => {
    const ink = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [arthurMerlinsAssistant] });
    expect(
      ink.asPlayerOne().putIntoInkwell(PLAYER_ONE, arthurMerlinsAssistant),
    ).toBeSuccessfulCommand();
    expect(ink.asPlayerOne().getCardZone(arthurMerlinsAssistant)).toBe("inkwell");
    expect(ink.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(ink.getInkDrops(PLAYER_ONE)).toBe(0);
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [arthurMerlinsAssistant], inkwell: 3, play: [hub], deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurMerlinsAssistant, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(arthurMerlinsAssistant)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    const loreBeforeQuest = g.getLore(PLAYER_ONE);
    expect(g.asPlayerOne().quest(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(loreBeforeQuest + 1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("rejects a nonlocation and a hand location then selects the exact duplicate in play", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurMerlinsAssistant, otherHub],
      play: [hub, hub],
      inkwell: 3,
    });
    expect(g.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    for (const target of [arthurMerlinsAssistant, otherHub]) {
      expect(
        g.asPlayerOne().resolvePendingByCard(arthurMerlinsAssistant, {
          resolveOptional: true,
          targets: [target],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    }
    const ids = g
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === hub.id);
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurMerlinsAssistant, {
        resolveOptional: true,
        targets: [ids[1]!],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toBeAtLocation({ card: arthurMerlinsAssistant, location: ids[1]! });
    expect(g.asPlayerOne()).not.toBeAtLocation({ card: arthurMerlinsAssistant, location: ids[0]! });
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("legal movement lists honor selected drops and keep bank-only moves unavailable", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arthurMerlinsAssistant, hub],
      inkDrops: 2,
    });
    const id = g.findCardInstanceId(arthurMerlinsAssistant, "play", PLAYER_ONE);
    const locationId = g.findCardInstanceId(hub, "play", PLAYER_ONE);
    expect(
      g
        .asPlayerOne()
        .getAvailableMoves()
        .some((move) => move.moveId === "moveCharacterToLocation"),
    ).toBe(false);
    expect(g.asPlayerOne().getMoveOptions("moveCharacterToLocation", id)).toEqual([]);
    expect(
      g
        .asPlayerOne()
        .getAvailableMoves({ inkDrops: 2 })
        .find((move) => move.moveId === "moveCharacterToLocation")?.selectableCardIds,
    ).toContain(id);
    expect(g.asPlayerOne().getMoveOptions("moveCharacterToLocation", id, { inkDrops: 2 })).toEqual([
      { kind: "card", cardId: locationId },
    ]);
    expect(
      g
        .asPlayerOne()
        .getAvailableMoves()
        .some((move) => move.moveId === "moveCharacterToLocation"),
    ).toBe(false);
  });

  it("without a location the entry can be declined without moving or granting drops", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [arthurMerlinsAssistant], inkwell: 3, deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(arthurMerlinsAssistant)).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurMerlinsAssistant, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });
});
