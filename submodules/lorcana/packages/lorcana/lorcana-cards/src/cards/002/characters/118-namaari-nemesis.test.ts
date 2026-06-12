import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { namaariNemesis } from "./118-namaari-nemesis";

const doomedTarget = createMockCharacter({
  id: "namaari-doomed-target",
  name: "Namaari Doomed Target",
  cost: 4,
});

describe("Namaari - Nemesis", () => {
  it("banishes itself to banish a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [namaariNemesis],
        deck: 1,
      },
      {
        play: [doomedTarget],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(namaariNemesis, {
        targets: [doomedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(namaariNemesis)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(doomedTarget)).toBe("discard");
  });
});
