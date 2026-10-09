import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { resist } from "../../../helpers/abilities";
import { healingGlow } from "../../001/actions/028-healing-glow";
import { marieCaughtInTheAct } from "./187-marie-caught-in-the-act";
import { fireTheCannons } from "../../001/actions/197-fire-the-cannons";

const victim = createMockCharacter({
  id: "marie-victim",
  name: "Victim",
  cost: 2,
  strength: 1,
  willpower: 9,
});

describe("Marie - Caught in the Act", () => {
  it("quests for no bonus ink drop when no opposing character took damage this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [marieCaughtInTheAct, fireTheCannons],
        inkwell: marieCaughtInTheAct.cost + fireTheCannons.cost,
      },
      { play: [{ card: victim, exerted: true }] },
    );

    expect(testEngine.asPlayerOne().playCard(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("grants 1 ink drop on quest after an opposing character took damage this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [marieCaughtInTheAct, fireTheCannons],
        inkwell: marieCaughtInTheAct.cost + fireTheCannons.cost,
      },
      { play: [{ card: victim, exerted: true }] },
    );

    // Turn 1: deploy Marie only.
    expect(testEngine.asPlayerOne().playCard(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Turn 2: fresh damage on an opposing character, then the dry Marie quests.
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(victim)).toBe(2);
  });

  it("old marked damage alone does not qualify this turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: marieCaughtInTheAct, isDrying: false }], deck: 3 },
      { play: [{ card: victim, damage: 2 }], deck: 3 },
    );
    expect(g.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.getLore("player_one")).toBe(1);
    expect(g.asPlayerTwo().getDamage(victim)).toBe(2);
  });

  it("friendly-only damage does not qualify", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marieCaughtInTheAct, isDrying: false }, victim],
        hand: [fireTheCannons],
        inkwell: 1,
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(fireTheCannons, { targets: [victim] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(victim)).toBe(2);
    expect(g.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.getLore("player_one")).toBe(1);
  });

  it("damage that banishes an opposing character still qualifies", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marieCaughtInTheAct, isDrying: false }],
        hand: [fireTheCannons],
        inkwell: 1,
        deck: 3,
      },
      { play: [{ card: victim, damage: 7 }], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(fireTheCannons, { targets: [victim] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(victim)).toBe("discard");
    expect(g.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(1);
    expect(g.getLore("player_one")).toBe(1);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("damage history resets on the next turn even when damage stays marked", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marieCaughtInTheAct, isDrying: false }],
        hand: [fireTheCannons],
        inkwell: 1,
        deck: 3,
      },
      { play: [victim], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(fireTheCannons, { targets: [victim] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(1);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(1);
    expect(g.getLore("player_one")).toBe(2);
    expect(g.asPlayerTwo().getDamage(victim)).toBe(2);
  });

  it("fully prevented damage does not qualify", () => {
    const shield = createMockCharacter({
      id: "marie-resist",
      name: "Resist target",
      cost: 1,
      willpower: 3,
      abilities: [resist(2)],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marieCaughtInTheAct, isDrying: false }],
        hand: [fireTheCannons],
        inkwell: 1,
        deck: 3,
      },
      { play: [shield], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(fireTheCannons, { targets: [shield] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(shield)).toBe(0);
    expect(g.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(0);
  });

  it("healing damage does not erase that it was taken this turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marieCaughtInTheAct, isDrying: false }],
        hand: [fireTheCannons, healingGlow],
        inkwell: 2,
        deck: 3,
      },
      { play: [victim], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(fireTheCannons, { targets: [victim] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(healingGlow, { targets: [victim] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(victim)).toBe(0);
    expect(g.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(1);
  });

  it("player two receives only their own quest reward", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [victim], deck: 3 },
      {
        play: [{ card: marieCaughtInTheAct, isDrying: false }],
        hand: [fireTheCannons],
        inkwell: 1,
        deck: 3,
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(fireTheCannons, { targets: [victim] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_two")).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.getLore("player_two")).toBe(1);
  });

  it("each Marie quests for one reward after the same opposing damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: marieCaughtInTheAct, isDrying: false },
          { card: marieCaughtInTheAct, isDrying: false },
        ],
        hand: [fireTheCannons],
        inkwell: 1,
        deck: 3,
      },
      { play: [victim], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(fireTheCannons, { targets: [victim] })).toBeSuccessfulCommand();
    for (const id of g.getCardInstanceIdsInZone("play", "player_one")) {
      expect(g.asPlayerOne().quest(id)).toBeSuccessfulCommand();
    }
    expect(g.getInkDrops("player_one")).toBe(2);
    expect(g.getLore("player_one")).toBe(2);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("paid entry cannot quest while fresh and next-turn quest gains no drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [marieCaughtInTheAct], inkwell: 1, deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(0);
    expect(g.asPlayerOne().quest(marieCaughtInTheAct)).not.toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(marieCaughtInTheAct)).toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(0);
  });

  it("unpaid entry rejects and inking grants no drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [marieCaughtInTheAct],
      inkwell: 0,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(marieCaughtInTheAct)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(marieCaughtInTheAct)).toBe("hand");
    expect(
      g.asPlayerOne().putIntoInkwell("player_one", marieCaughtInTheAct),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
});
