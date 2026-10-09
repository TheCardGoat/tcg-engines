import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { sacredBarrier } from "./sacred-barrier.ts";
import { pyroclasticFlow } from "../../MRC/actions/pyroclastic-flow.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers hYDqthNDpB-a1 */
describe("Sacred Barrier", () => {
  for (const expired of [false, true])
    it(`uses one non-combat prevention instance per ally, expired=${expired}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(sacredBarrier, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: expired ? "playerOne" : "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [giantTortoise],
            hand: [sacredBarrier, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise],
            hand: [
              pyroclasticFlow,
              pyroclasticFlow,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      if (!expired) q.pass();
      p.activate(sacredBarrier, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      if (expired) advanceToMain(game, q.id);
      else {
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
      }
      q.declareAttack(giantTortoise, p.card(giantTortoise));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe(1);
      for (let hit = 1; hit <= 2; hit++) {
        q.activate(q.cards(pyroclasticFlow, { zone: "hand" })[0]!, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        });
        passEffectsStack(game);
        for (const player of [p, q]) {
          expect(game.state.objects[player.card(champion).objectId]!.damage).toBe(2 * hit);
          expect(game.state.objects[player.card(giantTortoise).objectId]!.damage).toBe(
            (player.id === p.id ? 1 : 0) + (expired ? 2 * hit : 2 * (hit - 1)),
          );
        }
      }
    });
});
