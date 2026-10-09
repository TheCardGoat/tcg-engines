import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { sparklingAdornment } from "./sparkling-adornment.ts";
import { soultraceTessellation } from "../../PTM/actions/soultrace-tessellation.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

function setup() {
  const champion = enableAllTestElements(lineageTestChampion("Sheen transfer", 0));
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [giantTortoise, trainingSword],
        hand: [
          sparklingAdornment,
          soultraceTessellation,
          soultraceTessellation,
          ...Array.from({ length: 6 }, () => woodlandSquirrels),
        ],
      },
    },
    playerTwo: { champion, zones: { field: [giantTortoise] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const pay = () =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
  for (const player of [p, q]) {
    p.activate(p.cards(soultraceTessellation, { zone: "hand" })[0]!, {
      reservePayment: pay(),
      targets: { "target-unit": [player.card(giantTortoise).objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[player.card(giantTortoise).objectId]!.counters["named:sheen"]).toBe(
      3,
    );
  }
  return { game, p, q, champion, pay };
}

/** @covers okZKM5DGRu-a1 @covers okZKM5DGRu-a2 */
describe("Sparkling Adornment — paid sheen transfer", () => {
  for (const owner of ["own", "opponent"])
    for (const destination of ["same", "champion", "other-ally"])
      for (const count of [1, 3])
        it(`removes counters up front and transfers exactly that number: source=${owner}, target=${destination}, count=${count}`, () => {
          const { game, p, q, champion, pay } = setup();
          const sourcePlayer = owner === "own" ? p : q,
            otherPlayer = owner === "own" ? q : p;
          const source = sourcePlayer.card(giantTortoise),
            other = otherPlayer.card(giantTortoise);
          const target =
            destination === "same"
              ? source
              : destination === "champion"
                ? sourcePlayer.card(champion)
                : other;
          const before = game.state;
          for (const selection of [
            [],
            Array.from({ length: 4 }, () => source.objectId),
            [p.card(trainingSword).objectId],
          ]) {
            expect(() =>
              p.activate(sparklingAdornment, {
                reservePayment: pay(),
                costSelections: [selection],
                targets: { "target-1": [target.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          expect(() =>
            p.activate(sparklingAdornment, {
              reservePayment: pay(),
              costSelections: [[source.objectId]],
              targets: { "target-1": [p.card(trainingSword).objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(sparklingAdornment, {
            reservePayment: pay(),
            costSelections: [Array.from({ length: count }, () => source.objectId)],
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[source.objectId]!.counters["named:sheen"] ?? 0).toBe(3 - count);
          if (destination !== "same")
            expect(game.state.objects[target.objectId]!.counters["named:sheen"] ?? 0).toBe(
              destination === "champion" ? 0 : 3,
            );
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.counters["named:sheen"] ?? 0).toBe(
            destination === "same" ? 3 : 3 - count,
          );
          expect(game.state.objects[target.objectId]!.counters["named:sheen"] ?? 0).toBe(
            destination === "same" ? 3 : (destination === "champion" ? 0 : 3) + count,
          );
          expect(game.state.objects[other.objectId]!.counters["named:sheen"]).toBe(
            destination === "other-ally" ? 3 + count : 3,
          );
          expect(p.cards(sparklingAdornment, { zone: "graveyard" })).toHaveLength(1);
        });

  it("rejects paying counters from two different objects", () => {
    const { game, p, q, champion, pay } = setup();
    const before = game.state;
    expect(() =>
      p.activate(sparklingAdornment, {
        reservePayment: pay(),
        costSelections: [[p.card(giantTortoise).objectId, q.card(giantTortoise).objectId]],
        targets: { "target-1": [p.card(champion).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});

import { proveLineageFloatingMemory } from "../../../testing/lineage-floating-memory.ts";
/** @covers okZKM5DGRu-a3 */
describe("Merlin Bonus Floating Memory", () =>
  proveLineageFloatingMemory(sparklingAdornment, "Merlin"));
