import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { danteEnthusiasticStray } from "./043-dante-enthusiastic-stray";
import { pepitaWatchfulAlebrije } from "./040-pepita-watchful-alebrije";

const boostedAlly = createMockCharacter({
  id: "dante-stray-boosted-ally",
  name: "Boosted Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const bystanderAlly = createMockCharacter({
  id: "dante-stray-bystander",
  name: "Bystander Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const strayCur = createMockCharacter({
  id: "dante-stray-cur",
  name: "Stray Cur",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Dante - Enthusiastic Stray", () => {
  it("stacks with printed Challenger for player two and expires without removing the printed bonus", () => {
    const defender = createMockCharacter({
      id: "dante-stack-defender",
      name: "Defender",
      cost: 2,
      strength: 0,
      willpower: 7,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: defender, exerted: true }], deck: 6 },
      { hand: [danteEnthusiasticStray], play: [pepitaWatchfulAlebrije], inkwell: 2, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(danteEnthusiasticStray)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerTwo()
        .resolvePendingByCard(danteEnthusiasticStray, { targets: [pepitaWatchfulAlebrije] }),
    ).toBeSuccessfulCommand();
    expect(engine.getKeywordValue(pepitaWatchfulAlebrije, "Challenger")).toBe(4);
    expect(engine.asPlayerTwo().getCard(pepitaWatchfulAlebrije).strength).toBe(2);
    expect(
      engine.asPlayerTwo().challenge(pepitaWatchfulAlebrije, defender),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(defender)).toBe(6);
    expect(engine.asPlayerOne().getCardZone(defender)).toBe("play");
    expect(engine.asPlayerTwo().getCard(pepitaWatchfulAlebrije).strength).toBe(2);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.getKeywordValue(pepitaWatchfulAlebrije, "Challenger")).toBe(2);
  });
  it("gives the chosen character Challenger +2 for the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [danteEnthusiasticStray],
      play: [boostedAlly],
      inkwell: danteEnthusiasticStray.cost,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(danteEnthusiasticStray, {
        targets: [boostedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(danteEnthusiasticStray, {
        targets: [boostedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(boostedAlly, "Challenger")).toBe(2);
  });

  it("does not boost characters that were not chosen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [danteEnthusiasticStray],
      play: [boostedAlly, bystanderAlly],
      inkwell: danteEnthusiasticStray.cost,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(danteEnthusiasticStray, {
        targets: [boostedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(danteEnthusiasticStray, {
        targets: [boostedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(bystanderAlly, "Challenger")).toBeNull();
  });

  it("lets the boosted character banish a 3-willpower defender it could not without the bonus", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [danteEnthusiasticStray],
        play: [{ card: boostedAlly, isDrying: false }],
        inkwell: danteEnthusiasticStray.cost,
        deck: 2,
      },
      {
        play: [{ card: strayCur, exerted: true }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(danteEnthusiasticStray, {
        targets: [boostedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(danteEnthusiasticStray, {
        targets: [boostedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().challenge(boostedAlly, strayCur)).toBeSuccessfulCommand();

    // 2 {S} + 2 Challenger = 4 damage ≥ 3 {W}.
    expect(testEngine.asPlayerTwo().getCardZone(strayCur)).toBe("discard");
  });

  it("the Challenger bonus expires at the end of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [danteEnthusiasticStray],
      play: [boostedAlly],
      inkwell: danteEnthusiasticStray.cost,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(danteEnthusiasticStray, {
        targets: [boostedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(danteEnthusiasticStray, {
        targets: [boostedAlly],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(boostedAlly, "Challenger")).toBe(2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(boostedAlly, "Challenger")).toBeNull();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(boostedAlly, "Challenger")).toBeNull();
  });
  it("can choose itself but does not remove drying", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [danteEnthusiasticStray],
      inkwell: danteEnthusiasticStray.cost,
      deck: [],
    });
    expect(engine.asPlayerOne().playCard(danteEnthusiasticStray)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(danteEnthusiasticStray, { targets: [danteEnthusiasticStray] }),
    ).toBeSuccessfulCommand();
    expect(engine.getKeywordValue(danteEnthusiasticStray, "Challenger")).toBe(2);
    expect(engine.asPlayerOne().quest(danteEnthusiasticStray)).not.toBeSuccessfulCommand();
  });

  it("allows an opposing character and expires before that character's turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [danteEnthusiasticStray], inkwell: danteEnthusiasticStray.cost, deck: 2 },
      { play: [strayCur], deck: 2 },
    );
    expect(engine.asPlayerOne().playCard(danteEnthusiasticStray)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(danteEnthusiasticStray, { targets: [strayCur] }),
    ).toBeSuccessfulCommand();
    expect(engine.getKeywordValue(strayCur, "Challenger")).toBe(2);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.getKeywordValue(strayCur, "Challenger")).toBeNull();
  });

  it("rejects an item without consuming the character choice", () => {
    const item = createMockItem({ id: "dante-invalid-item", name: "Item", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [danteEnthusiasticStray],
      play: [boostedAlly, item],
      inkwell: danteEnthusiasticStray.cost,
      deck: [],
    });
    expect(engine.asPlayerOne().playCard(danteEnthusiasticStray)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(danteEnthusiasticStray, { targets: [item] }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(danteEnthusiasticStray, { targets: [boostedAlly] }),
    ).toBeSuccessfulCommand();
    expect(engine.getKeywordValue(boostedAlly, "Challenger")).toBe(2);
  });
});
