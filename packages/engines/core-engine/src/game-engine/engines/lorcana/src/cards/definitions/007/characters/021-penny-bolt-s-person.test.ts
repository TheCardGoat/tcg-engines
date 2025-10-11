import { describe, expect, it } from "bun:test";
import { arielSingingMermaid } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { pennyBoltsPerson } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Penny - Bolt's Person", () => {
  describe("ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", () => {
    it("Heal and Resist", async () => {
      const testEngine = new TestEngine({
        inkwell: pennyBoltsPerson.cost,
        hand: [pennyBoltsPerson],
        play: [arielSingingMermaid],
      });

      const target = testEngine.getCardModel(arielSingingMermaid);
      target.updateCardDamage(2, "add");
      expect(target.meta.damage).toEqual(2);

      await testEngine.playCard(pennyBoltsPerson);
      await testEngine.acceptOptionalLayer();
      await testEngine.resolveTopOfStack({ targets: [target] });
      const cardUnderTest = testEngine.getCardModel(pennyBoltsPerson);

      expect(target.meta.damage).toEqual(0);
      expect(target.hasResist).toBe(true);
    });
  });
});
