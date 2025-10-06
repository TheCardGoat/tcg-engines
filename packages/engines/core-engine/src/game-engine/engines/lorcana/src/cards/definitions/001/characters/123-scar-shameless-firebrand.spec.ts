/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  chiefTui,
  drFacilierCharlatan,
  herculesTrueHero,
  scarShamelessFirebrand,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scar Shameless Firebrand", () => {
  it("ROUSING SPEECH effect- Ready All characters with cost 3 or less", () => {
    const testStore = new TestStore({
      inkwell: scarShamelessFirebrand.cost,
      play: [herculesTrueHero, stichtNewDog, drFacilierCharlatan],
      hand: [scarShamelessFirebrand],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      scarShamelessFirebrand.id,
    );
    const oneCostTarget = testStore.getByZoneAndId("play", herculesTrueHero.id);
    const twoCostTarget = testStore.getByZoneAndId("play", stichtNewDog.id);
    const threeCostTarget = testStore.getByZoneAndId(
      "play",
      drFacilierCharlatan.id,
    );
    oneCostTarget.updateCardMeta({ exerted: true });
    twoCostTarget.updateCardMeta({ exerted: true });
    threeCostTarget.updateCardMeta({ exerted: true });

    cardUnderTest.playFromHand();

    expect(testStore.getByZoneAndId("play", herculesTrueHero.id).meta).toEqual(
      expect.objectContaining({ exerted: false }),
    );
    expect(testStore.getByZoneAndId("play", stichtNewDog.id).meta).toEqual(
      expect.objectContaining({ exerted: false }),
    );
    expect(
      testStore.getByZoneAndId("play", drFacilierCharlatan.id).meta,
    ).toEqual(expect.objectContaining({ exerted: false }));
  });

  it("ROUSING SPEECH effect- Should Not Ready All characters with cost greater than 3", () => {
    const testStore = new TestStore({
      inkwell: scarShamelessFirebrand.cost,
      play: [chiefTui],
      hand: [scarShamelessFirebrand],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      scarShamelessFirebrand.id,
    );
    const target = testStore.getByZoneAndId("play", chiefTui.id);
    target.updateCardMeta({ exerted: true });

    cardUnderTest.playFromHand();

    expect(testStore.getByZoneAndId("play", chiefTui.id).meta).toEqual(
      expect.objectContaining({ exerted: true }),
    );
  });
});
