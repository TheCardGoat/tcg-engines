// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/05-cards-and-card-types.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, dinglehopper } from "@tcg/lorcana-cards/cards/001";

describe("#### 5. CARDS AND CARD TYPES", () => {
  //   # 5.5. Items
  //
  //   5.5.1. Items are a type of card that can be in play. An item is an item only while in the Play zone; in all other zones it's an item card.
  //   5.5.2. Items are generally played during a player's Main Phase (see 3.3).
  //   5.5.3. An item is defined as having "Item" on the classification line.
  //   5.5.4. If an item has an ability, that ability can be used during the turn the item is played.
  describe("# 5.5. Items", () => {
    it("5.5.2. Items are generally played during a player's Main Phase.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [dinglehopper],
        inkwell: dinglehopper.cost,
      });

      expect(testEngine.getCurrentPhase()).toBe("main");
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("hand");

      expect(testEngine.asPlayerOne().playCard(dinglehopper)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("play");
    });

    it('5.5.3. An item is defined as having "Item" on the classification line.', () => {
      expect(dinglehopper.cardType).toBe("item");
    });

    it("5.5.4. If an item has an ability, that ability can be used during the turn the item is played.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [dinglehopper],
        inkwell: dinglehopper.cost,
        play: [{ card: arielOnHumanLegs, damage: 1 }],
      });

      expect(testEngine.asPlayerOne().playCard(dinglehopper)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(1);

      const itemId = testEngine.asPlayerOne().getCard(dinglehopper).id;
      const targetId = testEngine.asPlayerOne().getCard(arielOnHumanLegs).id;
      const result = testEngine.executeMoveForView("playerOne", "activateAbility", {
        args: {
          cardId: itemId,
          abilityIndex: 0,
          targets: [targetId],
        },
      });

      expect(result).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(dinglehopper)).toBe(true);
      expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
