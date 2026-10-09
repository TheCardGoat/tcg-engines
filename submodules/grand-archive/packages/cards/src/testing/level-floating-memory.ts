import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { slateWhetstone } from "../cards/P24/items/slate-whetstone.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { grantTestChampionLevel } from "./class-bonus-test-champion.ts";
import { classBonusLeveledChampion } from "./class-bonus-level.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveLevelFloatingMemory(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  threshold: number,
  classBonus?: boolean,
) {
  for (const level of [threshold - 1, threshold, threshold + 1])
    for (const continuous of [false, true]) {
      it(`uses current level and one own graveyard card: level=${level}, continuous=${continuous}, class=${classBonus ?? "unrestricted"}`, () => {
        const family =
          classBonus === undefined
            ? {
                starter: lineageTestChampion("Memory", 0),
                lineage: Array.from({ length: level }, (_, i) =>
                  lineageTestChampion("Memory", i + 1),
                ),
              }
            : classBonusLeveledChampion(card, classBonus, level);
        const champion = continuous
          ? grantTestChampionLevel(family.starter, level)
          : family.starter;
        const enabled = level >= threshold && classBonus !== false;
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            lineage: continuous ? [] : family.lineage,
            zones: {
              hand: [card],
              graveyard: [card, woodlandSquirrels],
              memory: [woodlandSquirrels, woodlandSquirrels],
              "material-deck": [slateWhetstone, slateWhetstone],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: grantTestChampionLevel(lineageTestChampion("Other", 0), threshold + 1),
            zones: {
              graveyard: [card],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          floating = p.card(card, { zone: "graveyard" }),
          material = p.cards(slateWhetstone)[0]!;
        const before = game.state,
          memory = p.zone("memory");
        for (const ids of [
          [p.card(card, { zone: "hand" }).objectId],
          [q.card(card).objectId],
          [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
          [floating.objectId, floating.objectId],
        ]) {
          expect(() => p.materialize(material, { floatingMemoryCardIds: ids })).toThrow();
          expect(game.state).toEqual(before);
        }
        if (!enabled) {
          expect(() =>
            p.materialize(material, { floatingMemoryCardIds: [floating.objectId] }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.materialize(material);
          expect(p.zone("memory")).toHaveLength(1);
          expect(p.zone("graveyard")).toContainEqual(floating);
        } else {
          p.materialize(material, { floatingMemoryCardIds: [floating.objectId] });
          expect(p.zone("memory")).toEqual(memory);
          expect(p.zone("banishment")).toContainEqual(floating);
          expect(game.state.stack.at(-1)?.activationPayment).toEqual([
            { objectId: floating.objectId, from: "graveyard", to: "banishment" },
          ]);
        }
        expect(game.state.objects[material.objectId]!.zone).toBe("effects-stack");
        passEffectsStack(game);
        expect(p.zone("field")).toContainEqual(material);
        if (!enabled) return;
        const turn = game.state.turn.number;
        let reached = false;
        for (let i = 0; i < 128; i++) {
          const wait = game.waitState();
          if (
            wait.kind === "materialization-choice" &&
            wait.playerId === p.id &&
            game.state.turn.number > turn
          ) {
            reached = true;
            break;
          }
          if (wait.kind === "materialization-choice")
            game.player(wait.playerId).execute({ move: "skip-materialization" });
          else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
          else throw new Error(`Unexpected ${wait.kind}`);
        }
        expect(reached).toBe(true);
        const later = game.state;
        expect(() =>
          p.materialize(p.card(slateWhetstone, { zone: "material-deck" }), {
            floatingMemoryCardIds: [floating.objectId],
          }),
        ).toThrow();
        expect(game.state).toEqual(later);
      });
    }
}
