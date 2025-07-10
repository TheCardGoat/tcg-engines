/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  moanaOfMotunui,
  zeusGodOfLightning,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Rush keyword", () => {
  it("Can challenge with fresh ink", () => {
    const testStore = new TestStore(
      {
        inkwell: zeusGodOfLightning.cost,
        hand: [zeusGodOfLightning],
      },
      {
        play: [moanaOfMotunui],
      },
    );

    const attacker = testStore.getByZoneAndId("hand", zeusGodOfLightning.id);
    testStore.store.playCardFromHand(attacker.instanceId);

    const defender = testStore.getByZoneAndId(
      "play",
      moanaOfMotunui.id,
      "player_two",
    );
    defender.updateCardMeta({ exerted: true });

    attacker.challenge(defender);

    expect(attacker.meta.damage).toEqual(1);
    expect(defender.meta.damage).toEqual(4);
  });
});
