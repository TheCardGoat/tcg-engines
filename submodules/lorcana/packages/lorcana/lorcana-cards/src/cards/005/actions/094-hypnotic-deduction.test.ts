import { describe, expect, it } from "bun:test";
import { PLAYER_ONE, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  breakFree,
  evilComesPrepared,
  gatheringKnowledgeAndWisdom,
  youreWelcome,
} from "../actions";
import { hypnoticDeduction } from "./094-hypnotic-deduction";

describe("Hypnotic Deduction", () => {
  it("draws 3 cards and puts 2 chosen cards from your hand on top of your deck in the chosen order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hypnoticDeduction],
      inkwell: hypnoticDeduction.cost,
      deck: [gatheringKnowledgeAndWisdom, youreWelcome, evilComesPrepared, breakFree],
    });

    expect(testEngine.asPlayerOne().playCard(hypnoticDeduction)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(hypnoticDeduction, {
        targets: [youreWelcome, breakFree],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      gatheringKnowledgeAndWisdom.id,
      youreWelcome.id,
      breakFree.id,
    ]);
    expect(testEngine.asPlayerOne().getCardZone(evilComesPrepared)).toBe("hand");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 3, discard: 1 });
  });
});
