import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { fightForTheCrown } from "./fight-for-the-crown.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 1lij42a9sh-a1 */
describe("Fight for the Crown — each controller sacrifices their own ally", () => {
  for (const enemyAllies of [0, 2])
    it(`resolves with ${enemyAllies} opposing allies`, () => {
      const champion = createClassBonusTestChampion(fightForTheCrown, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [fightForTheCrown, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            field: [woodlandSquirrels, giantTortoise, trainingSword],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [trainingSword, ...(enemyAllies ? [woodlandSquirrels, giantTortoise] : [])],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const selected = new Set<string>();
      p.activate(fightForTheCrown, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      expect(p.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
      passEffectsStack(game);
      for (let step = 0; game.state.decision && step < 4; step++) {
        const decision = game.state.decision;
        if (decision.kind !== "resolve-effect-choice")
          throw new Error(`Unexpected ${decision.kind}`);
        const chooser = game.player(decision.playerId),
          other = chooser.id === p.id ? q : p;
        const before = game.state;
        for (const invalid of [
          chooser.card(champion),
          chooser.card(trainingSword),
          ...other.cards(woodlandSquirrels, { zone: "field" }),
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
          expect(game.state).toEqual(before);
        }
        const ally = chooser.card(woodlandSquirrels, { zone: "field" });
        selected.add(chooser.id);
        answerDecision(game, "resolve-effect-choice", [ally.objectId]);
        passEffectsStack(game);
      }
      expect(game.state.stack).toHaveLength(0);
      expect(selected).toEqual(new Set(enemyAllies ? [p.id, q.id] : [p.id]));
      expect(p.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
      expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(enemyAllies ? 1 : 0);
      expect(p.cards(giantTortoise, { zone: "field" })).toHaveLength(1);
      expect(q.cards(giantTortoise, { zone: "field" })).toHaveLength(enemyAllies ? 1 : 0);
      expect(p.cards(trainingSword, { zone: "field" })).toHaveLength(1);
      expect(q.cards(trainingSword, { zone: "field" })).toHaveLength(1);
    });
});
