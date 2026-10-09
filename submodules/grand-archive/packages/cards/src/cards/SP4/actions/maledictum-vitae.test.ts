import type { GrandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { maledictumVitae } from "./maledictum-vitae.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 24I0xn0OQ1-a1
 * @covers 24I0xn0OQ1-a2
 * @covers 24I0xn0OQ1-a3 */
describe("Maledictum Vitae — bottom lineage and host recovery", () => {
  for (const origin of ["hand", "graveyard"] as const)
    for (const alice of [false, true])
      for (const element of [false, true])
        for (const own of [false, true])
          for (const hits of [0, 1, 2])
            it(`origin=${origin}, Alice=${alice}, Umbra=${element}, own=${own}, damage=${hits * 4}`, () => {
              const blank = grantTestChampionLevel(
                lineageTestChampion(alice ? "Alice" : "Other", 0),
                3,
              );
              const champion = enableAllTestElements({
                ...blank,
                layout: {
                  kind: "single-faced",
                  face: { ...requireSingleFace(blank), elements: [element ? "UMBRA" : "NORM"] },
                },
              });
              const game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    hand: [
                      ...(origin === "hand" ? [maledictumVitae, maledictumVitae] : []),
                      fireball,
                      fireball,
                      ...Array.from({ length: 16 }, () => woodlandSquirrels),
                    ],
                    graveyard: [
                      woodlandSquirrels,
                      woodlandSquirrels,
                      ...(origin === "graveyard" ? [maledictumVitae, maledictumVitae] : []),
                    ],
                    field: [woodlandSquirrels],
                  },
                },
                playerTwo: {
                  champion,
                  zones: { graveyard: [woodlandSquirrels], field: [woodlandSquirrels] },
                },
              });
              const p = game.player("player-one"),
                q = game.player("player-two"),
                host = own ? p : q;
              const hero = host.card(champion),
                other = (own ? q : p).card(champion);
              const pay = (n: number) =>
                p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, n)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
              for (let i = 0; i < hits; i++) {
                p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
                  reservePayment: pay(4),
                  targets: { "target-1": [hero.objectId] },
                });
                passEffectsStack(game);
              }
              expect(game.state.objects[hero.objectId]?.damage).toBe(hits * 4);
              const sources = p.cards(maledictumVitae, { zone: origin });
              const initialLineage = p.zone("inner-lineage").map((c) => c.objectId);
              for (const [index, source] of sources.entries()) {
                const fuel = p.cards(woodlandSquirrels, { zone: "graveyard" })[0]!;
                const activate = (
                  targets: GrandArchiveTargetId[],
                  reserve = 2,
                  selected = [fuel.objectId],
                ) =>
                  origin === "hand"
                    ? p.activate(source, {
                        reservePayment: pay(reserve),
                        targets: { "target-champion": targets },
                      })
                    : p.activateAbility(source, "24I0xn0OQ1-a3", {
                        reservePayment: pay(reserve),
                        costSelections: [selected],
                        targets: { "target-champion": targets },
                      });
                const before = game.state;
                if (origin === "graveyard" && !(alice && element)) {
                  expect(() => activate([hero.objectId])).toThrow();
                  expect(game.state).toEqual(before);
                  break;
                }
                for (const targets of [
                  [],
                  [hero.objectId, hero.objectId],
                  [p.card(woodlandSquirrels, { zone: "field" }).objectId],
                  [fuel.objectId],
                ]) {
                  expect(() => activate(targets)).toThrow();
                  expect(game.state).toEqual(before);
                }
                for (const cost of [1, 3]) {
                  expect(() => activate([hero.objectId], cost)).toThrow();
                  expect(game.state).toEqual(before);
                }
                if (origin === "graveyard")
                  for (const bad of [
                    [],
                    [source.objectId],
                    [q.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
                    [p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
                  ]) {
                    expect(() => activate([hero.objectId], 2, bad)).toThrow();
                    expect(game.state).toEqual(before);
                  }
                activate([hero.objectId]);
                if (origin === "graveyard")
                  expect(game.state.objects[fuel.objectId]?.zone).toBe("banishment");
                expect(game.state.objects[hero.objectId]?.damage).toBe(
                  Math.max(0, hits * 4 - index * 4),
                );
                passEffectsStack(game);
                expect(game.state.objects[source.objectId]).toMatchObject({
                  zone: "inner-lineage",
                  hostId: hero.objectId,
                  ownerId: p.id,
                });
                expect(p.zone("inner-lineage").map((c) => c.objectId)).toEqual([
                  ...initialLineage,
                  ...sources.slice(0, index + 1).map((c) => c.objectId),
                ]);
                expect(game.state.objects[hero.objectId]?.damage).toBe(
                  Math.max(0, hits * 4 - (index + 1) * 4),
                );
                expect(game.state.objects[other.objectId]?.damage).toBe(0);
                expect(game.state.stack).toHaveLength(0);
                expect(game.state.decision).toBeNull();
              }
            });
});
