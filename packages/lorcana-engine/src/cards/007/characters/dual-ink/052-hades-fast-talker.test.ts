/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielOnHumanLegs,
  arielSpectacularSinger,
  mickeyMouseTrueFriend,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  annaIceBreaker,
  hadesFastTalker,
} from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
