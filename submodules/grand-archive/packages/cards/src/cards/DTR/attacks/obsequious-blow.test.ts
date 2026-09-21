import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { obsequiousBlow } from "./obsequious-blow.ts";
import { backdash } from "../actions/backdash.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceToMain,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers macqlgvqo3-a1 */
describe("Obsequious Blow — Ciel's own omen discount", () => {
  for (const ciel of [false, true])
    for (const count of [0, 1, 3, 11])
      it(`Ciel=${ciel}, owned omens=${count}`, () => {
        const champion = createLineageTestChampion(obsequiousBlow, ciel ? "Ciel" : "Other");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: Array.from({ length: count }, () => condemnedTrinket),
              hand: [
                obsequiousBlow,
                ...Array.from({ length: 10 + 3 * count }, () => woodlandSquirrels),
              ],
              graveyard: Array.from({ length: count + 1 }, () => backdash),
              banishment: [backdash],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [condemnedTrinket],
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [backdash],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const payment = (player: typeof p, amount: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, amount)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", { reservePayment: payment(q, 3) });
        passEffectsStack(game);
        advanceToMain(game, p.id);
        for (let i = 0; i < count; i++) {
          p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: payment(p, 3),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [
            p.cards(backdash, { zone: "graveyard" })[0]!.objectId,
          ]);
          passEffectsStack(game);
        }
        const cost = ciel ? Math.max(0, 10 - count) : 10;
        const hero = p.card(champion),
          target = q.card(champion);
        if (cost) {
          const before = game.state;
          expect(() =>
            p.activate(obsequiousBlow, {
              attackAttackerId: hero.objectId,
              reservePayment: payment(p, cost - 1),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const memory = p.zone("memory").length;
        p.activate(obsequiousBlow, {
          attackAttackerId: hero.objectId,
          reservePayment: payment(p, cost),
        });
        expect(p.zone("memory")).toHaveLength(memory + cost);
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, target.objectId, "Declare Obsequious Blow");
        game.resolveCombatWithoutRetaliation();
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(7);
        expect(p.cards(obsequiousBlow, { zone: "graveyard" })).toHaveLength(1);
      });
});

/** @covers macqlgvqo3-a2 */
describe("Obsequious Blow — tax only the next turn's first card", () => {
  for (const championHit of [false, true])
    for (const skipTurn of [false, true])
      it(`champion hit=${championHit}, skip taxed turn=${skipTurn}`, () => {
        const champion = createLineageTestChampion(obsequiousBlow, "Other");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [obsequiousBlow, ...Array.from({ length: 11 }, () => woodlandSquirrels)],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, enfeebledDagger],
              hand: [backdash, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(champion),
          foe = q.card(champion);
        const payment = (player: typeof p, amount: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(-amount)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(obsequiousBlow, {
          attackAttackerId: hero.objectId,
          reservePayment: payment(p, 10),
        });
        passEffectsStack(game);
        declareResolvedAttack(
          game,
          hero.objectId,
          championHit ? foe.objectId : q.card(woodlandSquirrels, { zone: "field" }).objectId,
          "Declare Obsequious Blow",
        );
        game.resolveCombatWithoutRetaliation();
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]!.damage).toBe(championHit ? 7 : 0);
        p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
        passEffectsStack(game);
        p.pass();
        q.activate(backdash, {
          targets: { "target-1": [foe.objectId] },
          reservePayment: payment(q, 1),
        });
        passEffectsStack(game);
        advanceToMain(game, q.id);
        q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
          targets: { "target-unit": [hero.objectId] },
        });
        passEffectsStack(game);
        if (skipTurn) {
          advanceToMain(game, p.id);
          advanceToMain(game, q.id);
        }
        const card = q.cards(woodlandSquirrels, { zone: "hand" })[0]!;
        const taxed = championHit && !skipTurn;
        const memory = q.zone("memory").length;
        if (taxed) {
          const before = game.state;
          expect(() => q.activate(card)).toThrow();
          expect(() => q.activate(card, { reservePayment: payment(q, 1) })).toThrow();
          expect(game.state).toEqual(before);
        }
        q.activate(card, { reservePayment: taxed ? payment(q, 2) : [] });
        passEffectsStack(game);
        expect(q.zone("memory")).toHaveLength(memory + (taxed ? 2 : 0));
        expect(game.state.objects[card.objectId]!.zone).toBe("field");
        const second = q.cards(woodlandSquirrels, { zone: "hand" })[0]!;
        q.activate(second);
        passEffectsStack(game);
        expect(game.state.objects[second.objectId]!.zone).toBe("field");
        expect(q.zone("memory")).toHaveLength(memory + (taxed ? 2 : 0));
      });
});
