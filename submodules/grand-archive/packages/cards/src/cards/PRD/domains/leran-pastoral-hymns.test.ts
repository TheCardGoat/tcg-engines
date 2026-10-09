import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { leranPastoralHymns } from "./leran-pastoral-hymns.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers CGdu1Vmlok-a1 */
describe("Leran — influence at cost calculation", () => {
  for (const matching of [false, true])
    for (const influence of [0, 3, 4, 5, 6, 7])
      for (const memory of new Set([0, Math.min(influence, 2)]))
        it(`class=${matching}, influence after announcement=${influence}, memory=${memory}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(leranPastoralHymns, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  leranPastoralHymns,
                  ...Array.from({ length: influence - memory }, () => woodlandSquirrels),
                ],
                memory: Array.from({ length: memory }, () => woodlandSquirrels),
                graveyard: [woodlandSquirrels],
                banishment: [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { hand: Array.from({ length: 10 }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            source = p.card(leranPastoralHymns),
            cost = influence <= 4 ? 0 : 6;
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          expect(p.zone("hand").length + p.zone("memory").length).toBe(influence + 1);
          const before = game.state;
          if (cost > 0) {
            expect(() => p.activate(source, { reservePayment: pay(cost - 1) })).toThrow();
            expect(game.state).toEqual(before);
          }
          if (influence - memory < cost) {
            expect(() => p.activate(source, { reservePayment: pay(cost) })).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          p.activate(source, { reservePayment: pay(cost) });
          expect(p.zone("memory")).toHaveLength(memory + cost);
          expect(p.zone("hand").length + p.zone("memory").length).toBe(influence);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(game.state.objects[source.objectId]!.counters.durability).toBe(6);
        });
});

/** @covers CGdu1Vmlok-a2 */
describe("Leran — active player's end-phase influence", () => {
  for (const matching of [false, true])
    for (const ownEnd of [false, true])
      for (const influence of [7, 8, 9, 10])
        for (const memory of [0, 4])
          it(`class=${matching}, own end=${ownEnd}, influence=${influence}, memory=${memory}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(leranPastoralHymns, matching, "activation-discount"),
            );
            const zones = (count: number, memorized: number) => ({
              hand: Array.from({ length: count - memorized }, () => woodlandSquirrels),
              memory: Array.from({ length: memorized }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            });
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: ownEnd ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  ...zones(ownEnd ? influence : 11, ownEnd ? memory : 2),
                  field: [leranPastoralHymns],
                },
              },
              playerTwo: { champion, zones: zones(ownEnd ? 11 : influence, ownEnd ? 2 : memory) },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              active = ownEnd ? p : q,
              inactive = ownEnd ? q : p;
            for (let step = 0; game.state.turn.phase !== "end" && step < 20; step++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
            expect(game.state.turn.phase).toBe("end");
            expect(active.zone("hand").length + active.zone("memory").length).toBe(influence);
            expect(game.state.objects[active.card(champion).objectId]!.damage).toBe(0);
            const start = game.state.eventHistory.length;
            passEffectsStack(game);
            expect(game.state.objects[active.card(champion).objectId]!.damage).toBe(
              Math.max(0, influence - 7),
            );
            expect(game.state.objects[inactive.card(champion).objectId]!.damage).toBe(0);
            expect(
              game.state.eventHistory
                .slice(start)
                .filter((e) => e.type === "damage-marked")
                .map((e) => (e.type === "damage-marked" ? e.amount : 0)),
            ).toEqual(influence >= 8 ? [influence - 7] : []);
            expect(p.card(leranPastoralHymns, { zone: "field" })).toBeDefined();
          });
  for (const zone of ["hand", "graveyard"] as const)
    for (const ownEnd of [false, true])
      it(`does not trigger from ${zone}, own end=${ownEnd}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(leranPastoralHymns, true, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: ownEnd ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: Array.from({ length: 10 }, () => woodlandSquirrels),
              [zone]: [
                ...(zone === "hand" ? Array.from({ length: 10 }, () => woodlandSquirrels) : []),
                leranPastoralHymns,
              ],
            },
          },
          playerTwo: {
            champion,
            zones: { hand: Array.from({ length: 10 }, () => woodlandSquirrels) },
          },
        });
        for (let step = 0; game.state.turn.phase !== "end" && step < 20; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn.phase).toBe("end");
        expect(game.state.stack).toHaveLength(0);
        for (const id of ["player-one", "player-two"])
          expect(game.state.objects[game.player(id).card(champion).objectId]!.damage).toBe(0);
      });
});
