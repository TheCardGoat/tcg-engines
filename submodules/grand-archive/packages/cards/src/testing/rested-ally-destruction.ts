import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { fishingAccident } from "../cards/DOA/actions/fishing-accident.ts";
import { secondWind } from "../cards/DOA/actions/second-wind.ts";
import { coreFractal } from "../cards/PRD/tokens/core-fractal.ts";

export function proveRestedAllyDestruction(
  source: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  mode: "up-to-two-efficient" | "one-with-fractal",
) {
  const optional = mode === "up-to-two-efficient";
  for (const matching of [false, true])
    for (const level of [0, 5, 6, 8])
      for (const selected of optional ? [[], [0], [1], [0, 1], [1, 2]] : [[0], [1]])
        for (const wake of ["none", "first", "all"] as const)
          it(`class=${matching}, level=${level}, targets=${selected.join(",")}, wake=${wake}`, () => {
            const champion = enableAllTestElements(
              grantTestChampionLevel(
                createClassBonusTestChampion(source, matching, "activation-discount"),
                level,
              ),
            );
            const cost = optional ? Math.max(0, 7 - (matching ? level : 0)) : 2;
            const game = GrandArchiveTestEngine.startFixture({
              definitions: [coreFractal],
              playerOne: {
                champion,
                zones: {
                  hand: [
                    source,
                    fishingAccident,
                    fishingAccident,
                    fishingAccident,
                    secondWind,
                    secondWind,
                    giantTortoise,
                    ...Array.from({ length: 18 }, () => woodlandSquirrels),
                  ],
                  field: [giantTortoise, trainingSword, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: { field: [giantTortoise, giantTortoise, coreFractal] },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const sourceRef = p.card(source);
            const allies = [p.card(giantTortoise, { zone: "field" }), ...q.cards(giantTortoise)];
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            for (const ally of allies) {
              p.activate(p.cards(fishingAccident, { zone: "hand" })[0]!, {
                reservePayment: pay(1),
                targets: { "target-1": [ally.objectId] },
              });
              passEffectsStack(game);
              expect(game.state.objects[ally.objectId]?.states.has("rested")).toBe(true);
            }
            const targets = selected.map((i) => allies[i]!.objectId);
            const before = game.state;
            const invalid = [
              [p.card(champion).objectId],
              [p.card(trainingSword).objectId],
              [p.card(woodlandSquirrels, { zone: "field" }).objectId],
              [p.card(giantTortoise, { zone: "hand" }).objectId],
              [allies[0]!.objectId, allies[0]!.objectId],
              allies.map((a) => a.objectId),
              ...(!optional ? [[], [allies[0]!.objectId, allies[1]!.objectId]] : []),
            ];
            for (const bad of invalid) {
              expect(() =>
                p.activate(sourceRef, { reservePayment: pay(cost), targets: { "target-1": bad } }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            for (const wrong of [cost + 1, ...(cost ? [cost - 1] : [])]) {
              expect(() =>
                p.activate(sourceRef, {
                  reservePayment: pay(wrong),
                  targets: { "target-1": targets },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(sourceRef, { reservePayment: pay(cost), targets: { "target-1": targets } });
            expect(p.zone("memory")).toHaveLength(3 + cost);
            const awakened =
              wake === "none" ? [] : wake === "first" ? selected.slice(0, 1) : selected;
            for (const index of awakened)
              p.activate(p.cards(secondWind, { zone: "hand" })[0]!, {
                reservePayment: pay(3),
                targets: { "target-1": [allies[index]!.objectId] },
              });
            passEffectsStack(game);
            for (const [i, ally] of allies.entries()) {
              expect(game.state.objects[ally.objectId]?.zone).toBe(
                selected.includes(i) && !awakened.includes(i) ? "graveyard" : "field",
              );
              if (awakened.includes(i))
                expect(game.state.objects[ally.objectId]?.states.has("rested")).toBe(false);
            }
            const tokens = p.cards(coreFractal, { zone: "field" });
            expect(tokens).toHaveLength(
              !optional && matching && level >= 6 && awakened.length === 0 ? 1 : 0,
            );
            for (const token of tokens) {
              expect(game.state.objects[token.objectId]?.isToken).toBe(true);
              expect(game.state.objects[token.objectId]?.states.has("rested")).toBe(false);
              expect(game.state.objects[token.objectId]?.ownerId).toBe(p.id);
            }
            expect(q.cards(coreFractal, { zone: "field" })).toHaveLength(1);
            expect(game.state.objects[sourceRef.objectId]?.zone).toBe("graveyard");
            expect(game.state.stack).toHaveLength(0);
            expect(game.state.decision).toBeNull();
          });
}
