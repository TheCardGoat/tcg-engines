import { describe, expect, it } from "bun:test";
import {
  arielOnHumanLegs,
  arielSpectacularSinger,
  mickeyMouseTrueFriend,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { hadesFastTalker } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hades - Fast Talker", () => {
  describe("FOR JUST A LITTLE PAIN", () => {
    it("should banish a character with cost 3 or less when you deal damage to your own character", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: hadesFastTalker.cost,
          hand: [hadesFastTalker],
          play: [arielOnHumanLegs],
        },
        {
          play: [mickeyMouseTrueFriend, arielSpectacularSinger],
        },
      );

      await testEngine.playCard(hadesFastTalker);
      await testEngine.resolveOptionalAbility(true);
      await testEngine.resolveTopOfStack({ targets: [arielOnHumanLegs] }, true);
      await testEngine.resolveTopOfStack({ targets: [arielSpectacularSinger] });

      expect(testEngine.getCardsByZone("play", "player_one")).toHaveLength(2);
      expect(testEngine.getCardsByZone("discard", "player_two")).toHaveLength(
        1,
      );
      expect(testEngine.getCardModel(arielOnHumanLegs).damage).toBe(2);
    });

    it("should banish own character with cost 3 or less if it's the only valid target", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: hadesFastTalker.cost,
          hand: [hadesFastTalker],
          play: [mickeyMouseTrueFriend],
        },
        {
          play: [arielOnHumanLegs],
        },
      );

      await testEngine.playCard(hadesFastTalker);
      await testEngine.resolveOptionalAbility(true);
      await testEngine.resolveTopOfStack(
        { targets: [mickeyMouseTrueFriend] },
        true,
      );
      await testEngine.resolveTopOfStack({ targets: [arielOnHumanLegs] }, true);
      await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });

      expect(testEngine.getCardsByZone("play", "player_one")).toHaveLength(1);
      expect(testEngine.getCardsByZone("discard", "player_two")).toHaveLength(
        0,
      );
      expect(testEngine.getCardsByZone("discard", "player_one")).toHaveLength(
        1,
      );
    });
  });
});
