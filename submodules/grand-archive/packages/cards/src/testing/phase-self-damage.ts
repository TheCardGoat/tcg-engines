import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { penumbralWaltz } from "../cards/MRC/actions/penumbral-waltz.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function provePhaseSelfDamage(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  phase: "recollection" | "end",
  damage: number,
  unpreventable: boolean,
  linked = false,
) {
  for (const opposingHost of linked ? [false, true] : [false])
    for (const prevention of [false, true])
      it(`damages only its controller at ${phase}, opposing link=${opposingHost}, prevention=${prevention}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Phase Damage", 0));
        const printed = grandArchiveTestFace(card).cost,
          material = printed.kind === "memory";
        const game = GrandArchiveTestEngine.startFixture({
          phase: material ? "materialize" : "main",
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise, ...(!linked ? [card] : [])],
              "material-deck": material ? [card] : [],
              hand: [
                ...(linked && !material ? [card] : []),
                penumbralWaltz,
                ...Array.from({ length: 4 }, () => fireball),
                ...Array.from({ length: 22 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (linked) {
          const targets = {
            "intrinsic-link-target": [(opposingHost ? q : p).card(giantTortoise).objectId],
          };
          if (material) p.materialize(card, { targets });
          else {
            if (printed.kind !== "reserve" || typeof printed.amount !== "number")
              throw new Error("Expected reserve cost");
            p.activate(card, { targets, reservePayment: pay(printed.amount) });
          }
          if (material) {
            const source = p.card(card);
            for (let i = 0; game.state.objects[source.objectId]!.zone !== "field" && i < 20; i++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
            expect(game.state.objects[source.objectId]!.zone).toBe("field");
          } else passEffectsStack(game);
        }
        function reach(playerId: string, after = -1) {
          for (let i = 0; i < 160; i++) {
            if (
              game.state.turn.playerId === playerId &&
              game.state.turn.phase === phase &&
              game.state.turn.number > after
            )
              return;
            const wait = game.waitState();
            if (wait.kind === "materialization-choice")
              game.player(wait.playerId).execute({ move: "skip-materialization" });
            else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
            else throw new Error(`Unexpected ${wait.kind}`);
          }
          throw new Error("Did not reach phase");
        }
        reach(p.id);
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        expect(game.state.stack).toHaveLength(1);
        if (prevention) p.activate(penumbralWaltz, { variables: { X: 0 } });
        passEffectsStack(game);
        const first = prevention && !unpreventable ? Math.max(0, damage - 3) : damage;
        expect(game.state.objects[hero.objectId]!.damage).toBe(first);
        expect(game.state.objects[foe.objectId]!.damage).toBe(0);
        if (prevention) {
          const buffer = unpreventable ? 3 : Math.max(0, 3 - damage);
          const spells = p.cards(fireball, { zone: "hand" });
          for (let i = 0; i < 4; i++) {
            p.activate(spells[i]!, {
              reservePayment: pay(4),
              targets: { "target-1": [hero.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(
              first + Math.max(0, i + 1 - buffer),
            );
          }
        }
        const current = game.state.objects[hero.objectId]!.damage;
        reach(q.id);
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.objects[hero.objectId]!.damage).toBe(current);
        expect(game.state.objects[foe.objectId]!.damage).toBe(0);
        reach(p.id);
        expect(game.state.objects[hero.objectId]!.damage).toBe(current);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(current + damage);
      });
}
