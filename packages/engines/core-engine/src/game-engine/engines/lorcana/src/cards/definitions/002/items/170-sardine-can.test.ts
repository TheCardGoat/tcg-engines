/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  cruellaDeVilPerfectlyWretched,
  gastonIntellectualPowerhouse,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { sardineCan } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sardine Can", () => {
  it("**FLIGHT CABIN** Your exerted characters gain **Ward**. _(Opponents can’t choose them except to challenge.)_", () => {
    const testStore = new TestStore({
      play: [
        sardineCan,
        gastonIntellectualPowerhouse,
        cruellaDeVilPerfectlyWretched,
      ],
    });

    const target = testStore.getByZoneAndId(
      "play",
      gastonIntellectualPowerhouse.id,
    );
    const anotherTarget = testStore.getByZoneAndId(
      "play",
      cruellaDeVilPerfectlyWretched.id,
    );

    [target, anotherTarget].forEach((character) => {
      expect(character.hasWard).toBe(false);
    });

    [target, anotherTarget].forEach((character) => {
      character.updateCardMeta({ exerted: true });
      expect(character.hasWard).toBe(true);
    });
  });
});
