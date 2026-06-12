import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { calhounMarineSergeant } from "./191-calhoun-marine-sergeant";
import { cheshireCatInexplicable } from "../../010/characters/060-cheshire-cat-inexplicable";

const damageSource = createMockCharacter({
  id: "calhoun-damage-source",
  name: "Damage Source",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const deckFiller = createMockCharacter({
  id: "calhoun-deck-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 2,
});

const doomedChallenger = createMockCharacter({
  id: "calhoun-doomed-challenger",
  name: "Doomed Challenger",
  cost: 2,
  strength: 2,
  willpower: 1,
});

describe("Calhoun - Marine Sergeant", () => {
  it("gains 2 lore when it banishes another character in a challenge during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [calhounMarineSergeant],
      },
      {
        play: [{ card: doomedChallenger, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(
      testEngine.asPlayerOne().challenge(calhounMarineSergeant, doomedChallenger),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(doomedChallenger)).toBe("discard");
    expect(testEngine.asPlayerOne().getDamage(calhounMarineSergeant)).toBe(1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });

  it("Resist +1 does not block incoming move-damage counters", () => {
    // Calhoun has Resist +1 — but Resist only reduces dealt damage, not moved damage counters.
    // Moving 1 counter to Calhoun should place exactly 1 damage on him regardless of Resist.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cheshireCatInexplicable],
        inkwell: 2,
        deck: [deckFiller],
      },
      {
        play: [{ card: damageSource, damage: 1 }, calhounMarineSergeant],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(cheshireCatInexplicable),
    ).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        resolveOptional: true,
        targets: [damageSource, calhounMarineSergeant],
        amount: 1,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(damageSource)).toBe(0);
    // Resist does not reduce moved counters — Calhoun has exactly 1 damage
    expect(testEngine.asPlayerTwo().getDamage(calhounMarineSergeant)).toBe(1);
  });
});
