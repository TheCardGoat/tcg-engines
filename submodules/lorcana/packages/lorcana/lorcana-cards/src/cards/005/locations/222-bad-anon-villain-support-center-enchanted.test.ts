import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { badanonVillainSupportCenterEnchanted } from "./222-bad-anon-villain-support-center-enchanted";

const ratiganHost = createMockCharacter({
  id: "badanon-enchanted-ratigan-host",
  name: "Ratigan",
  cost: 4,
  classifications: ["Storyborn", "Villain"],
});

const ratiganGuest = createMockCharacter({
  id: "badanon-enchanted-ratigan-guest",
  name: "Ratigan",
  cost: 5,
  classifications: ["Storyborn", "Villain"],
});

const nonVillainCharacter = createMockCharacter({
  id: "badanon-enchanted-non-villain",
  name: "Ratigan",
  cost: 3,
  classifications: ["Storyborn", "Hero"],
});

const differentNameVillain = createMockCharacter({
  id: "badanon-enchanted-different-name",
  name: "Maleficent",
  cost: 4,
  classifications: ["Storyborn", "Villain"],
});

describe("Bad-Anon - Villain Support Center (Enchanted)", () => {
  it("grants Villains here an ability to play a same-name character for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        badanonVillainSupportCenterEnchanted,
        { card: ratiganHost, atLocation: badanonVillainSupportCenterEnchanted },
      ],
      hand: [ratiganGuest],
      inkwell: 3,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(ratiganHost, {
        ability: "THERE'S NO ONE I'D RATHER BE THAN ME",
        targets: [ratiganGuest],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(ratiganGuest)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(ratiganHost)).toBe("play");
  });

  it("does not grant the ability to non-Villain characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        badanonVillainSupportCenterEnchanted,
        {
          card: nonVillainCharacter,
          atLocation: badanonVillainSupportCenterEnchanted,
        },
      ],
      hand: [ratiganGuest],
      inkwell: 3,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(nonVillainCharacter, {
        ability: "THERE'S NO ONE I'D RATHER BE THAN ME",
        targets: [ratiganGuest],
      }).success,
    ).toBe(false);
  });

  it("does not allow playing a character with a different name", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        badanonVillainSupportCenterEnchanted,
        { card: ratiganHost, atLocation: badanonVillainSupportCenterEnchanted },
      ],
      hand: [differentNameVillain],
      inkwell: 3,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(ratiganHost, {
        ability: "THERE'S NO ONE I'D RATHER BE THAN ME",
        targets: [differentNameVillain],
      }).success,
    ).toBe(false);
  });
});
