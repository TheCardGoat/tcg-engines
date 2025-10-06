/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { flotsamUrsulaSpy } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

describe("Anna - Heir to Arendelle", () => {
  it("**DEXTEROUS LUNGE** Your characters named Jetsam gain **Rush.**", () => {
    const testStore = new TestStore({
      play: [flotsamUrsulaSpy],
    });
  });
});
