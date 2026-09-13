import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { carlFredricksenOnTheMove } from "@tcg/lorcana-cards/cards/013";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

const movingPartner = createMockCharacter({
  id: "carl-moving-partner-ui-target",
  name: "Moving Partner",
  cost: 2,
});

const playedLocation = createMockLocation({
  id: "carl-moving-partner-ui-location",
  name: "Played Location",
  cost: 2,
  moveCost: 2,
});

describe("Carl Fredricksen - On the Move | MOVING PARTNER | UI prompt", () => {
  it("keeps the played location fixed and offers another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [playedLocation],
      inkwell: playedLocation.cost,
      play: [carlFredricksenOnTheMove, movingPartner],
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(playedLocation)).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine);
    const partnerId = testEngine.findCardInstanceId(movingPartner, "play");
    const locationId = testEngine.findCardInstanceId(playedLocation, "play");

    expect(snapshot?.prompt?.activeSlotIndex).toBe(0);
    expect(snapshot?.message).toBe("Choose the character to move.");
    expect(snapshot?.prompt?.candidateEntries.map((entry) => entry.cardId)).toEqual([partnerId]);
    expect(snapshot?.prompt?.slots[1]).toMatchObject({
      targetId: locationId,
      locked: true,
    });
  });
});
