import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { gyroGearlooseGadgetWhiz } from "./144-gyro-gearloose-gadget-whiz";

const discardItem = createMockItem({
  id: "gyro-discard-item",
  name: "Gyro's Spare Part",
  cost: 2,
});

const backupDeckCard = createMockAction({
  id: "gyro-backup-deck-card",
  name: "Backup Blueprint",
  cost: 1,
});

describe("Gyro Gearloose - Gadget Whiz", () => {
  it("puts a chosen item card from your discard on top of your deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gyroGearlooseGadgetWhiz],
      discard: [discardItem],
      deck: [backupDeckCard],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(gyroGearlooseGadgetWhiz, {
        targets: [discardItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(gyroGearlooseGadgetWhiz)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(discardItem)).toBe("deck");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardItem)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(backupDeckCard)).toBe("deck");
  });
});
