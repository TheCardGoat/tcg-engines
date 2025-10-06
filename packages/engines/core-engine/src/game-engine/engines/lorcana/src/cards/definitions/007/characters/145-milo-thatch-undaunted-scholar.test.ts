/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { hakunaMatata } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import {
  beagleBoysSmalltimeCrooks,
  miloThatchUndauntedScholar,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";

describe("Milo Thatch - Undaunted Scholar", () => {
  it("I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: miloThatchUndauntedScholar.cost,
      play: [miloThatchUndauntedScholar, beagleBoysSmalltimeCrooks],
      hand: [hakunaMatata],
    });

    await testEngine.singSong({
      singer: beagleBoysSmalltimeCrooks,
      song: hakunaMatata,
    });

    console.log(JSON.stringify(testEngine.stackLayers));

    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({
      targets: [beagleBoysSmalltimeCrooks],
    });

    expect(testEngine.getCardModel(beagleBoysSmalltimeCrooks).strength).toBe(
      beagleBoysSmalltimeCrooks.strength + 2,
    );
  });
});
