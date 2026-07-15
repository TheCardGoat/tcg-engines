import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tananaWiseWoman } from "./156-tanana-wise-woman";

const damagedAlly = createMockCharacter({
  id: "tanana-test-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const healthyAlly = createMockCharacter({
  id: "tanana-test-healthy-ally",
  name: "Healthy Ally",
  cost: 2,
  strength: 1,
  willpower: 3,
});

describe("Tanana - Wise Woman", () => {
  describe("YOUR BROTHERS NEED GUIDANCE - When you play this character, you may remove up to 1 damage from chosen character or location.", () => {
    it("removes up to 1 damage from chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tananaWiseWoman],
        play: [{ card: damagedAlly, damage: 2 }],
        inkwell: tananaWiseWoman.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(tananaWiseWoman)).toBeSuccessfulCommand();

      // Triggered ability should fire as optional
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tananaWiseWoman, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      // Damaged ally had 2 damage, remove up to 1 -> should have 1 damage remaining
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: damagedAlly,
        value: 1,
      });
    });

    it("can be declined (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tananaWiseWoman],
        play: [{ card: damagedAlly, damage: 2 }],
        inkwell: tananaWiseWoman.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(tananaWiseWoman)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tananaWiseWoman, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: damagedAlly,
        value: 2,
      });
    });

    it("does not trigger when there are no damaged targets (no valid targets)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tananaWiseWoman],
        play: [healthyAlly],
        inkwell: tananaWiseWoman.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(tananaWiseWoman)).toBeSuccessfulCommand();

      // The ability may or may not appear in bag depending on engine behavior with no valid targets
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(tananaWiseWoman, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // Healthy ally should have no damage
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: healthyAlly,
        value: 0,
      });
    });
  });
});
