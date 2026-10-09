import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckSavvyInvestor } from "./149-daisy-duck-savvy-investor";

const inkFodder = createMockCharacter({ id: "daisy-fodder", name: "Fodder", cost: 2 });

describe("Daisy Duck - Savvy Investor", () => {
  // CR 6.1.3.1 and 6.1.4: choose one own hand card at resolution,
  // or decline; the ability does not use the ordinary inkability restriction.
  it("rejects wrong-zone, opposing and multiple targets atomically and allows a valid retry", () => {
    const board = createMockCharacter({ id: "daisy-board", name: "Board", cost: 1 });
    const discarded = createMockItem({ id: "daisy-discard", name: "Discard", cost: 1 });
    const opposing = createMockItem({ id: "daisy-opposing", name: "Opposing", cost: 1 });
    const other = createMockCharacter({
      id: "daisy-other",
      name: "Other",
      cost: 1,
      inkable: false,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [daisyDuckSavvyInvestor, inkFodder, other],
        play: [board],
        discard: [discarded],
        inkwell: 3,
      },
      { hand: [opposing] },
    );
    expect(g.asPlayerOne().playCard(daisyDuckSavvyInvestor)).toBeSuccessfulCommand();
    const hand = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    for (const targets of [[board], [discarded], [opposing], [inkFodder, other]]) {
      expect(
        g
          .asPlayerOne()
          .resolvePendingByCard(daisyDuckSavvyInvestor, { resolveOptional: true, targets }),
      ).not.toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual(hand);
      expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    }
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(daisyDuckSavvyInvestor, { resolveOptional: true, targets: [other] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(daisyDuckSavvyInvestor, { resolveOptional: true, targets: [other] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(other)).toBe("inkwell");
    expect(g.asPlayerOne().isExerted(other)).toBe(true);
    expect(g.asPlayerOne().getCardZone(inkFodder)).toBe("hand");
    expect(g.asPlayerTwo().getCardZone(opposing)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(board)).toBe("play");
    expect(g.asPlayerOne().getCardZone(discarded)).toBe("discard");
  });

  it("Player Two inks only the selected duplicate instance and leaves both players' other cards unchanged", () => {
    const draw = createMockItem({ id: "daisy-draw", name: "Draw", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [inkFodder], deck: [draw, draw] },
      { hand: [daisyDuckSavvyInvestor, inkFodder, inkFodder], inkwell: 3, deck: [draw, draw] },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(daisyDuckSavvyInvestor)).toBeSuccessfulCommand();
    const ids = g
      .getCardInstanceIdsInZone("hand", PLAYER_TWO)
      .filter((id) => id !== g.findCardInstanceId(draw, "hand", PLAYER_TWO));
    expect(ids).toHaveLength(2);
    expect(
      g.asPlayerTwo().resolvePendingByCard(daisyDuckSavvyInvestor, {
        resolveOptional: true,
        targets: [ids[1]!],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(ids[0]!)).toBe("hand");
    expect(g.asPlayerTwo().getCardZone(ids[1]!)).toBe("inkwell");
    expect(g.asPlayerTwo().isExerted(ids[1]!)).toBe(true);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(4);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(1);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(0);
  });

  it("each played Daisy has its own choice, and playing another character does not trigger it", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daisyDuckSavvyInvestor, daisyDuckSavvyInvestor, inkFodder],
      inkwell: 8,
    });
    const [first, second] = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(first!)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(first!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(second!)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(second!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(inkFodder)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(8);
  });

  it("cannot be played for two ink and does not trigger on a failed play", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daisyDuckSavvyInvestor, inkFodder],
      inkwell: 2,
    });
    expect(g.asPlayerOne().playCard(daisyDuckSavvyInvestor)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(daisyDuckSavvyInvestor)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().getBagEffects()).toHaveLength(0);
  });
  it("may put a hand card into the inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daisyDuckSavvyInvestor, inkFodder],
      inkwell: daisyDuckSavvyInvestor.cost,
    });

    expect(testEngine.asPlayerOne().playCard(daisyDuckSavvyInvestor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(daisyDuckSavvyInvestor, {
        resolveOptional: true,
        targets: [inkFodder],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(inkFodder)).toBe("inkwell");
    expect(testEngine.asPlayerOne().isExerted(inkFodder)).toBe(true);
    expect(testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(4);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
  });

  it("declining keeps the hand card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daisyDuckSavvyInvestor, inkFodder],
      inkwell: daisyDuckSavvyInvestor.cost,
    });

    expect(testEngine.asPlayerOne().playCard(daisyDuckSavvyInvestor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(daisyDuckSavvyInvestor, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(inkFodder)).toBe("hand");
    expect(testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("can put a non-inkable card into the inkwell through Save for the Future", () => {
    const nonInkable = createMockCharacter({
      id: "daisy-non-inkable",
      name: "Non Inkable",
      cost: 1,
      inkable: false,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daisyDuckSavvyInvestor, nonInkable],
      inkwell: 3,
    });
    expect(g.asPlayerOne().playCard(daisyDuckSavvyInvestor)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(daisyDuckSavvyInvestor, {
        resolveOptional: true,
        targets: [nonInkable],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(nonInkable)).toBe("inkwell");
    expect(g.asPlayerOne().isExerted(nonInkable)).toBe(true);
  });

  it("can be played with no remaining hand card without adding ink or leaving a prompt", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daisyDuckSavvyInvestor],
      inkwell: 3,
    });
    expect(g.asPlayerOne().playCard(daisyDuckSavvyInvestor)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
    expect(g.asPlayerOne().getCardZone(daisyDuckSavvyInvestor)).toBe("play");
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().getBagEffects()).toHaveLength(0);
  });
});
