import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { allenBeastBeckoner } from "./allen-beast-beckoner.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { songOfNurturing } from "../actions/song-of-nurturing.ts";
import { attuneWithTheWinds } from "../actions/attune-with-the-winds.ts";
import { favorableWinds } from "../actions/favorable-winds.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers YPaL2BxDSN-a1 */
describe("Allen's glimpse followed by a Harmony or Melody reveal", () => {
  for (const chosen of [songOfNurturing, attuneWithTheWinds, favorableWinds])
    it(`reorders before revealing ${chosen.slug}`, () => {
      const starter = lineageTestChampion("Allen", 0),
        game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion: starter,
            lineage: [lineageTestChampion("Allen", 1)],
            zones: {
              "material-deck": [allenBeastBeckoner],
              memory: [woodlandSquirrels, woodlandSquirrels],
              "main-deck": [giantTortoise, chosen, woodlandSquirrels, eagerPage],
            },
          },
          playerTwo: { champion: starter, zones: { "main-deck": [woodlandSquirrels] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        deck = p.zone("main-deck"),
        top = [deck[1]!.objectId, deck[0]!.objectId],
        bottom = [deck[2]!.objectId];
      p.materialize(allenBeastBeckoner);
      passEffectsStack(game);
      const glimpse = game.state.decision;
      if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Allen glimpse");
      expect(glimpse.cardIds).toEqual(deck.slice(0, 3).map((c) => c.objectId));
      const before = game.state;
      expect(() =>
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          top: [q.card(woodlandSquirrels).objectId, deck[0]!.objectId],
          bottom,
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "resolve-glimpse", { kind: "reorder", top, bottom });
      passEffectsStack(game);
      const accepted = chosen !== favorableWinds;
      expect(p.zone("hand").map((c) => c.objectId)).toEqual(accepted ? [deck[1]!.objectId] : []);
      expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
        ...(accepted ? [] : [deck[1]!.objectId]),
        deck[0]!.objectId,
        deck[3]!.objectId,
        deck[2]!.objectId,
      ]);
      expect(
        game.state.eventHistory.filter((e) => e.type === "card-revealed").map((e) => e.objectId),
      ).toEqual([deck[1]!.objectId]);
      expect(q.zone("hand")).toHaveLength(0);
    });
});
/** @covers YPaL2BxDSN-a2 */
describe("Allen's two-Animal-or-Beast level threshold", () => {
  for (const companions of [
    [],
    [giantTortoise],
    [woodlandSquirrels, giantTortoise],
    [woodlandSquirrels, grayWolf],
    [woodlandSquirrels, grayWolf, giantTortoise],
  ])
    it(`${companions.map((c) => c.slug).join(",") || "no own Animals"}`, () => {
      const starter = lineageTestChampion("Allen", 0),
        game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion: starter,
            lineage: [lineageTestChampion("Allen", 1), allenBeastBeckoner],
            zones: {
              field: [...companions, eagerPage],
              graveyard: [giantTortoise],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: starter,
            zones: { field: [woodlandSquirrels, giantTortoise], "main-deck": [woodlandSquirrels] },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(starter),
        level = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
      expect(level()).toBe(companions.length >= 2 ? 4 : 2);
      if (companions.includes(woodlandSquirrels)) {
        q.declareAttack(woodlandSquirrels, p.card(woodlandSquirrels, { zone: "field" }));
        game.resolveCombatWithoutRetaliation();
        expect(p.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
        expect(level()).toBe(companions.length >= 3 ? 4 : 2);
      } else {
        q.declareAttack(woodlandSquirrels, hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        expect(level()).toBe(2);
      }
      advanceToMain(game, p.id);
      expect(level()).toBe(companions.length >= 3 ? 4 : 2);
    });
});
