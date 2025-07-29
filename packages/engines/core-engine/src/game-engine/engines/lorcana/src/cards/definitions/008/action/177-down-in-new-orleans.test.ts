/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { mickeyMouseMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  mammaOdieLoneSage,
  sugarRushSpeedwayFinishLine,
} from "@lorcanito/lorcana-engine/cards/006";
import {
  downInNewOrleans,
  khanWarHorse,
  lightTheFuse,
  mickeyMouseGiantMouse,
  stoppedChaosInItsTracks,
  televisionSet,
  tianaNaturalTalent,
  walkThePlank,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Down In New Orleans", () => {
  it("Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: downInNewOrleans.cost,
      hand: [downInNewOrleans],
      deck: [khanWarHorse, televisionSet, sugarRushSpeedwayFinishLine],
    });

    await testEngine.playCard(downInNewOrleans, {
      scry: {
        play: [sugarRushSpeedwayFinishLine],
        bottom: [khanWarHorse, televisionSet],
      },
    });

    expect(testEngine.getCardModel(khanWarHorse).zone).toBe("deck");
    expect(testEngine.getCardModel(televisionSet).zone).toBe("deck");
    expect(testEngine.getCardModel(sugarRushSpeedwayFinishLine).zone).toBe(
      "play",
    );
  });

  it("Playing a character", async () => {
    const testEngine = new TestEngine({
      inkwell: downInNewOrleans.cost,
      hand: [downInNewOrleans],
      deck: [khanWarHorse, televisionSet, sugarRushSpeedwayFinishLine],
    });

    await testEngine.playCard(downInNewOrleans, {
      scry: {
        play: [khanWarHorse],
        bottom: [sugarRushSpeedwayFinishLine, televisionSet],
      },
    });

    expect(testEngine.getCardModel(khanWarHorse).zone).toBe("play");
    expect(testEngine.getCardModel(khanWarHorse).ready).toBe(true);
  });
});

describe("Regression tests", () => {
  it("Should not crash when playing Down In New Orleans with no valid cards", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: downInNewOrleans.cost,
        hand: [downInNewOrleans],
        play: [tianaNaturalTalent, mammaOdieLoneSage],
        deck: [lightTheFuse, walkThePlank, stoppedChaosInItsTracks],
      },
      {
        play: [mickeyMouseMusketeer, mickeyMouseGiantMouse],
      },
    );

    await testEngine.playCard(downInNewOrleans);

    // expect(testEngine.stackLayers).toHaveLength(3);
    // await testEngine.acceptOptionalLayerBySource({
    //   skipAssertion: true,
    //   source: tianaNaturalTalent,
    // });
    // expect(testEngine.stackLayers).toHaveLength(3);
    // await testEngine.acceptOptionalLayerBySource({
    //   skipAssertion: true,
    //   source: mammaOdieLoneSage,
    // });
    expect(testEngine.stackLayers).toHaveLength(3);
    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.stackLayers.find(
          (layer) =>
            layer.source.name.toLowerCase() ===
            "Down In New Orleans".toLowerCase(),
        )?.id,
        scry: {
          play: [],
          bottom: [lightTheFuse, walkThePlank, stoppedChaosInItsTracks],
        },
      },
      true,
    );
    expect(testEngine.stackLayers).toHaveLength(2);

    expect(testEngine.getCardModel(lightTheFuse).zone).toBe("deck");
    expect(testEngine.getCardModel(walkThePlank).zone).toBe("deck");
    expect(testEngine.getCardModel(stoppedChaosInItsTracks).zone).toBe("deck");
  });
});
