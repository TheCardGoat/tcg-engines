import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { baubleOfScarcity } from "./bauble-of-scarcity.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 24ansclpqc-a1 */
describe("Bauble of Scarcity — banish cost and each player's discard", () => {
  for (const empty of [false, true])
    it(`resolves with opponent hand empty=${empty}`, () => {
      const champion = createClassBonusTestChampion(baubleOfScarcity, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [baubleOfScarcity],
            hand: [woodlandSquirrels, giantTortoise],
            memory: [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: empty ? [] : [woodlandSquirrels, giantTortoise],
            memory: [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(baubleOfScarcity);
      const originalMemory = [p.zone("memory"), q.zone("memory")];
      p.activateAbility(source, "24ansclpqc-a1");
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(p.zone("hand")).toHaveLength(2);
      passEffectsStack(game);
      const players = new Set<string>();
      for (let step = 0; game.state.decision && step < 4; step++) {
        const decision = game.state.decision;
        if (decision.kind !== "resolve-effect-choice")
          throw new Error(`Unexpected ${decision.kind}`);
        const chooser = game.player(decision.playerId),
          other = chooser.id === p.id ? q : p;
        const before = game.state;
        for (const invalid of [
          chooser.card(woodlandSquirrels, { zone: "memory" }),
          ...other.cards(woodlandSquirrels, { zone: "hand" }),
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
          expect(game.state).toEqual(before);
        }
        players.add(chooser.id);
        answerDecision(game, "resolve-effect-choice", [
          chooser.card(woodlandSquirrels, { zone: "hand" }).objectId,
        ]);
        passEffectsStack(game);
      }
      expect(players).toEqual(new Set(empty ? [p.id] : [p.id, q.id]));
      expect(p.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
      expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(empty ? 0 : 1);
      expect(p.cards(giantTortoise, { zone: "hand" })).toHaveLength(1);
      expect(q.cards(giantTortoise, { zone: "hand" })).toHaveLength(empty ? 0 : 1);
      expect([p.zone("memory"), q.zone("memory")]).toEqual(originalMemory);
      expect(game.state.stack).toHaveLength(0);
      expect(() => p.activateAbility(source, "24ansclpqc-a1")).toThrow();
    });
});
