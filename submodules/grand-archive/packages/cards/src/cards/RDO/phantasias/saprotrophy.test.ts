import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { saprotrophy } from "./saprotrophy.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { settleEntryReplacements } from "../../../testing/temporary-entry-replacement.ts";

/** @covers qSxEKgmQ0I-a2 */
describe("Saprotrophy — opposing object entry replacement", () => {
  for (const matching of [false, true])
    for (const copies of [0, 1, 2])
      for (const opponent of [false, true])
        for (const entrant of [woodlandSquirrels, saprotrophy]) {
          it(`Diao Chan=${matching}, copies=${copies}, opponent=${opponent}, entrant=${entrant.slug}`, () => {
            const champion = enableAllTestElements(
              createLineageTestChampion(saprotrophy, matching ? "Diao Chan" : "Other"),
            );
            const hand = [entrant, woodlandSquirrels, woodlandSquirrels];
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: opponent ? "playerTwo" : "playerOne",
              playerOne: {
                champion,
                zones: {
                  field: [woodlandSquirrels, ...Array.from({ length: copies }, () => saprotrophy)],
                  hand: opponent ? [] : hand,
                },
              },
              playerTwo: {
                champion,
                zones: { field: [woodlandSquirrels], hand: opponent ? hand : [] },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              actor = opponent ? q : p,
              source = actor.cards(entrant, { zone: "hand" })[0]!,
              oldOwn = p.card(woodlandSquirrels, { zone: "field" }),
              oldOpponent = q.card(woodlandSquirrels, { zone: "field" });
            actor.activate(source, {
              reservePayment:
                entrant === saprotrophy
                  ? actor
                      .cards(woodlandSquirrels, { zone: "hand" })
                      .map((c) => ({ kind: "card" as const, cardId: c.objectId }))
                  : [],
            });
            settleEntryReplacements(game);
            expect(game.state.objects[source.objectId]!.zone).toBe("field");
            expect(game.state.objects[source.objectId]!.counters.wither ?? 0).toBe(
              matching && opponent ? copies : 0,
            );
            for (const old of [oldOwn, oldOpponent])
              expect(game.state.objects[old.objectId]!.counters.wither ?? 0).toBe(0);
            expect(game.state.stack).toHaveLength(0);
            expect(game.state.decision).toBeNull();
          });
        }
});

import { naturesInsight } from "../../AMB/actions/natures-insight.ts";
import { tempestDownfall } from "../../MRC/actions/tempest-downfall.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers qSxEKgmQ0I-a1 */
describe("Saprotrophy — entry recovery from own TERA banishment", () => {
  for (const matching of [false, true])
    for (const count of [0, 1, 3, 5]) {
      it(`class=${matching}, banished TERA cards=${count}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(saprotrophy, matching, "activation-discount"),
        );
        const tera = Array.from({ length: count }, (_, i) =>
          i % 2 ? saprotrophy : naturesInsight,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [saprotrophy],
              graveyard: [saprotrophy],
              banishment: [...tera, woodlandSquirrels, woodlandSquirrels],
              hand: [
                saprotrophy,
                tempestDownfall,
                tempestDownfall,
                ...Array.from({ length: 8 }, () => woodlandSquirrels),
              ],
              "main-deck": [naturesInsight],
            },
          },
          playerTwo: {
            champion,
            zones: { banishment: Array.from({ length: 5 }, () => naturesInsight) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          source = p.card(saprotrophy, { zone: "hand" });
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (let i = 0; i < 2; i++) {
          p.activate(p.cards(tempestDownfall, { zone: "hand" })[0]!, {
            reservePayment: pay(3),
            targets: { "target-1": [hero.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[hero.objectId]!.damage).toBe(6);
        p.activate(source, { reservePayment: pay(2) });
        p.pass();
        q.pass();
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[hero.objectId]!.damage).toBe(6);
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "qSxEKgmQ0I-a1",
          ),
        ).toBe(true);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, 6 - (2 + count)));
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        expect(game.state.stack).toHaveLength(0);
      });
    }
});
