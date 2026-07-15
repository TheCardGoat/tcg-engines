import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { ratCaponeRodentGangster } from "./183-rat-capone-rodent-gangster";

describe("Rat Capone - Rodent Gangster", () => {
  it("While this character has no damage, he gets +3 strength.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ratCaponeRodentGangster],
    });

    const capone = testEngine.getCard(ratCaponeRodentGangster);
    expect(capone.strength).toBe(ratCaponeRodentGangster.strength + 3);
  });

  it("While this character has damage, he doesn't get +3 strength.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ratCaponeRodentGangster],
    });

    testEngine.asServer().manualSetDamage(ratCaponeRodentGangster, 1);

    const capone = testEngine.getCard(ratCaponeRodentGangster);
    expect(capone.strength).toBe(ratCaponeRodentGangster.strength);
  });
});
