import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mysticalTreeMamaOdiesHome } from "./069-mystical-tree-mama-odies-home";

const damagedResident = createMockCharacter({
  id: "mystical-tree-resident",
  name: "Mystical Tree Resident",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const opposingTarget = createMockCharacter({
  id: "mystical-tree-opponent",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const mamaOdie = createMockCharacter({
  id: "mystical-tree-mama-odie",
  name: "Mama Odie",
  cost: 4,
});

describe("Mystical Tree - Mama Odie's Home", () => {
  it("moves 1 damage from your character here to a chosen opposing character at the start of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          mysticalTreeMamaOdiesHome,
          { card: damagedResident, atLocation: mysticalTreeMamaOdiesHome, damage: 2 },
        ],
        deck: 1,
      },
      {
        play: [opposingTarget],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    // Board-state condition is checked at trigger time. HARD-EARNED WISDOM condition (Mama Odie here)
    // is not met, so it's NOT enqueued. Only NOT BAD is in the bag.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    const notBadBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((bag) => (bag.payload as { abilityId?: string }).abilityId === "4wd-1");
    expect(notBadBag).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolveBag(notBadBag!.id, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [damagedResident, opposingTarget] })
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().getCard(damagedResident)?.damage).toBe(1);
    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.damage).toBe(1);
  });

  it("gains 1 lore at the start of your turn if Mama Odie is here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          mysticalTreeMamaOdiesHome,
          { card: mamaOdie, atLocation: mysticalTreeMamaOdiesHome },
        ],
        deck: 1,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    const loreBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((bag) => (bag.payload as { abilityId?: string }).abilityId === "4wd-2");
    expect(loreBag).toBeDefined();
    expect(testEngine.asPlayerOne().resolveBag(loreBag!.id).success).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
