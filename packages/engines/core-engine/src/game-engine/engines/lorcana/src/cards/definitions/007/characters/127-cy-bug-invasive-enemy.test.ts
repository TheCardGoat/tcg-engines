/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { cybugInvasiveEnemy } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Cy-bug - Invasive Enemy", () => {
  it.skip("HIVE MIND This character gets +1 {S} for each other character you have in play.", async () => {
    const testEngine = new TestEngine({
      inkwell: cybugInvasiveEnemy.cost,
      play: [cybugInvasiveEnemy],
      hand: [cybugInvasiveEnemy],
    });

    await testEngine.playCard(cybugInvasiveEnemy);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
