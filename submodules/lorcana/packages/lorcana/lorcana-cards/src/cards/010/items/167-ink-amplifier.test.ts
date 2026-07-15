import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { friendsOnTheOtherSide } from "../../001/actions/064-friends-on-the-other-side";
import { inkAmplifier } from "./167-ink-amplifier";

describe("Ink Amplifier", () => {
  it("ENERGY CAPTURE - triggers when an opponent draws their second card during their turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [inkAmplifier],
        deck: 3,
      },
      {
        hand: [friendsOnTheOtherSide],
        inkwell: friendsOnTheOtherSide.cost,
        deck: 5,
      },
    );

    const inkwellBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;

    // P1 passes to let P2 take their turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // P2's turn: mandatory draw (1st draw of turn), then plays Friends on the Other Side
    // Friends draws 2 cards; the first drawn card is the 2nd of the turn → triggers Ink Amplifier
    expect(testEngine.asPlayerTwo().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

    // P1 should have a bag effect from Ink Amplifier
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(inkwellBefore + 1);
  });

  it("ENERGY CAPTURE - does NOT trigger on the opponent's first draw (mandatory turn draw)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [inkAmplifier],
        deck: 3,
      },
      {
        deck: 5,
      },
    );

    // P1 passes to let P2 take their turn (mandatory draw only — no card played)
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // P2 draws their mandatory card (1st draw) — should NOT trigger Ink Amplifier
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("regression: the ink added to inkwell is actually counted as available ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [inkAmplifier],
        deck: 3,
        inkwell: 0,
      },
      {
        hand: [friendsOnTheOtherSide],
        inkwell: friendsOnTheOtherSide.cost,
        deck: 5,
      },
    );

    const inkwellBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;
    expect(inkwellBefore).toBe(0);

    // P1 passes to let P2 take their turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // P2 plays Friends on the Other Side (draws 2 cards, second draw triggers Ink Amplifier)
    expect(testEngine.asPlayerTwo().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolveBag(bagEffect!.id, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // Inkwell should have increased by 1
    expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(inkwellBefore + 1);
  });

  it("ENERGY CAPTURE - does NOT trigger when the controller draws their own cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [inkAmplifier],
      hand: [friendsOnTheOtherSide],
      inkwell: friendsOnTheOtherSide.cost,
      deck: 5,
    });

    // P1 plays Friends on the Other Side on their own turn — draws 2 cards
    expect(testEngine.asPlayerOne().playCard(friendsOnTheOtherSide)).toBeSuccessfulCommand();

    // Ink Amplifier only triggers for opponent draws, not controller's own draws
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
