import { describe, expect, it } from "bun:test";
import { mickeyMouseDetective } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { mostEveryonesMadHere } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Most Everyone's Mad Here", () => {
  it("Gain lore equal to the damage on chosen character, then banish them.", async () => {
    const damagedCharacter = mickeyMouseDetective;

    const testEngine = new TestEngine(
      {
        inkwell: mostEveryonesMadHere.cost,
        hand: [mostEveryonesMadHere],
      },
      {
        play: [damagedCharacter],
      },
    );

    // Apply 3 damage to the character
    await testEngine.setCardDamage(damagedCharacter, 3);

    // Verify damage applied
    expect(testEngine.getCardModel(damagedCharacter).damage).toBe(3);

    // Verify initial lore
    expect(testEngine.getPlayerLore("player_one")).toBe(0);

    // Play the card
    await testEngine.playCard(mostEveryonesMadHere);

    // Resolve with damaged character as target
    await testEngine.resolveTopOfStack({ targets: [damagedCharacter] });

    // Verify lore gained equal to damage
    expect(testEngine.getPlayerLore("player_one")).toBe(3);

    // Verify character banished
    expect(testEngine.getZonesCardCount("player_two").play).toBe(0);
    expect(testEngine.getZonesCardCount("player_two").discard).toBe(1);
  });
});
