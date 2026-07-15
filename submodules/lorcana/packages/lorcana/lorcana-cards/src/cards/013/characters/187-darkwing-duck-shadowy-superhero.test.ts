import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { darkwingDuckShadowySuperhero } from "./187-darkwing-duck-shadowy-superhero";

const damageTarget = createMockCharacter({
  id: "darkwing-shadowy-damage-target",
  name: "Damage Target",
  cost: 2,
  willpower: 3,
});

describe("Darkwing Duck - Shadowy Superhero", () => {
  it("may deal 1 damage to a chosen character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [darkwingDuckShadowySuperhero],
      inkwell: darkwingDuckShadowySuperhero.cost,
      play: [damageTarget],
    });

    expect(testEngine.asPlayerOne().playCard(darkwingDuckShadowySuperhero)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingDuckShadowySuperhero, {
        resolveOptional: true,
        targets: [damageTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damageTarget)).toBe(1);
  });
});
