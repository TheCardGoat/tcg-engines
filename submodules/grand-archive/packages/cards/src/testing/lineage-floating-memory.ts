import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { slateWhetstone } from "../cards/P24/items/slate-whetstone.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { grandArchiveTestFace, requireSingleFace } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

/** Champion Bonus 1–3; Floating Memory 1–2; Champion / Leveling Up 7.4. */
export function proveLineageFloatingMemory(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  name: string,
) {
  for (const matchingClass of [false, true])
    describe(`class match=${matchingClass}`, () => {
      function champion(identity: string, level: number) {
        const base = lineageTestChampion(identity, level);
        const face = requireSingleFace(base);
        return {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: {
              ...face,
              typeLine: {
                ...face.typeLine,
                classes: matchingClass
                  ? grandArchiveTestFace(card).typeLine.classes
                  : face.typeLine.classes,
              },
            },
          },
        };
      }
      for (const starterMatches of [false, true])
        for (const currentMatches of [undefined, false, true]) {
          it(`uses the current identity: starter=${starterMatches}, level-one=${currentMatches}`, () => {
            const enabled = currentMatches ?? starterMatches;
            const game = GrandArchiveTestEngine.startFixture({
              phase: "materialize",
              playerOne: {
                champion: champion(starterMatches ? name : "Other", 0),
                lineage:
                  currentMatches === undefined
                    ? []
                    : [champion(currentMatches ? name : "Other", 1)],
                zones: {
                  hand: [card],
                  graveyard: [card, woodlandSquirrels],
                  memory: [woodlandSquirrels],
                  "material-deck": [slateWhetstone],
                },
              },
              playerTwo: { champion: champion(name, 0), zones: { graveyard: [card] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const floating = p.card(card, { zone: "graveyard" }),
              material = p.card(slateWhetstone);
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
            if (enabled) {
              p.materialize(material, { floatingMemoryCardIds: [floating.objectId] });
              expect(p.zone("memory")).toEqual(memory);
              expect(p.zone("banishment")).toContainEqual(floating);
              expect(game.state.stack.at(-1)?.activationPayment).toEqual([
                { objectId: floating.objectId, from: "graveyard", to: "banishment" },
              ]);
            } else {
              expect(() =>
                p.materialize(material, { floatingMemoryCardIds: [floating.objectId] }),
              ).toThrow("Selected graveyard card does not have active Floating Memory");
              expect(game.state).toEqual(before);
              p.materialize(material);
              expect(p.zone("memory")).toHaveLength(0);
              expect(p.zone("graveyard")).toContainEqual(floating);
            }
            expect(game.state.objects[material.objectId]!.zone).toBe("effects-stack");
            passEffectsStack(game);
            expect(p.zone("field")).toContainEqual(material);
            expect(q.zone("graveyard")).toHaveLength(1);
          });
        }
      for (const initiallyEnabled of [false, true]) {
        it(`rechecks the bonus after publicly leveling: initially enabled=${initiallyEnabled}`, () => {
          const starter = champion(initiallyEnabled ? name : "Other", 0);
          const successor = champion(initiallyEnabled ? "Other" : name, 1);
          const game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion: starter,
              zones: {
                graveyard: [card, card],
                memory: [woodlandSquirrels],
                "material-deck": [successor, slateWhetstone],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: champion(name, 0),
              zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            floating = p.cards(card, { zone: "graveyard" });
          const championObject = p.card(starter);
          const previousDefinition =
            game.state.objects[championObject.objectId]!.activeDefinitionId;
          if (initiallyEnabled)
            p.materialize(successor, { floatingMemoryCardIds: [floating[0]!.objectId] });
          else {
            const before = game.state;
            expect(() =>
              p.materialize(successor, { floatingMemoryCardIds: [floating[0]!.objectId] }),
            ).toThrow();
            expect(game.state).toEqual(before);
            p.materialize(successor);
          }
          expect(game.state.objects[championObject.objectId]!.activeDefinitionId).toBe(
            previousDefinition,
          );
          passEffectsStack(game);
          expect(game.state.objects[championObject.objectId]!.activeDefinitionId).toBe(
            successor.canonicalId,
          );
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
          const before = game.state;
          if (initiallyEnabled) {
            // Neither the spent copy nor the remaining copy can pay after losing the bonus.
            for (const ref of floating) {
              expect(() =>
                p.materialize(slateWhetstone, { floatingMemoryCardIds: [ref.objectId] }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
          } else {
            p.materialize(slateWhetstone, { floatingMemoryCardIds: [floating[0]!.objectId] });
            expect(p.zone("banishment")).toContainEqual(floating[0]);
            expect(p.zone("graveyard")).toContainEqual(floating[1]);
            passEffectsStack(game);
            expect(p.cards(slateWhetstone, { zone: "field" })).toHaveLength(1);
          }
        });
      }
    });
}
