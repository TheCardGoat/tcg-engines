import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  enqueueOwnCardTriggers,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { st03CharSZaku006 } from "./006-char-s-zaku.ts";

describe("Char's Zaku Ⅱ (ST03-006)", () => {
  describe("【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand.", () => {
    it("data encodes a top-3 Zeon/Neo Zeon Unit tutor", () => {
      const effect = st03CharSZaku006.effects?.[0];
      const directive = effect?.directives[0];

      expect(effect?.type).toBe("triggered");
      expect(effect?.activation.timing).toEqual(["destroyed"]);
      if (!directive || !("action" in directive)) throw new Error("Unexpected directive shape");
      expect(directive.action).toEqual({
        action: "lookAtTopDeck",
        count: 3,
        return: "chooseTop",
        tutorFilter: {
          owner: "friendly",
          cardType: "unit",
          attributeFilters: [
            {
              attribute: "or",
              filters: [
                { attribute: "trait", comparison: "includes", value: "zeon" },
                { attribute: "trait", comparison: "includes", value: "neo zeon" },
              ],
            },
          ],
        },
      });
    });

    it("tutors a matching Zeon Unit from the top 3 when destroyed", () => {
      const zeonUnit = createMockUnit({ traits: ["zeon"] });
      const nonMatch1 = createMockUnit({ traits: ["earth federation"] });
      const nonMatch2 = createMockUnit({ traits: [] });
      const engine = GundamTestEngine.create({
        play: [st03CharSZaku006],
        deck: [nonMatch1, zeonUnit, nonMatch2],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const handBefore = p1.getHand().length;

      engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
        enqueueOwnCardTriggers(
          G,
          { type: "unitDestroyed", cardId: zakuId, ownerId: PLAYER_ONE },
          zakuId,
          PLAYER_ONE,
          framework,
        );
      });
      expect(p1.getHand().length).toBe(handBefore + 1);
      expect(p1.getHand().some((id) => id.includes(`_${zeonUnit.cardNumber}_`))).toBe(true);
    });
  });
});
