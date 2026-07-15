import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { tianasPalaceJazzRestaurant } from "../locations";
import { wildcatsWrench } from "./031-wildcats-wrench";

describe("Wildcat's Wrench", () => {
  it("removes up to 2 damage from the chosen location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [wildcatsWrench, tianasPalaceJazzRestaurant],
    });

    testEngine.asServer().manualSetDamage(tianasPalaceJazzRestaurant, 3);
    expect(testEngine.asPlayerOne().getDamage(tianasPalaceJazzRestaurant)).toBe(3);

    const result = testEngine.asPlayerOne().activateAbility(wildcatsWrench, {
      ability: "REBUILD",
      targets: [tianasPalaceJazzRestaurant],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(wildcatsWrench)).toBe(true);
    expect(testEngine.asPlayerOne().getDamage(tianasPalaceJazzRestaurant)).toBe(1);
  });
});
