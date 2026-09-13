import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { harnessMana } from "./harness-mana.ts";

/** @covers G2XFRE8rFX-a2 */
describe("Harness Mana — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: harnessMana });
});

/** @covers G2XFRE8rFX-a1 */
describe("Harness Mana's chosen hand-to-memory movement", () => {
  for (const count of [0, 1, 3, 4])
    it(`puts exactly ${count} chosen cards into memory`, () => {
      const champion = createClassBonusTestChampion(harnessMana, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { hand: [harnessMana, ...Array.from({ length: 4 }, () => woodlandSquirrels)] },
        },
        playerTwo: { champion, zones: { hand: [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        ids = p.cards(woodlandSquirrels, { zone: "hand" }).map((c) => c.objectId);
      p.activate(harnessMana);
      expect(p.zone("memory")).toHaveLength(0);
      passEffectsStack(game);
      const before = game.state;
      expect(() =>
        answerDecision(game, "resolve-effect-choice", [q.card(woodlandSquirrels).objectId]),
      ).toThrow();
      expect(game.state).toEqual(before);
      expect(() => answerDecision(game, "resolve-effect-choice", [ids[0]!, ids[0]!])).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "resolve-effect-choice", ids.slice(0, count));
      passEffectsStack(game);
      expect(p.zone("memory").map((c) => c.objectId)).toEqual(ids.slice(0, count));
      expect(p.zone("hand").map((c) => c.objectId)).toEqual(ids.slice(count));
      expect(q.zone("hand")).toHaveLength(1);
    });
});
