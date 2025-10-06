/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { jafarKeeperOfSecrets } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jafar - Keeper of Secrets", () => {
  it.skip("**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: jafarKeeperOfSecrets.cost,
      play: [jafarKeeperOfSecrets],
      hand: [jafarKeeperOfSecrets],
    });

    await testEngine.playCard(jafarKeeperOfSecrets);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
