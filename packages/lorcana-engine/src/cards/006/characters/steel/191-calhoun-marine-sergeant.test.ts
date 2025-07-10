import { describe, expect, it } from "@jest/globals";
import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { calhounMarineSergeant } from "@lorcanito/lorcana-engine/cards/006";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Calhoun - Marine Sergeant", () => {
  describe("**LEVEL UP** During your turn, whenever this character banishes another character in a challenge, gain 2 lore.", () => {
    it("should gain 2 lore when banishes another character in a challenge during your turn", () => {
      const testStore = new TestStore(
        {
          play: [calhounMarineSergeant],
        },
        {
          play: [goonsMaleficent],
        },
      );
      const attacker = testStore.getByZoneAndId(
        "play",
        calhounMarineSergeant.id,
      );
      const defender = testStore.getByZoneAndId(
        "play",
        goonsMaleficent.id,
        "player_two",
      );

      defender.updateCardMeta({ exerted: true });
      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
      attacker.challenge(defender);
      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(2);
      expect(defender.zone).toEqual("discard");
      expect(attacker.damage).toBe(1);
    });
  });
});
