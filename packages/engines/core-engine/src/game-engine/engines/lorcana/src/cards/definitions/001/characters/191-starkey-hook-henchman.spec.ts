/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { starkeyHooksHenchman } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Starkey - Hook's Henchman", () => {
  it("**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.", () => {
    const testStore = new TestStore({
      play: [starkeyHooksHenchman],
    });
  });
});
