/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { starkeyHooksHenchman } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Starkey - Hook's Henchman", () => {
  it("**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.", () => {
    const testStore = new TestStore({
      play: [starkeyHooksHenchman],
    });
  });
});
