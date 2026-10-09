import { describe } from "vitest";
import { curseAmplification } from "./curse-amplification.ts";

import { proveChampionActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers x9z2k2a5ig-a1 */
describe("curseAmplification — named champion discount", () => {
  proveChampionActivationDiscount({ card: curseAmplification, discount: 3, lineageName: "Diana" });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers x9z2k2a5ig-a2 */
describe("Curse Amplification — damage threshold", () => {
  for (const matching of [false, true])
    for (const damage of [19, 20, 21])
      for (const response of [false, true])
        it(`checks twenty damage at resolution: Diana=${matching}, damage=${damage}, response=${response}`, () => {
          const base = enableAllTestElements(lineageTestChampion(matching ? "Diana" : "Other", 0));
          const face = requireSingleFace(base);
          const champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...face, stats: { ...face.stats, life: 30 } },
            },
          };
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [
                  curseAmplification,
                  sparkAlight,
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: Array.from({ length: damage }, () => woodlandSquirrels),
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(champion);
          for (const attacker of q.cards(woodlandSquirrels, { zone: "field" })) {
            q.declareAttack(attacker, hero);
            game.resolveCombatWithoutRetaliation();
          }
          advanceToMain(game, p.id);
          expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          p.activate(curseAmplification, { reservePayment: pay(matching ? 3 : 6) });
          expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
          if (response)
            p.activate(sparkAlight, {
              reservePayment: pay(2),
              targets: { "target-1": [hero.objectId] },
            });
          passEffectsStack(game);
          const total = damage + (response ? 2 : 0);
          expect(game.state.objects[hero.objectId]!.damage).toBe(total - (total >= 20 ? 4 : 0));
          expect(game.state.objects[foe.objectId]!.damage).toBe(0);
          expect(p.cards(curseAmplification, { zone: "graveyard" })).toHaveLength(1);
          expect(game.state.decision).toBeNull();
        });
});
