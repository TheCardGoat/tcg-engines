import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { malevolentVow } from "./malevolent-vow.ts";
import { backdash } from "./backdash.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { idleThoughts } from "../../DOA/actions/idle-thoughts.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers up6fw61vf1-a1 */
describe("Malevolent Vow — discard, recover and enter the bottom of lineage", () => {
  for (const damage of [0, 1, 14])
    for (const count of [0, 1, 2, 3])
      it(`damage=${damage}, discarded=${count}`, () => {
        const starter = enableAllTestElements(lineageTestChampion("Vow", 0)),
          current = enableAllTestElements(lineageTestChampion("Vow", 1));
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion: starter,
            lineage: [current],
            zones: {
              hand: [
                malevolentVow,
                backdash,
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
              ],
              memory: [woodlandSquirrels],
              graveyard: [woodlandSquirrels],
              field: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: starter,
            zones: {
              field: Array.from({ length: damage + 1 }, () => enfeebledDagger),
              hand: [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(starter),
          foe = q.card(starter),
          source = p.card(malevolentVow);
        for (let i = 0; i <= damage; i++) {
          q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
            targets: { "target-unit": [i === damage ? foe.objectId : hero.objectId] },
          });
          passEffectsStack(game);
        }
        advanceToMain(game, p.id);
        p.activate(backdash, {
          targets: { "target-1": [hero.objectId] },
          reservePayment: [
            { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
          ],
        });
        passEffectsStack(game);
        const lineage = p.zone("inner-lineage").map((card) => card.objectId),
          memory = p.zone("memory").length;
        p.activate(source);
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        passEffectsStack(game);
        expect(game.state.decision?.kind).toBe("resolve-effect-choice");
        const cards = p.cards(woodlandSquirrels, { zone: "hand" });
        const pending = game.state;
        for (const ids of [
          cards.slice(0, 4).map((c) => c.objectId),
          [cards[0]!.objectId, cards[0]!.objectId],
          [q.card(woodlandSquirrels, { zone: "hand" }).objectId],
          [p.card(woodlandSquirrels, { zone: "field" }).objectId],
          [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
          [p.card(woodlandSquirrels, { zone: "memory" }).objectId],
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
          expect(game.state).toEqual(pending);
        }
        const selected = cards.slice(0, count);
        answerDecision(
          game,
          "resolve-effect-choice",
          selected.map((c) => c.objectId),
        );
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - 3 - 3 * count));
        expect(game.state.objects[foe.objectId]!.damage).toBe(1);
        for (const card of selected)
          expect(game.state.objects[card.objectId]!.zone).toBe("graveyard");
        expect(p.zone("memory")).toHaveLength(memory);
        expect(game.state.objects[source.objectId]).toMatchObject({
          zone: "inner-lineage",
          hostId: hero.objectId,
        });
        expect(p.zone("inner-lineage").map((card) => card.objectId)).toEqual([
          ...lineage,
          source.objectId,
        ]);
        expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(current.canonicalId);
      });
});

/** @covers up6fw61vf1-a2 */
describe("Malevolent Vow — inherited life loss belongs to the host", () => {
  for (const count of [1, 2, 3])
    it(`${count} resolved Vows stack, persist after leveling and lower lethal damage`, () => {
      const starter = enableAllTestElements(lineageTestChampion("Vow", 0)),
        next = lineageTestChampion("Vow", 1);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            hand: Array.from({ length: count }, () => malevolentVow),
            graveyard: [malevolentVow, idleThoughts],
            banishment: [malevolentVow],
            "material-deck": [next],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: starter,
          zones: {
            field: Array.from({ length: 20 }, () => enfeebledDagger),
            hand: [malevolentVow],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(starter),
        foe = q.card(starter);
      const life = (id: typeof hero.objectId) =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, "life", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      expect(life(hero.objectId)).toBe(20);
      for (let i = 1; i <= count; i++) {
        p.activate(p.cards(malevolentVow, { zone: "hand" })[0]!);
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-effect-choice") {
          answerDecision(game, "resolve-effect-choice", []);
          passEffectsStack(game);
        }
        expect(life(hero.objectId)).toBe(20 - 2 * i);
        expect(life(foe.objectId)).toBe(20);
      }
      advanceToMain(game, q.id);
      q.activate(malevolentVow);
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-effect-choice") {
        answerDecision(game, "resolve-effect-choice", []);
        passEffectsStack(game);
      }
      expect(life(foe.objectId)).toBe(18);
      expect(life(hero.objectId)).toBe(20 - 2 * count);
      for (let step = 0; step < 128; step++) {
        const wait = game.waitState();
        if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
        if (wait.kind === "materialization-choice")
          game.player(wait.playerId).execute({ move: "skip-materialization" });
        else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected ${wait.kind}`);
      }
      p.materialize(next, {
        floatingMemoryCardIds: [p.card(idleThoughts, { zone: "graveyard" }).objectId],
      });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(next.canonicalId);
      expect(life(hero.objectId)).toBe(20 - 2 * count);
      advanceToMain(game, q.id);
      const lethal = 20 - 2 * count;
      for (let hit = 1; hit <= lethal; hit++) {
        q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
          targets: { "target-unit": [hero.objectId] },
        });
        passEffectsStack(game);
        if (hit < lethal) expect(game.state.objects[hero.objectId]!.zone).toBe("field");
      }
      expect(game.state.objects[hero.objectId]!.zone).not.toBe("field");
    });
});
