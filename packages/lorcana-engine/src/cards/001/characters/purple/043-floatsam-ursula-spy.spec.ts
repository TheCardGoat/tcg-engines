/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { flotsamUrsulaSpy } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Anna - Heir to Arendelle", () => {
  it("**DEXTEROUS LUNGE** Your characters named Jetsam gain **Rush.**", () => {
    const testStore = new TestStore({
      play: [flotsamUrsulaSpy],
    });
  });
});
