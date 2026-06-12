import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theSwordOfHerculesEnchanted } from "./240-the-sword-of-hercules-enchanted";

const deityTarget = createMockCharacter({
  id: "sword-of-hercules-enchanted-deity-target",
  name: "Deity Target",
  cost: 4,
  classifications: ["Storyborn", "Deity"],
});

const victoriousHero = createMockCharacter({
  id: "sword-of-hercules-enchanted-victorious-hero",
  name: "Victorious Hero",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const doomedInvader = createMockCharacter({
  id: "sword-of-hercules-enchanted-doomed-invader",
  name: "Doomed Invader",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("The Sword of Hercules (Enchanted)", () => {
  it("banishes the chosen opposing Deity character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theSwordOfHerculesEnchanted],
        inkwell: theSwordOfHerculesEnchanted.cost,
      },
      {
        play: [deityTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(theSwordOfHerculesEnchanted)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theSwordOfHerculesEnchanted, {
        targets: [deityTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(deityTarget)).toBe("discard");
  });

  it("gains 1 lore when one of your characters banishes another character in a challenge during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [theSwordOfHerculesEnchanted, victoriousHero],
      },
      {
        deck: 1,
        play: [{ card: doomedInvader, exerted: true, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(victoriousHero, doomedInvader),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });
});
