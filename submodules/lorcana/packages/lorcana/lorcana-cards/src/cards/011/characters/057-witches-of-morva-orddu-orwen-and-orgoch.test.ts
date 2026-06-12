import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { witchesOfMorvaOrdduOrwenAndOrgoch } from "./057-witches-of-morva-orddu-orwen-and-orgoch";

const friendlyTarget = createMockCharacter({
  id: "witches-friendly-target",
  name: "Friendly Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Witches of Morva - Orddu, Orwen, and Orgoch", () => {
  it("may return another character of yours to your hand and gain 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: friendlyTarget, isDrying: false }],
      hand: [witchesOfMorvaOrdduOrwenAndOrgoch],
      inkwell: witchesOfMorvaOrdduOrwenAndOrgoch.cost,
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().playCard(witchesOfMorvaOrdduOrwenAndOrgoch),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(witchesOfMorvaOrdduOrwenAndOrgoch),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [friendlyTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(friendlyTarget)).toBe("hand");
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("does not gain lore if you decline the optional return", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: friendlyTarget, isDrying: false }],
      hand: [witchesOfMorvaOrdduOrwenAndOrgoch],
      inkwell: witchesOfMorvaOrdduOrwenAndOrgoch.cost,
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().playCard(witchesOfMorvaOrdduOrwenAndOrgoch),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(witchesOfMorvaOrdduOrwenAndOrgoch, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(friendlyTarget)).toBe("play");
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
  });

  it("does not gain lore when there is no other character of yours to return", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [witchesOfMorvaOrdduOrwenAndOrgoch],
      inkwell: witchesOfMorvaOrdduOrwenAndOrgoch.cost,
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().playCard(witchesOfMorvaOrdduOrwenAndOrgoch),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(witchesOfMorvaOrdduOrwenAndOrgoch),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
  });
});
