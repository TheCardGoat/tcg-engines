/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  drFacilierSavvyOpportunist,
  jafarRoyalVizier,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { peterPansDagger } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Peter Pan's Dagger", () => {
  it("[Native ability] Your characters with **Evasive** get +1 {S}.", () => {
    const testStore = new TestStore({
      play: [peterPansDagger, drFacilierSavvyOpportunist],
    });

    const target2 = testStore.getByZoneAndId(
      "play",
      drFacilierSavvyOpportunist.id,
    );

    [target2].forEach((card) => {
      expect(card.hasEvasive).toEqual(true);
      expect(card.strength).toEqual((card.lorcanitoCard?.strength || 0) + 1);
    });
  });

  it("[Gained ability] Your characters with **Evasive** get +1 {S}.", () => {
    const testStore = new TestStore({
      play: [peterPansDagger, jafarRoyalVizier],
    });

    const target = testStore.getByZoneAndId("play", jafarRoyalVizier.id);

    [target].forEach((card) => {
      expect(card.hasEvasive).toEqual(true);
      expect(target.strength).toEqual((card.lorcanitoCard?.strength || 0) + 1);
    });
  });
});
