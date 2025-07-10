/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { rayaGuidanceSeeker } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Raya - Guidance Seeker", () => {
  it.skip("A GREATER PURPOSE During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      inkwell: rayaGuidanceSeeker.cost,
      play: [rayaGuidanceSeeker],
      hand: [rayaGuidanceSeeker],
    });

    await testEngine.playCard(rayaGuidanceSeeker);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
