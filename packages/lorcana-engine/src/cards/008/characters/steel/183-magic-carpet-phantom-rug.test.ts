/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { iagoGiantSpectralParrot } from "@lorcanito/lorcana-engine/cards/007";
import { magicCarpetPhantomRug } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Magic Carpet - Phantom Rug", () => {
  it("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: magicCarpetPhantomRug.cost,
      play: [magicCarpetPhantomRug],
      hand: [],
    });

    expect(testEngine.getCardModel(magicCarpetPhantomRug).hasVanish).toBe(true);
  });

  it("SPECTRAL FORCE Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)", async () => {
    const testEngine = new TestEngine({
      inkwell: magicCarpetPhantomRug.cost,
      play: [magicCarpetPhantomRug, iagoGiantSpectralParrot],
      hand: [],
    });

    expect(testEngine.getCardModel(iagoGiantSpectralParrot).hasChallenger).toBe(
      true,
    );
  });
});
