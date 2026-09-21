import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { conflagrativeTrounce } from "./conflagrative-trounce.ts";
import { backdash } from "../actions/backdash.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceToMain,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers vke9gsgfdm-a1 */
describe("Conflagrative Trounce — matching owned omen costs", () => {
  const cases = [
    { name: "no owned omens", omens: [], bonus: false },
    { name: "one owned omen", omens: [backdash], bonus: false },
    { name: "two different costs", omens: [backdash, woodlandSquirrels], bonus: false },
    { name: "matching zero costs", omens: [woodlandSquirrels, woodlandSquirrels], bonus: true },
    {
      name: "different cards with matching costs",
      omens: [backdash, conflagrativeTrounce],
      bonus: true,
    },
    { name: "three matching costs", omens: [backdash, backdash, backdash], bonus: true },
    {
      name: "two separate matching groups",
      omens: [backdash, backdash, woodlandSquirrels, woodlandSquirrels],
      bonus: true,
    },
  ];
  for (const ciel of [false, true])
    for (const scenario of cases)
      it(`${scenario.name}, Ciel=${ciel}`, () => {
        const champion = createLineageTestChampion(conflagrativeTrounce, ciel ? "Ciel" : "Other");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: scenario.omens.map(() => condemnedTrinket),
              hand: [
                conflagrativeTrounce,
                ...Array.from({ length: 1 + 3 * scenario.omens.length }, () => woodlandSquirrels),
              ],
              graveyard: [...scenario.omens, backdash, backdash],
              banishment: [backdash, backdash],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [condemnedTrinket, condemnedTrinket],
              hand: Array.from({ length: 6 }, () => woodlandSquirrels),
              graveyard: [backdash, backdash],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const payment = (player: typeof p, count: number) =>
          player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, count)
            .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        for (let i = 0; i < 2; i++) {
          q.activateAbility(q.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: payment(q, 3),
          });
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-effect-choice") {
            answerDecision(game, "resolve-effect-choice", [
              q.cards(backdash, { zone: "graveyard" })[0]!.objectId,
            ]);
            passEffectsStack(game);
          }
        }
        advanceToMain(game, p.id);
        for (const card of scenario.omens) {
          const selected = p.cards(card, { zone: "graveyard" })[0]!;
          p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: payment(p, 3),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
        }
        const hero = p.card(champion),
          target = q.card(champion);
        const before = game.state;
        expect(() =>
          p.activate(p.card(conflagrativeTrounce, { zone: "hand" }), {
            attackAttackerId: hero.objectId,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(p.card(conflagrativeTrounce, { zone: "hand" }), {
          attackAttackerId: hero.objectId,
          reservePayment: payment(p, 1),
        });
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        declareResolvedAttack(
          game,
          hero.objectId,
          target.objectId,
          "Declare Conflagrative Trounce",
        );
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(ciel && scenario.bonus ? 4 : 2);
        expect(p.cards(conflagrativeTrounce, { zone: "graveyard" }).length).toBe(1);
      });

  for (const addMatching of [false, true])
    it(`rechecks omens after announcement: matching response=${addMatching}`, () => {
      const champion = createLineageTestChampion(conflagrativeTrounce, "Ciel");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [condemnedTrinket, condemnedTrinket],
            hand: [conflagrativeTrounce, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
            graveyard: [backdash, backdash, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const payment = (count: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, count)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
        reservePayment: payment(3),
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", [
        p.cards(backdash, { zone: "graveyard" })[0]!.objectId,
      ]);
      passEffectsStack(game);
      const hero = p.card(champion),
        target = q.card(champion);
      p.activate(conflagrativeTrounce, {
        attackAttackerId: hero.objectId,
        reservePayment: payment(1),
      });
      p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
        reservePayment: payment(3),
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", [
        p.card(addMatching ? backdash : woodlandSquirrels, { zone: "graveyard" }).objectId,
      ]);
      passEffectsStack(game);
      declareResolvedAttack(game, hero.objectId, target.objectId, "Declare Conflagrative Trounce");
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(addMatching ? 4 : 2);
    });
});
