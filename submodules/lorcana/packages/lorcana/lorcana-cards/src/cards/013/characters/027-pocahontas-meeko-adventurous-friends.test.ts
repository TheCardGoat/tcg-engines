import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pocahontasMeekoAdventurousFriends } from "./027-pocahontas-meeko-adventurous-friends";

const pocahontasShiftBase = createMockCharacter({
  id: "pocahontas-meeko-shift-base",
  name: "Pocahontas",
  cost: 2,
});

const costOneInPlay = createMockCharacter({
  id: "pocahontas-meeko-cost-one-in-play",
  name: "Cost One In Play",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const costOneInHand = createMockCharacter({
  id: "pocahontas-meeko-cost-one-in-hand",
  name: "Cost One In Hand",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Pocahontas & Meeko - Adventurous Friends", () => {
  it("can shift onto a character named Pocahontas and has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pocahontasMeekoAdventurousFriends],
      play: [pocahontasShiftBase],
      inkwell: 2,
    });
    const shiftTarget = testEngine.findCardInstanceId(pocahontasShiftBase, "play", "player_one");

    expect(
      testEngine.asPlayerOne().playCard(pocahontasMeekoAdventurousFriends, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(pocahontasMeekoAdventurousFriends)).toBe("play");
    expect(testEngine.asPlayerOne().hasKeyword(pocahontasMeekoAdventurousFriends, "Evasive")).toBe(
      true,
    );
  });

  it("may return your cost 1 character and then play a cost 1 character for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pocahontasMeekoAdventurousFriends, costOneInPlay],
      hand: [costOneInHand],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().quest(pocahontasMeekoAdventurousFriends),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pocahontasMeekoAdventurousFriends, {
        resolveOptional: true,
        targets: [costOneInPlay],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pocahontasMeekoAdventurousFriends, {
        resolveOptional: true,
        targets: [costOneInHand],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(costOneInPlay)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(costOneInHand)).toBe("play");
  });
});
