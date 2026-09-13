import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { tomeOfSacredLightning } from "./tome-of-sacred-lightning.ts";
import { tomeOfKnowledge } from "./tome-of-knowledge.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers MyUTeqUJ0H-a1 */
describe("Sacred Lightning pays a controlled Book only for its element-gated activation and retains copied abilities", () => {
  for (const element of [false, true])
    for (const bonus of [false, true])
      for (const activated of [false, true])
        it(`element=${element}, class=${bonus}, activated=${activated}`, () => {
          const base = createClassBonusTestChampion(
              tomeOfSacredLightning,
              bonus,
              "activation-discount",
            ),
            face = requireSingleFace(base);
          const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
            ...base,
            layout: {
              kind: "single-faced",
              face: {
                ...face,
                elements: element ? ["ARCANE"] : ["NORM"],
                abilities: [
                  ...face.abilities,
                  {
                    id: "tomeElementFixture-a1",
                    kind: "static",
                    staticKind: "effects",
                    text: "All elements are enabled for this fixture.",
                    effects: [
                      {
                        kind: "continuous-player-state",
                        players: "controller",
                        state: { named: "enabled-element", value: "ALL" },
                        value: true,
                        duration: { kind: "while-source-in-functional-zone" },
                      },
                    ],
                  },
                ],
              },
            },
          };
          const game = GrandArchiveTestEngine.startFixture({
            phase: activated ? "main" : "materialize",
            playerOne: {
              champion,
              zones: {
                field: [tomeOfKnowledge, tomeOfKnowledge, trainingSword],
                "material-deck": [tomeOfSacredLightning],
                banishment: [tomeOfKnowledge],
                "main-deck": [woodlandSquirrels, giantTortoise, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { field: [tomeOfKnowledge] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(tomeOfSacredLightning, { zone: "material-deck" }),
            book = p.cards(tomeOfKnowledge, { zone: "field" })[0]!,
            hero = p.card(champion);
          const level = () =>
            deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          expect(level()).toBe(bonus ? 2 : 0);
          if (activated) {
            const before = game.state;
            for (const bad of [
              p.card(trainingSword),
              q.card(tomeOfKnowledge),
              p.card(tomeOfKnowledge, { zone: "banishment" }),
            ]) {
              expect(() => p.activate(source, { costSelections: [[bad.objectId]] })).toThrow();
              expect(game.state).toEqual(before);
            }
            if (!element) {
              expect(() => p.activate(source, { costSelections: [[book.objectId]] })).toThrow();
              expect(game.state).toEqual(before);
              return;
            }
            expect(() => p.activate(source, { costSelections: [] })).toThrow();
            p.activate(source, { costSelections: [[book.objectId]] });
            expect(game.state.objects[book.objectId]!.zone).toBe("banishment");
          } else p.materialize(source);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(level()).toBe(bonus ? 2 : 0);
          if (activated) {
            const top = p.zone("main-deck")[0]!;
            p.activateAbility(source, "yDARN8eV6B-a2");
            expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
            passEffectsStack(game);
            expect(game.state.objects[top.objectId]!.zone).toBe("hand");
            expect(level()).toBe(bonus ? 1 : 0);
          } else {
            advanceToMain(game, p.id);
            expect(() => p.activateAbility(source, "yDARN8eV6B-a2")).toThrow();
            expect(p.cards(tomeOfKnowledge, { zone: "field" })).toHaveLength(2);
          }
        });
});
/** @covers MyUTeqUJ0H-a2 */
describe("Sacred Lightning rests to randomly banish its own memory and draws only after a banishment", () => {
  for (const bonus of [false, true])
    for (const count of [0, 1, 3])
      it(`class=${bonus}, memory=${count}`, () => {
        const champion = createClassBonusTestChampion(
          tomeOfSacredLightning,
          bonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [tomeOfSacredLightning],
              memory: Array.from({ length: count }, () => woodlandSquirrels),
              "main-deck": [giantTortoise, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { memory: [woodlandSquirrels, woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(tomeOfSacredLightning),
          memory = p.zone("memory"),
          top = p.zone("main-deck")[0]!,
          other = q.zone("memory");
        if (!bonus) {
          const before = game.state;
          expect(() => p.activateAbility(source, "MyUTeqUJ0H-a2")).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        p.activateAbility(source, "MyUTeqUJ0H-a2");
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        passEffectsStack(game);
        expect(p.zone("memory")).toHaveLength(Math.max(0, count - 1));
        expect(p.zone("banishment")).toHaveLength(count ? 1 : 0);
        if (count) expect(memory).toContainEqual(p.zone("banishment")[0]);
        expect(game.state.objects[top.objectId]!.zone).toBe(count ? "hand" : "main-deck");
        expect(q.zone("memory")).toEqual(other);
        const before = game.state;
        expect(() => p.activateAbility(source, "MyUTeqUJ0H-a2")).toThrow();
        expect(game.state).toEqual(before);
      });
});
