import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "./champion-lineage.ts";
import { grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveSubtypeElementPermission(
  source: Card,
  probes: readonly (readonly [Card, boolean])[],
  inherited = true,
): void {
  for (const level of inherited ? [0, 1, 3] : [3, 4])
    for (const [probe, qualifies] of probes)
      it(`element permission for ${probe.slug} at level ${level}`, () => {
        const starter = inherited ? source : lineageTestChampion("Permission", 0);
        const lineage = inherited
          ? Array.from({ length: level }, (_, i) => lineageTestChampion("Permission", i + 1))
          : [
              lineageTestChampion("Silvie", 1),
              lineageTestChampion("Silvie", 2),
              source,
              ...(level === 4 ? [lineageTestChampion("Silvie", 4)] : []),
            ];
        const opponent = lineageTestChampion("Opponent", 0);
        const face = grandArchiveTestFace(probe);
        if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
          throw new Error("Expected fixed reserve cost");
        const cost = face.cost.amount;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: starter,
            lineage,
            zones: {
              hand: [probe, ...Array.from({ length: 10 }, () => woodlandSquirrels)],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              hand: [probe, ...Array.from({ length: 10 }, () => woodlandSquirrels)],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        for (const id of ["player-one", "player-two"]) {
          const player = game.player(id);
          advanceToMain(game, id);
          const target = player.cards(probe, { zone: "hand" })[0]!;
          const payment = player
            .cards(woodlandSquirrels, { zone: "hand" })
            .filter((c) => c.objectId !== target.objectId)
            .slice(0, cost)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const allowed =
            face.elements.every((e) => e === "NORM") ||
            (id === "player-one" && qualifies && (inherited ? level > 0 : level === 3));
          if (!allowed) {
            const before = game.state;
            expect(() => player.activate(target, { reservePayment: payment })).toThrow();
            expect(game.state).toEqual(before);
          } else {
            if (cost > 0) {
              const before = game.state;
              expect(() => player.activate(target, { reservePayment: payment.slice(1) })).toThrow();
              expect(game.state).toEqual(before);
            }
            player.activate(target, { reservePayment: payment });
            passEffectsStack(game);
            expect(game.state.decision).toBeNull();
            expect(game.state.objects[target.objectId]!.zone).toBe("field");
          }
        }
      });
}

import { fireball } from "../cards/DOA/actions/fireball.ts";
import { innervateKnowledge } from "../cards/PRD/actions/innervate-knowledge.ts";
import { requireSingleFace } from "./class-bonus-test-champion.ts";
export function proveInheritedElementTransition(source: Card, probe: Card): void {
  it("gains permission after public level-up and loses it after deleveling", () => {
    const base = lineageTestChampion("Permission", 1);
    const levelOne = {
      ...base,
      layout: {
        kind: "single-faced" as const,
        face: { ...requireSingleFace(base), elements: ["WATER" as const, "FIRE" as const] },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: source,
        zones: {
          "material-deck": [levelOne],
          memory: [woodlandSquirrels],
          hand: [
            probe,
            probe,
            innervateKnowledge,
            fireball,
            fireball,
            fireball,
            ...Array.from({ length: 25 }, () => woodlandSquirrels),
          ],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const p = game.player("player-one");
    p.materialize(levelOne);
    passEffectsStack(game);
    advanceToMain(game, p.id);
    const face = grandArchiveTestFace(probe);
    if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
      throw new Error("Expected fixed reserve cost");
    const cost = face.cost.amount;
    const pay = (n: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, n)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    p.activate(p.cards(probe, { zone: "hand" })[0]!, { reservePayment: pay(cost) });
    passEffectsStack(game);
    expect(p.cards(probe, { zone: "field" })).toHaveLength(1);
    for (const spell of p.cards(fireball, { zone: "hand" })) {
      p.activate(spell, {
        reservePayment: pay(4),
        targets: { "target-1": [p.card(source, { zone: "field" }).objectId] },
      });
      passEffectsStack(game);
    }
    expect(game.state.objects[p.card(source, { zone: "field" }).objectId]!.damage).toBe(6);
    p.activate(innervateKnowledge, { reservePayment: pay(4) });
    passEffectsStack(game);
    expect(p.cards(levelOne, { zone: "material-deck" })).toHaveLength(1);
    const before = game.state;
    expect(() =>
      p.activate(p.cards(probe, { zone: "hand" })[0]!, { reservePayment: pay(cost) }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
}
