import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { fairyGodmothersWand } from "../items/168-fairy-godmothers-wand";
import { soBeIt } from "./094-so-be-it";

describe("So Be It!", () => {
  it("buffs your characters and can banish a chosen item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [soBeIt],
        inkwell: soBeIt.cost,
        play: [simbaProtectiveCub],
      },
      {
        play: [fairyGodmothersWand],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(soBeIt, {
      resolveOptional: true,
      targets: [fairyGodmothersWand],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(simbaProtectiveCub)).toBe(3);
    expect(testEngine.asPlayerTwo().getCardZone(fairyGodmothersWand)).toBe("discard");
  });
});
