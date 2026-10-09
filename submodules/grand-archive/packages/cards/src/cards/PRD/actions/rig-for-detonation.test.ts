import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { rigForDetonation } from "./rig-for-detonation.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { chargerXUltra } from "../items/charger-x-ultra.ts";
import { draughtOfStamina } from "../items/draught-of-stamina.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";

/** @covers Tx3kHOY6vh-a1
 * @covers Tx3kHOY6vh-a2
 */
describe("Rig for Detonation — optional VelTech sacrifice and next attack", () => {
  for (const matching of [false, true])
    for (const available of [false, true])
      for (const accept of [false, true])
        for (const disposition of ["current", "expired", "reentered"] as const) {
          it(`class=${matching}, item=${available}, accept=${accept}, ${disposition}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(rigForDetonation, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [
                    rigForDetonation,
                    reclaim,
                    chargerXUltra,
                    ...Array.from({ length: 12 }, () => woodlandSquirrels),
                  ],
                  field: [
                    giantTortoise,
                    woodlandSquirrels,
                    draughtOfStamina,
                    ...(available ? [chargerXUltra] : []),
                  ],
                  "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: [chargerXUltra],
                  "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const ally = p.card(giantTortoise),
              other = p.card(woodlandSquirrels, { zone: "field" }),
              target = q.card(champion);
            const item = p.cards(chargerXUltra, { zone: "field" })[0];
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            p.activate(rigForDetonation, {
              targets: { "target-1": [ally.objectId] },
              reservePayment: pay(1),
            });
            expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(false);
            passEffectsStack(game);
            expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(true);
            if (matching && available) {
              answerDecision(game, "resolve-optional-effect", accept);
              if (accept) {
                const before = game.state;
                for (const ids of [
                  [],
                  [ally.objectId],
                  [p.card(draughtOfStamina).objectId],
                  [q.card(chargerXUltra).objectId],
                  [p.card(chargerXUltra, { zone: "hand" }).objectId],
                  [item!.objectId, item!.objectId],
                ]) {
                  expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                  expect(game.state).toEqual(before);
                }
                answerDecision(game, "resolve-effect-choice", [item!.objectId]);
              }
              passEffectsStack(game);
            }
            expect(game.state.decision).toBeNull();
            if (item)
              expect(game.state.objects[item.objectId]!.zone).toBe(
                matching && accept ? "graveyard" : "field",
              );
            expect(game.state.objects[q.card(chargerXUltra).objectId]!.zone).toBe("field");
            if (disposition === "reentered") {
              p.activate(reclaim, {
                targets: { "target-1": [ally.objectId] },
                reservePayment: pay(2),
              });
              passEffectsStack(game);
              p.activate(ally, { reservePayment: pay(4) });
              passEffectsStack(game);
            }
            if (disposition === "expired") advanceToMain(game, p.id, game.state.turn.number);
            const fight = (attacker: typeof ally) => {
              p.declareAttack(attacker, target);
              game.resolveCombatWithoutRetaliation();
            };
            fight(other);
            expect(game.state.objects[target.objectId]!.damage).toBe(1);
            fight(ally);
            const bonus = matching && available && accept && disposition === "current" ? 3 : 0;
            expect(game.state.objects[target.objectId]!.damage).toBe(2 + bonus);
            p.activateAbility(draughtOfStamina, "lpnvx7mnu1-a2", {
              targets: { "target-1": [ally.objectId] },
            });
            passEffectsStack(game);
            fight(ally);
            expect(game.state.objects[target.objectId]!.damage).toBe(3 + bonus);
          });
        }
});

import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { fireball } from "../../DOA/actions/fireball.ts";

/** @covers Tx3kHOY6vh-a1
 * @covers Tx3kHOY6vh-a2
 */
describe("Rig for Detonation — unit scope, stacked effects, and responses", () => {
  for (const own of [false, true])
    for (const ally of [false, true])
      for (const matching of [false, true])
        for (const removed of ally ? [false, true] : [false])
          for (const copies of removed ? [1] : [1, 2]) {
            it(`own=${own}, ally=${ally}, class=${matching}, removed=${removed}, copies=${copies}`, () => {
              const champion = enableAllTestElements(
                createClassBonusTestChampion(rigForDetonation, matching, "activation-discount"),
              );
              const game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    hand: [
                      ...Array.from({ length: copies }, () => rigForDetonation),
                      fireball,
                      ...Array.from({ length: 8 }, () => woodlandSquirrels),
                    ],
                    field: [
                      woodlandSquirrels,
                      trainingSword,
                      ...Array.from({ length: copies }, () => chargerXUltra),
                    ],
                    "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
                  },
                },
                playerTwo: {
                  champion,
                  zones: {
                    field: [woodlandSquirrels, trainingSword],
                    "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
                  },
                },
              });
              const p = game.player("player-one"),
                q = game.player("player-two"),
                controller = own ? p : q,
                defender = own ? q : p;
              const target = ally
                ? controller.card(woodlandSquirrels, { zone: "field" })
                : controller.card(champion);
              const pay = (n: number) =>
                p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, n)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
              const items = p.cards(chargerXUltra, { zone: "field" });
              const sources = p.cards(rigForDetonation);
              for (let i = 0; i < sources.length; i++) {
                const before = game.state;
                for (const ids of [
                  [],
                  [target.objectId, target.objectId],
                  [p.card(trainingSword).objectId],
                  [items[0]!.objectId],
                ]) {
                  expect(() =>
                    p.activate(sources[i]!, {
                      targets: { "target-1": ids },
                      reservePayment: pay(1),
                    }),
                  ).toThrow();
                  expect(game.state).toEqual(before);
                }
                for (const n of [0, 2]) {
                  expect(() =>
                    p.activate(sources[i]!, {
                      targets: { "target-1": [target.objectId] },
                      reservePayment: pay(n),
                    }),
                  ).toThrow();
                  expect(game.state).toEqual(before);
                }
                p.activate(sources[i]!, {
                  targets: { "target-1": [target.objectId] },
                  reservePayment: pay(1),
                });
                if (removed)
                  p.activate(fireball, {
                    targets: { "target-1": [target.objectId] },
                    reservePayment: pay(4),
                  });
                passEffectsStack(game);
                if (matching && !removed) {
                  answerDecision(game, "resolve-optional-effect", true);
                  answerDecision(game, "resolve-effect-choice", [items[i]!.objectId]);
                  passEffectsStack(game);
                }
                expect(game.state.decision).toBeNull();
                expect(game.state.objects[sources[i]!.objectId]!.zone).toBe("graveyard");
                expect(game.state.objects[items[i]!.objectId]!.zone).toBe(
                  matching && !removed ? "graveyard" : "field",
                );
              }
              expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(!removed);
              if (!removed) {
                if (!own) {
                  advanceToMain(game, q.id, -1, true);
                  expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
                }
                controller.declareAttack(
                  target,
                  defender.card(champion),
                  ally ? {} : { weaponIds: [controller.card(trainingSword).objectId] },
                );
                if (game.state.decision?.kind === "order-triggered-abilities")
                  answerDecision(
                    game,
                    "order-triggered-abilities",
                    game.state.decision.pendingTriggerIds,
                  );
                game.resolveCombatWithoutRetaliation();
                expect(game.state.objects[defender.card(champion).objectId]!.damage).toBe(
                  1 + (matching && own ? 3 * copies : 0),
                );
                advanceToMain(game, defender.id, -1, true);
                expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
              } else {
                expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
              }
            });
          }
});
