import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { lorraineHonedOperative } from "./lorraine-honed-operative.ts";

/** @covers UsX7t4lXfX-a1 */
describe("Lorraine, Honed Operative — Lineage restriction", () => {
  proveChampionLineage({
    card: lorraineHonedOperative,
    lineageName: "Lorraine",
    level: 2,
    memoryCost: 2,
  });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { stavesXUltra } from "../items/staves-x-ultra.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";

/** @covers UsX7t4lXfX-a2 */
describe("Lorraine, Honed Operative — optional random refresh and per-draw weapon bonus", () => {
  for (const remainingMemory of [0, 1, 3, 5])
    for (let chosen = 0; chosen <= Math.min(3, remainingMemory); chosen++)
      for (const pattern of ["normal", "advanced", "mixed"] as const) {
        it(`remaining memory=${remainingMemory}, chosen=${chosen}, draws=${pattern}`, () => {
          const starter = lineageTestChampion("Lorraine", 0),
            previous = lineageTestChampion("Lorraine", 1);
          const drawn = Array.from({ length: 7 }, (_, i) =>
            pattern === "advanced" || (pattern === "mixed" && i % 2 === 0)
              ? stavesXUltra
              : woodlandSquirrels,
          );
          let game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion: starter,
              lineage: [previous],
              zones: {
                "material-deck": [lorraineHonedOperative],
                memory: Array.from({ length: remainingMemory + 2 }, () => woodlandSquirrels),
                "main-deck": drawn,
                field: [trainingSword, trainingSword, giantTortoise],
              },
            },
            playerTwo: {
              champion: lineageTestChampion("Other", 0),
              zones: { field: [trainingSword], "main-deck": [woodlandSquirrels] },
            },
          });
          let p = game.player("player-one"),
            q = game.player("player-two"),
            swords = p.cards(trainingSword),
            deck = p.zone("main-deck"),
            other = q.card(trainingSword);
          const otherDurability = game.state.objects[other.objectId]!.counters.durability ?? 0;
          const beforeDurability = swords.map(
            (c) => game.state.objects[c.objectId]!.counters.durability ?? 0,
          );
          const power = (i: number) =>
            deriveGrandArchiveNumericProperty(game.state.objects[swords[i]!.objectId]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          const beforePower = swords.map((_, i) => power(i));
          if (beforePower.some((n) => n === undefined)) throw Error("Sword must have power");
          p.materialize(lorraineHonedOperative);
          expect(p.zone("memory")).toHaveLength(remainingMemory);
          p.pass();
          q.pass();
          expect(p.zone("main-deck")).toEqual(deck);
          passEffectsStack(game);
          expect(p.zone("main-deck")).toEqual(deck);
          {
            const before = game.state;
            for (const bad of [-1, 4, 0.5, remainingMemory + 1]) {
              expect(() => answerDecision(game, "resolve-effect-choice", bad)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", chosen);
            passEffectsStack(game);
          }
          let advanced = 0;
          for (let i = 0; i < chosen; i++) {
            const isAdvanced = deck[i]!.definitionId === stavesXUltra.canonicalId;
            if (!isAdvanced) continue;
            const restored = restoreGrandArchiveMatchSnapshot(
              game.program,
              JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
            );
            expect(restored).toEqual(game.state);
            game = GrandArchiveTestEngine.fromState(game.program, restored);
            p = game.player("player-one");
            const before = game.state;
            for (const ids of [
              [],
              [other.objectId],
              [p.card(giantTortoise).objectId],
              [p.card(starter).objectId],
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [swords[advanced % 2]!.objectId]);
            advanced++;
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(p.zone("memory")).toHaveLength(remainingMemory);
          expect(p.zone("banishment")).toHaveLength(2 + chosen);
          expect(p.zone("main-deck")).toEqual(deck.slice(chosen));
          for (let i = 0; i < chosen; i++)
            expect(game.state.objects[deck[i]!.objectId]!.zone).toBe("memory");
          for (let i = 0; i < 2; i++) {
            const buffs = i === 0 ? Math.ceil(advanced / 2) : Math.floor(advanced / 2);
            expect(game.state.objects[swords[i]!.objectId]!.counters.durability ?? 0).toBe(
              beforeDurability[i]! + buffs,
            );
            expect(power(i)).toBe(beforePower[i]! + buffs);
          }
          expect(game.state.objects[other.objectId]!.counters.durability ?? 0).toBe(
            otherDurability,
          );
          advanceToMain(game, q.id);
          for (let i = 0; i < 2; i++) expect(power(i)).toBe(beforePower[i]);
        });
      }
});

import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/testing";

/** @covers UsX7t4lXfX-a2 */
describe("Lorraine, Honed Operative — exhausted deck and missing Sword", () => {
  for (const sword of [false, true])
    for (const deckSize of [0, 1, 2, 3, 4]) {
      it(`Sword=${sword}, deck=${deckSize}`, () => {
        const starter = lineageTestChampion("Lorraine", 0);
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion: starter,
            lineage: [lineageTestChampion("Lorraine", 1)],
            zones: {
              "material-deck": [lorraineHonedOperative],
              memory: Array.from({ length: 5 }, () => woodlandSquirrels),
              "main-deck": Array.from({ length: deckSize }, () => stavesXUltra),
              field: sword ? [trainingSword] : [],
            },
          },
          playerTwo: {
            champion: lineageTestChampion("Other", 0),
            zones: { field: [trainingSword] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          deck = p.zone("main-deck");
        p.materialize(lorraineHonedOperative);
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", 3);
        passEffectsStack(game);
        for (let i = 0; i < Math.min(3, deckSize) && sword; i++) {
          answerDecision(game, "resolve-effect-choice", [p.card(trainingSword).objectId]);
          passEffectsStack(game);
        }
        expect(p.zone("memory")).toHaveLength(Math.min(3, deckSize));
        expect(p.zone("main-deck")).toEqual(deck.slice(3));
        expect(game.state.winnerIds).toEqual(deckSize < 3 ? [q.id] : []);
        expect(game.state.decision).toBeNull();
      });
    }
});
