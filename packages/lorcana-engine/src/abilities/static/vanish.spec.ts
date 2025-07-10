/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import { rajahGhostlyTiger } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Vanish (When an opponent chooses this character for an action, banish them.)", () => {
  it("on action target", () => {
    const testStore = new TestEngine({
      play: [rajahGhostlyTiger],
    });
    expect(testStore).toBeDefined();
  });

  it("on non-action target", () => {
    const testStore = new TestEngine({
      play: [rajahGhostlyTiger],
    });
    expect(testStore).toBeDefined();
  });
});
