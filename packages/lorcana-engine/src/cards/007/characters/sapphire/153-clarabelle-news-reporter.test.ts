/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { clarabelleNewsReporter } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Clarabelle - Journalist", () => {
  it.skip("SUPPORT (When this character is sent on an adventure, you can add its {S} to that of another character of your choice for the rest of this turn.)", async () => {
    const testEngine = new TestEngine({
      inkwell: clarabelleNewsReporter.cost,
      play: [clarabelleNewsReporter],
      hand: [clarabelleNewsReporter],
    });

    await testEngine.playCard(clarabelleNewsReporter);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("SCOOP Your other characters with Support gain +1 {S}.", async () => {
    const testEngine = new TestEngine({
      inkwell: clarabelleNewsReporter.cost,
      play: [clarabelleNewsReporter],
      hand: [clarabelleNewsReporter],
    });

    await testEngine.playCard(clarabelleNewsReporter);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
