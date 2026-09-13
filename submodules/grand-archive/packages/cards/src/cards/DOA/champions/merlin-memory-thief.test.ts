import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { merlinMemoryThief } from "./merlin-memory-thief.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { favorableWinds } from "../actions/favorable-winds.ts";
/** @covers umSsPWqb5H-a1 */
describe("Merlin rests to banish from either graveyard and gains level only for Floating Memory", () => {
  for (const own of [false, true])
    for (const floating of [false, true])
      it(`own grave=${own}, floating memory=${floating}`, () => {
        const starter = lineageTestChampion("Merlin", 0),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion: starter,
              lineage: [lineageTestChampion("Merlin", 1), merlinMemoryThief],
              zones: {
                hand: [favorableWinds],
                graveyard: [woodlandSquirrels, favorableWinds],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: starter,
              zones: {
                graveyard: [woodlandSquirrels, favorableWinds],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(starter),
          owner = own ? p : q,
          target = owner.card(floating ? favorableWinds : woodlandSquirrels, { zone: "graveyard" }),
          level = () =>
            deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
        expect(level()).toBe(2);
        p.activateAbility(hero, "umSsPWqb5H-a1");
        expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        passEffectsStack(game);
        const before = game.state;
        for (const bad of [hero, p.card(favorableWinds, { zone: "hand" })]) {
          expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-effect-choice", [target.objectId]);
        passEffectsStack(game);
        expect(owner.zone("banishment").map((c) => c.objectId)).toContain(target.objectId);
        expect(game.state.objects[target.objectId]!.ownerId).toBe(owner.id);
        expect(level()).toBe(floating ? 3 : 2);
        expect(game.state.objects[hero.objectId]!.counters.level ?? 0).toBe(floating ? 1 : 0);
        expect(() => p.activateAbility(hero, "umSsPWqb5H-a1")).toThrow();
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
        expect(level()).toBe(floating ? 3 : 2);
        p.activateAbility(hero, "umSsPWqb5H-a1");
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [
          (own ? q : p).card(favorableWinds, { zone: "graveyard" }).objectId,
        ]);
        passEffectsStack(game);
        expect(level()).toBe(floating ? 4 : 3);
      });
});
