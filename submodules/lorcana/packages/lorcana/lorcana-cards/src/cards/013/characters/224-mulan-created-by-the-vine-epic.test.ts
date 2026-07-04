import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { mulanCreatedByTheVineEpic } from "./224-mulan-created-by-the-vine-epic";

const floodbornAlly = createMockCharacter({
  id: "mulan-created-epic-floodborn-ally",
  name: "Floodborn Ally",
  cost: 2,
  classifications: ["Floodborn", "Ally"],
});

const targetItem = createMockItem({
  id: "mulan-created-epic-target-item",
  name: "Target Item",
  cost: 1,
});

describe("Mulan - Created by the Vine - Epic", () => {
  it("may banish a chosen item when you play a Floodborn character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mulanCreatedByTheVineEpic, targetItem],
      hand: [floodbornAlly],
      inkwell: floodbornAlly.cost,
      deck: 3,
    });

    expect(testEngine.asPlayerOne().playCard(floodbornAlly)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mulanCreatedByTheVineEpic, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [targetItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(targetItem)).toBe("discard");
  });
});
