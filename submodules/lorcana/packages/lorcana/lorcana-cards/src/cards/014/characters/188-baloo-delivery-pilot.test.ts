import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { balooDeliveryPilot } from "./188-baloo-delivery-pilot";
import { fireTheCannons } from "../../001/actions/197-fire-the-cannons";
import { arthurNoviceBlacksmith } from "./185-arthur-novice-blacksmith";

const dummyOpponent = createMockCharacter({
  id: "baloo-victim",
  name: "Victim",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Baloo - Delivery Pilot", () => {
  it("can't quest on a turn with no ink drop gained", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: balooDeliveryPilot, isDrying: false }],
      deck: 3,
    });

    expect(testEngine.asPlayerOne().quest(balooDeliveryPilot)).not.toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().isExerted(balooDeliveryPilot)).toBe(false);
  });

  it("quests after an ink drop was gained this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [balooDeliveryPilot, arthurNoviceBlacksmith],
        inkwell: balooDeliveryPilot.cost + arthurNoviceBlacksmith.cost + 1,
      },
      { play: [dummyOpponent] },
    );

    // Turn 1: deploy Baloo only.
    expect(testEngine.asPlayerOne().playCard(balooDeliveryPilot)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Turn 2: Arthur's CAREFUL CRAFTING gains this turn's ink drop.
    expect(testEngine.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getServerState().G.inkDrops[PLAYER_ONE]).toBe(1);

    expect(testEngine.asPlayerOne().quest(balooDeliveryPilot)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("a dry Baloo cannot challenge before gaining a drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: balooDeliveryPilot, isDrying: false }], deck: 3 },
      { play: [{ card: dummyOpponent, exerted: true }], deck: 3 },
    );
    expect(
      g.asPlayerOne().challenge(balooDeliveryPilot, dummyOpponent),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(balooDeliveryPilot)).toBe(false);
    expect(g.asPlayerTwo().getDamage(dummyOpponent)).toBe(0);
  });

  it("can challenge after gaining a drop this turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: balooDeliveryPilot, isDrying: false }],
        hand: [arthurNoviceBlacksmith],
        inkwell: 3,
        deck: 3,
      },
      { play: [{ card: dummyOpponent, exerted: true }], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCard(balooDeliveryPilot).hasChallengeRestriction).toBe(false);
    expect(g.asPlayerOne().challenge(balooDeliveryPilot, dummyOpponent)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(dummyOpponent)).toBe("discard");
    expect(g.asPlayerOne().getDamage(balooDeliveryPilot)).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(1);
  });

  it("permission remains after the earned drop is spent", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: balooDeliveryPilot, isDrying: false }],
        hand: [arthurNoviceBlacksmith, fireTheCannons],
        inkwell: 3,
        deck: 3,
      },
      { play: [{ card: dummyOpponent, exerted: true }], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().playCard(fireTheCannons, { targets: [dummyOpponent], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.asPlayerOne().quest(balooDeliveryPilot)).toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(2);
  });

  it("saved drops do not carry permission into the next turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: balooDeliveryPilot, isDrying: false }],
        hand: [arthurNoviceBlacksmith],
        inkwell: 3,
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(balooDeliveryPilot)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(1);
    expect(g.asPlayerOne().quest(balooDeliveryPilot)).not.toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(2);
  });

  it("player two needs their own current-turn drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 3 },
      {
        play: [{ card: balooDeliveryPilot, isDrying: false }],
        hand: [arthurNoviceBlacksmith],
        inkwell: 3,
        deck: 3,
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(balooDeliveryPilot)).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(arthurNoviceBlacksmith, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(balooDeliveryPilot)).toBeSuccessfulCommand();
    expect(g.getLore("player_two")).toBe(2);
    expect(g.getInkDrops("player_two")).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(0);
  });

  it("gaining a drop does not override Fresh Ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [balooDeliveryPilot, arthurNoviceBlacksmith], inkwell: 5, deck: 3 },
      { play: [{ card: dummyOpponent, exerted: true }], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(balooDeliveryPilot)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(0);
    expect(g.getInkDrops("player_one")).toBe(1);
    expect(g.asPlayerOne().quest(balooDeliveryPilot)).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().challenge(balooDeliveryPilot, dummyOpponent),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(balooDeliveryPilot)).toBe(false);
  });

  it("unpaid play rejects and normal inking grants no drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [balooDeliveryPilot],
      inkwell: 1,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(balooDeliveryPilot)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(balooDeliveryPilot)).toBe("hand");
    expect(
      g.asPlayerOne().putIntoInkwell("player_one", balooDeliveryPilot),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(2);
    expect(g.getInkDrops("player_one")).toBe(0);
  });
});
