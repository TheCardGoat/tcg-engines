import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { andysRoomHomeBase } from "./034-andys-room-home-base";

const soloCharacter = createMockCharacter({
  id: "andys-room-solo",
  name: "Solo Toy",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const secondCharacter = createMockCharacter({
  id: "andys-room-second",
  name: "Second Toy",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Andy's Room - Home Base", () => {
  it("ANDY'S FAVORITE - sole character here gets +2 willpower and +1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [andysRoomHomeBase, { card: soloCharacter, atLocation: andysRoomHomeBase }],
    });

    expect(testEngine.getCard(soloCharacter).willpower).toBe(soloCharacter.willpower + 2);
    expect(testEngine.getCard(soloCharacter).lore).toBe(soloCharacter.lore + 1);
  });

  it("ANDY'S FAVORITE - no bonus when two characters are here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        andysRoomHomeBase,
        { card: soloCharacter, atLocation: andysRoomHomeBase },
        { card: secondCharacter, atLocation: andysRoomHomeBase },
      ],
    });

    expect(testEngine.getCard(soloCharacter).willpower).toBe(soloCharacter.willpower);
    expect(testEngine.getCard(soloCharacter).lore).toBe(soloCharacter.lore);
    expect(testEngine.getCard(secondCharacter).willpower).toBe(secondCharacter.willpower);
    expect(testEngine.getCard(secondCharacter).lore).toBe(secondCharacter.lore);
  });

  it("ANDY'S FAVORITE - no bonus when no characters are here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [andysRoomHomeBase, soloCharacter],
    });

    // soloCharacter is in play but NOT at the location
    expect(testEngine.getCard(soloCharacter).willpower).toBe(soloCharacter.willpower);
    expect(testEngine.getCard(soloCharacter).lore).toBe(soloCharacter.lore);
  });
});
