import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { orbOfRegret } from "./orb-of-regret.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
/** @covers BY0E8si926-a1 */
describe("Orb of Regret exchanges only the chosen hand cards", () => {
  for (const count of [0, 1, 2, 3])
    it(`shuffles and replaces ${count} cards`, () => {
      const champion = createClassBonusTestChampion(orbOfRegret, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [orbOfRegret],
            hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 8 }, () => grayWolf),
          },
        },
        playerTwo: { champion, zones: { hand: [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hand = p.zone("hand").map((c) => c.objectId),
        selected = hand.slice(0, count);
      p.activateAbility(orbOfRegret, "BY0E8si926-a1");
      expect(p.cards(orbOfRegret, { zone: "banishment" })).toHaveLength(1);
      expect(p.zone("hand").map((c) => c.objectId)).toEqual(hand);
      passEffectsStack(game);
      const before = game.state;
      for (const ids of [hand, [q.card(woodlandSquirrels).objectId], [hand[0]!, hand[0]!]]) {
        expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
        expect(game.state).toEqual(before);
      }
      const history = game.state.eventHistory.length;
      answerDecision(game, "resolve-effect-choice", selected);
      passEffectsStack(game);
      expect(p.zone("hand")).toHaveLength(4);
      expect(p.zone("main-deck")).toHaveLength(8);
      for (const id of hand.slice(count)) expect(game.state.objects[id]!.zone).toBe("hand");
      const moves = game.state.eventHistory.slice(history).filter((e) => e.type === "object-moved");
      expect(
        moves
          .filter((e) => e.from === "hand" && e.to === "main-deck")
          .map((e) => e.objectId)
          .sort(),
      ).toEqual([...selected].sort());
      expect(moves.filter((e) => e.from === "main-deck" && e.to === "hand")).toHaveLength(count);
      expect(q.zone("hand")).toHaveLength(1);
    });
});
