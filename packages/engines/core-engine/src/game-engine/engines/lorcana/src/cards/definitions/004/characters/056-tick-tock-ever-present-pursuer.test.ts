/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { ticktockEverpresentPursuer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Tick-Tock - Ever-Present Pursuer", () => {
  it("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
    const testStore = new TestStore({
      play: [ticktockEverpresentPursuer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      ticktockEverpresentPursuer.id,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
