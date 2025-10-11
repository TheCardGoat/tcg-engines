/**
 * @jest-environment node
 */

import { describe, it } from "bun:test";
import { flotsamUrsulaSpy } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Anna - Heir to Arendelle", () => {
  it("**DEXTEROUS LUNGE** Your characters named Jetsam gain **Rush.**", () => {
    const testStore = new TestStore({
      play: [flotsamUrsulaSpy],
    });
  });
});
