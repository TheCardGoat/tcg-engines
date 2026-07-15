import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { merlinsCottageTheWizardsHome } from "../locations";
import { retrosphere } from "./064-retrosphere";

describe("Retrosphere", () => {
  it("returns a chosen character, item, or location with cost 3 or less to that player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [],
        inkwell: 2,
        play: [retrosphere],
      },
      {
        deck: [],
        play: [merlinsCottageTheWizardsHome],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(retrosphere, {
        targets: [merlinsCottageTheWizardsHome],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(retrosphere)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(merlinsCottageTheWizardsHome)).toBe("hand");
  });
});
