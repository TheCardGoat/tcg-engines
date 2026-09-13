import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { dashParrSuperFast } from "./109-dash-parr-super-fast";

const topDeckCharacter = createMockCharacter({
  id: "dash-super-fast-top-character",
  name: "Top Deck Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const topDeckAction = createMockAction({
  id: "dash-super-fast-top-action",
  name: "Top Deck Action",
  cost: 1,
});

describe("Dash Parr - Super Fast", () => {
  it("has Shift 3, Evasive, and FOLLOW ME! triggered ability", () => {
    const abilities = dashParrSuperFast.abilities ?? [];
    expect(
      abilities.some(
        (a) => a.type === "keyword" && (a as { keyword?: string }).keyword === "Evasive",
      ),
    ).toBe(true);
    expect(
      abilities.some(
        (a) => a.type === "keyword" && (a as { keyword?: string }).keyword === "Shift",
      ),
    ).toBe(true);
    const followMe = abilities.find((a) => a.name === "FOLLOW ME!");
    expect(followMe).toBeDefined();
    expect(followMe?.type).toBe("triggered");
    expect((followMe as { trigger?: { event?: string } }).trigger?.event).toBe("quest");
  });

  it("FOLLOW ME!: may reveal and play the top card of the deck after questing", () => {
    // bugrepAtturKM9DdX4U88qdYWyH / bugrep2wZ5JJAZFbzy6Fv668paJ
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: dashParrSuperFast, isDrying: false }],
      deck: [topDeckCharacter],
      inkwell: topDeckCharacter.cost,
    });

    expect(testEngine.asPlayerOne().quest(dashParrSuperFast)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(dashParrSuperFast, {
        resolveOptional: true,
        choiceIndex: 0, // Play the revealed card
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(topDeckCharacter)).toBe("play");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("FOLLOW ME!: may put the revealed card into discard instead of playing it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: dashParrSuperFast, isDrying: false }],
      deck: [topDeckAction],
      inkwell: 5,
    });

    expect(testEngine.asPlayerOne().quest(dashParrSuperFast)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(dashParrSuperFast, {
        resolveOptional: true,
        choiceIndex: 1, // Put into discard
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(topDeckAction)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("FOLLOW ME!: optional can be declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: dashParrSuperFast, isDrying: false }],
      deck: [topDeckCharacter],
      inkwell: 5,
    });

    expect(testEngine.asPlayerOne().quest(dashParrSuperFast)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(dashParrSuperFast, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    // Declining leaves the top card on the deck (not revealed/played/milled).
    expect(testEngine.asPlayerOne().getCardZone(topDeckCharacter)).toBe("deck");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("FOLLOW ME!: planner has resolveBag candidates after quest (no freeze)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: dashParrSuperFast, isDrying: false }],
      deck: [topDeckCharacter],
      inkwell: topDeckCharacter.cost,
    });

    expect(testEngine.asPlayerOne().quest(dashParrSuperFast)).toBeSuccessfulCommand();

    const bagCandidates = testEngine
      .asPlayerOne()
      .enumerateAutomatedActions()
      .candidates.filter((candidate) => candidate.family === "resolveBag");

    expect(bagCandidates.length).toBeGreaterThan(0);
  });
});
