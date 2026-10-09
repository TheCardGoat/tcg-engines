import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { aeneanCyclicWinds } from "./aenean-cyclic-winds.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { blissfulCalling } from "../../DOA/actions/blissful-calling.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 3GjTPUfsp3-a1
 * @covers 3GjTPUfsp3-a2 */
describe("Aenean Cyclic Winds", () => {
  for (const level of [2, 3, 4])
    for (const matching of [false, true])
      it(`returns an owned graveyard Spell at level=${level}, matching=${matching}`, () => {
        const champion = grantTestChampionLevel(
            createClassBonusTestChampion(aeneanCyclicWinds, matching, "activation-discount"),
            level,
          ),
          cost = matching && level >= 3 ? 3 : 5;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [aeneanCyclicWinds, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
              graveyard: [fireball, blissfulCalling],
            },
          },
          playerTwo: { champion, zones: { graveyard: [fireball] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = p.card(fireball, { zone: "graveyard" });
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const options = { reservePayment, targets: { "target-card": [target.objectId] } },
          before = game.state;
        expect(() =>
          p.activate(aeneanCyclicWinds, { ...options, reservePayment: reservePayment.slice(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        for (const ref of [q.card(fireball), p.card(blissfulCalling), p.card(champion)]) {
          expect(() =>
            p.activate(aeneanCyclicWinds, {
              reservePayment,
              targets: { "target-card": [ref.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(aeneanCyclicWinds, options);
        expect(p.zone("memory")).toHaveLength(cost);
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        passEffectsStack(game);
        expect(p.cards(fireball, { zone: "memory" }).map((ref) => ref.objectId)).toEqual([
          target.objectId,
        ]);
        expect(q.cards(fireball, { zone: "graveyard" })).toHaveLength(1);
        expect(p.cards(aeneanCyclicWinds, { zone: "graveyard" })).toHaveLength(1);
        expect(game.state.decision).toBeNull();
      });
});

import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision } from "../../../testing/decisions.ts";
/** @covers 3GjTPUfsp3-a3 */
describe("Aenean Cyclic Winds — memory return and Empower", () => {
  for (const level of [4, 5])
    for (const matching of [false, true])
      for (const chosen of [0, 1, 2])
        it(`returns ${chosen} wind cards and empowers one Spell at level=${level}, matching=${matching}`, () => {
          const champion = enableAllTestElements(
              grantTestChampionLevel(
                createClassBonusTestChampion(aeneanCyclicWinds, matching, "activation-discount"),
                level,
              ),
            ),
            opponent = lineageTestChampion("Opponent", 0),
            active = matching && level >= 5;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  aeneanCyclicWinds,
                  fireball,
                  fireball,
                  ...Array.from({ length: 16 }, () => woodlandSquirrels),
                ],
                graveyard: [fireball],
                memory: [galesMare, galesMare, galesMare, woodlandSquirrels],
              },
            },
            playerTwo: { champion: opponent, zones: { memory: [galesMare] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            winds = p.cards(galesMare, { zone: "memory" }),
            foe = q.card(opponent);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          p.activate(aeneanCyclicWinds, {
            reservePayment: pay(matching ? 3 : 5),
            targets: { "target-card": [p.card(fireball, { zone: "graveyard" }).objectId] },
          });
          passEffectsStack(game);
          if (active) {
            expect(game.state.decision?.kind).toBe("resolve-effect-choice");
            const before = game.state;
            for (const ids of [
              winds.map((ref) => ref.objectId),
              [q.card(galesMare).objectId],
              [p.cards(woodlandSquirrels, { zone: "memory" })[0]!.objectId],
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(
              game,
              "resolve-effect-choice",
              winds.slice(0, chosen).map((ref) => ref.objectId),
            );
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(p.cards(galesMare, { zone: "hand" }).map((ref) => ref.objectId)).toEqual(
            active ? winds.slice(0, chosen).map((ref) => ref.objectId) : [],
          );
          expect(p.cards(galesMare, { zone: "memory" })).toHaveLength(3 - (active ? chosen : 0));
          expect(q.cards(galesMare, { zone: "memory" })).toHaveLength(1);
          const spells = p.cards(fireball, { zone: "hand" });
          p.activate(spells[0]!, {
            reservePayment: pay(matching ? 2 : 4),
            targets: { "target-1": [foe.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(1 + level + (active ? 2 : 0));
          p.activate(spells[1]!, {
            reservePayment: pay(matching ? 2 : 4),
            targets: { "target-1": [foe.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(2 * (1 + level) + (active ? 2 : 0));
        });
});
