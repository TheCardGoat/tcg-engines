/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { starkeyHooksHenchman } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Starkey - Hook's Henchman", () => {
  it("**AYE AYE, CAPTAIN** While you have a Captain character in play, this character gets +1 {L}.", () => {
    const testStore = new TestStore({
      play: [starkeyHooksHenchman],
    });
  });
});
