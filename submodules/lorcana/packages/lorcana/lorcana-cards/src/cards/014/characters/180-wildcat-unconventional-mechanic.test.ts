import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { wildcatUnconventionalMechanic } from "./180-wildcat-unconventional-mechanic";

const opponentItem = createMockItem({
  id: "wildcat-opponent-item",
  name: "Opponent Item",
  cost: 2,
});

describe("Wildcat - Unconventional Mechanic", () => {
  it("banishes a chosen item when the ability is accepted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wildcatUnconventionalMechanic],
        inkwell: wildcatUnconventionalMechanic.cost,
        deck: 1,
      },
      {
        play: [opponentItem],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(wildcatUnconventionalMechanic),
    ).toBeSuccessfulCommand();

    const itemId = testEngine.findCardInstanceId(opponentItem, "play", PLAYER_TWO);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(wildcatUnconventionalMechanic, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [itemId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
  });

  it("declining leaves the item in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wildcatUnconventionalMechanic],
        inkwell: wildcatUnconventionalMechanic.cost,
        deck: 1,
      },
      {
        play: [opponentItem],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(wildcatUnconventionalMechanic),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(wildcatUnconventionalMechanic, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("play");
  });
  it("can banish a friendly item while leaving the opposing item", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [wildcatUnconventionalMechanic], play: [opponentItem], inkwell: 3, deck: 3 },
      { play: [opponentItem], deck: 3 },
    );
    const ownItem = game.findCardInstanceId(opponentItem, "play", "player_one");
    const enemyItem = game.findCardInstanceId(opponentItem, "play", "player_two");
    expect(game.asPlayerOne().playCard(wildcatUnconventionalMechanic)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(wildcatUnconventionalMechanic, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolveNextPending({ targets: [ownItem] })).toBeSuccessfulCommand();
    expect(game.asServer().getCardZone(ownItem)).toBe("discard");
    expect(game.asServer().getCardZone(enemyItem)).toBe("play");
  });

  it.each(["character", "hand item"])(
    "rejects %s as a target and permits a legal retry",
    (boundary: string) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [wildcatUnconventionalMechanic, opponentItem], inkwell: 3, deck: 3 },
        { play: [opponentItem], deck: 3 },
      );
      const target = game.findCardInstanceId(opponentItem, "play", "player_two");
      expect(game.asPlayerOne().playCard(wildcatUnconventionalMechanic)).toBeSuccessfulCommand();
      expect(
        game
          .asPlayerOne()
          .resolvePendingByCard(wildcatUnconventionalMechanic, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      const invalid =
        boundary === "character"
          ? game.findCardInstanceId(wildcatUnconventionalMechanic, "play")
          : game.findCardInstanceId(opponentItem, "hand");
      expect(
        game.asPlayerOne().resolveNextPending({ targets: [invalid] }),
      ).not.toBeSuccessfulCommand();
      expect(game.asServer().getCardZone(target)).toBe("play");
      expect(game.asPlayerOne().resolveNextPending({ targets: [target] })).toBeSuccessfulCommand();
      expect(game.asServer().getCardZone(target)).toBe("discard");
    },
  );

  it("player two owns the optional choice", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [opponentItem], deck: 3 },
      { hand: [wildcatUnconventionalMechanic], inkwell: 3, deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(wildcatUnconventionalMechanic)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(wildcatUnconventionalMechanic, { resolveOptional: true }),
    ).not.toBeSuccessfulCommand();
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(wildcatUnconventionalMechanic, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveNextPending({
        targets: [game.findCardInstanceId(opponentItem, "play", "player_one")],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(opponentItem)).toBe("discard");
  });
  it("finishes entry without a choice when there are no items", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [wildcatUnconventionalMechanic],
      inkwell: 3,
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(wildcatUnconventionalMechanic)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(wildcatUnconventionalMechanic)).toBe("play");
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });

  it("each played copy gets a separate optional entry choice", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [wildcatUnconventionalMechanic, wildcatUnconventionalMechanic], inkwell: 6, deck: 3 },
      { play: [opponentItem], deck: 3 },
    );
    const [first, second] = game.getCardInstanceIdsInZone("hand", "player_one");
    expect(game.asPlayerOne().playCard(first!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(first!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(opponentItem)).toBe("play");
    expect(game.asPlayerOne().playCard(second!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(second!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolveNextPending({
        targets: [game.findCardInstanceId(opponentItem, "play", "player_two")],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
    expect(game.asServer().getAvailableInk("player_one")).toBe(0);
  });

  it("pays three ink and quests only after drying without repeating entry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [wildcatUnconventionalMechanic],
      inkwell: 3,
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(wildcatUnconventionalMechanic)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk("player_one")).toBe(0);
    expect(game.asPlayerOne().quest(wildcatUnconventionalMechanic)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(wildcatUnconventionalMechanic)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(1);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });

  it("rejects unpaid play and inks without an entry trigger", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [wildcatUnconventionalMechanic],
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(wildcatUnconventionalMechanic)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(wildcatUnconventionalMechanic)).toBe("hand");
    expect(
      game.asPlayerOne().putIntoInkwell("player_one", wildcatUnconventionalMechanic),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(wildcatUnconventionalMechanic)).toBe("inkwell");
    expect(game.asServer().getAvailableInk("player_one")).toBe(1);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });
});
