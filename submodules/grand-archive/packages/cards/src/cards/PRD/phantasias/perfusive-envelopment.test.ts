import { describe } from "vitest";
import { perfusiveEnvelopment } from "./perfusive-envelopment.ts";

import { proveSelfEntryCounters } from "../../../testing/self-entry-counters.ts";

/** @covers rRfRKqCBqF-a1 */
describe("perfusiveEnvelopment — entry counters", () => {
  proveSelfEntryCounters(perfusiveEnvelopment, "named:blood", 1);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";
import { umbilicalRitual } from "../actions/umbilical-ritual.ts";
/** @covers rRfRKqCBqF-a3 */
describe("Perfusive Envelopment recollection recovery", () => {
  for (const matching of [false, true])
    for (const counters of [0, 1, 3])
      for (const damage of [0, 1, 5])
        it(`recovers its own blood count: class=${matching}, blood=${counters}, damage=${damage}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(perfusiveEnvelopment, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: counters === 0 ? [perfusiveEnvelopment] : [],
                hand: [
                  ...(counters ? [perfusiveEnvelopment] : []),
                  ...Array.from({ length: damage }, () => singeingLeap),
                  ...Array.from({ length: damage + 2 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [woodlandSquirrels, woodlandSquirrels],
                hand: [umbilicalRitual, umbilicalRitual],
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const source = p.card(perfusiveEnvelopment),
            hero = p.card(champion),
            foe = q.card(champion);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          if (counters) {
            p.activate(source, { reservePayment: pay(2) });
            passEffectsStack(game);
          }
          for (let i = 1; i < counters; i++) {
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
            q.activate(q.cards(umbilicalRitual, { zone: "hand" })[0]!, {
              costSelections: [[q.cards(woodlandSquirrels, { zone: "field" })[0]!.objectId]],
            });
            passEffectsStack(game);
          }
          expect(game.state.objects[source.objectId]!.counters["named:blood"] ?? 0).toBe(counters);
          for (const leap of p.cards(singeingLeap, { zone: "hand" })) {
            p.activate(leap, { reservePayment: pay(1) });
            passEffectsStack(game);
          }
          expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
          for (let tick = 0; tick < 2; tick++) {
            const before = Math.max(0, damage - tick * counters);
            advanceToRecollection(game, q.id);
            expect(game.state.stack).toHaveLength(0);
            expect(game.state.objects[hero.objectId]!.damage).toBe(before);
            advanceToRecollection(game, p.id);
            expect(game.state.objects[hero.objectId]!.damage).toBe(before);
            expect(game.state.stack).toHaveLength(1);
            expect(game.state.stack[0]).toMatchObject({
              kind: "triggered-ability",
              sourceId: source.objectId,
              ability: { id: "rRfRKqCBqF-a3" },
            });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, before - counters));
            expect(game.state.objects[foe.objectId]!.damage).toBe(0);
            expect(game.state.objects[source.objectId]!.counters["named:blood"] ?? 0).toBe(
              counters,
            );
          }
        });
});

/** @covers rRfRKqCBqF-a3 */
import { whirlwindVizier } from "../../ALC/allies/whirlwind-vizier.ts";
describe("Perfusive Envelopment resolves its current blood count", () => {
  for (const matching of [false, true])
    for (const leaves of [false, true])
      it(`counts an opponent's sacrifice made in response: class=${matching}, source leaves=${leaves}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(perfusiveEnvelopment, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                perfusiveEnvelopment,
                ...Array.from({ length: 5 }, () => singeingLeap),
                ...Array.from({ length: 7 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, whirlwindVizier],
              hand: [umbilicalRitual, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(perfusiveEnvelopment),
          hero = p.card(champion);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        p.activate(source, { reservePayment: pay(2) });
        passEffectsStack(game);
        for (const leap of p.cards(singeingLeap, { zone: "hand" })) {
          p.activate(leap, { reservePayment: pay(1) });
          passEffectsStack(game);
        }
        advanceToRecollection(game, p.id);
        expect(game.state.objects[source.objectId]!.counters["named:blood"]).toBe(1);
        expect(game.state.objects[hero.objectId]!.damage).toBe(5);
        expect(game.state.stack).toHaveLength(1);
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        if (leaves)
          q.activateAbility(whirlwindVizier, "5swaf8urrq-a2", {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            targets: { "target-1": [source.objectId] },
          });
        else
          q.activate(umbilicalRitual, {
            costSelections: [[q.card(woodlandSquirrels, { zone: "field" }).objectId]],
          });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(leaves ? "graveyard" : "field");
        if (!leaves) expect(game.state.objects[source.objectId]!.counters["named:blood"]).toBe(2);
        expect(game.state.objects[hero.objectId]!.damage).toBe(3);
      });
});
