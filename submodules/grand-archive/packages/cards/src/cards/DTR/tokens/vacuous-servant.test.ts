import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { vacuousServant } from "./vacuous-servant.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { exsanguinatingWallop } from "../attacks/exsanguinating-wallop.ts";
import { threeOfSpades } from "../allies/three-of-spades.ts";
import { backdash } from "../actions/backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers L67r0GlRHR-a1 */
describe("Vacuous Servant — independent attack/ally omen scaling", () => {
  for (const ciel of [false, true])
    for (const [attacks, allies] of [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 2],
    ] as const)
      it(`scales only from owned typed omens: Ciel=${ciel}, attack=${attacks}, ally=${allies}`, () => {
        const champion = createLineageTestChampion(vacuousServant, ciel ? "Ciel" : "Other");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [
                vacuousServant,
                ...Array.from({ length: attacks + allies + 1 }, () => condemnedTrinket),
              ],
              hand: Array.from({ length: 3 * (attacks + allies + 1) }, () => woodlandSquirrels),
              graveyard: [
                exsanguinatingWallop,
                exsanguinatingWallop,
                threeOfSpades,
                threeOfSpades,
                backdash,
                woodlandSquirrels,
              ],
              banishment: [exsanguinatingWallop, threeOfSpades],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [
                vacuousServant,
                condemnedTrinket,
                condemnedTrinket,
                woodlandSquirrels,
                threeOfSpades,
              ],
              hand: Array.from({ length: 6 }, () => woodlandSquirrels),
              graveyard: [exsanguinatingWallop, threeOfSpades, backdash],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const token = p.card(vacuousServant);
        const stat = (property: "power" | "life") =>
          deriveGrandArchiveNumericProperty(game.state.objects[token.objectId]!, property, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        for (const card of [exsanguinatingWallop, threeOfSpades]) {
          const target = q.card(card, { zone: "graveyard" });
          q.activateAbility(q.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [target.objectId]);
          passEffectsStack(game);
        }
        expect(stat("power")).toBe(1);
        expect(stat("life")).toBe(1);
        advanceToMain(game, p.id);
        const selected = [
          p.card(backdash),
          ...p.cards(exsanguinatingWallop, { zone: "graveyard" }).slice(0, attacks),
          ...p.cards(threeOfSpades, { zone: "graveyard" }).slice(0, allies),
        ];
        for (const target of selected) {
          p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [target.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.counters.omen).toBe(1);
        }
        expect(stat("power")).toBe(1 + (ciel ? attacks : 0));
        expect(stat("life")).toBe(1 + (ciel ? allies : 0));
        p.declareAttack(token, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          1 + (ciel ? attacks : 0),
        );
        advanceToMain(game, q.id);
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), token);
        game.resolveCombatWithoutRetaliation();
        if (ciel && allies) {
          expect(p.cards(vacuousServant, { zone: "field" })).toHaveLength(1);
          expect(game.state.objects[token.objectId]!.damage).toBe(1);
          q.declareAttack(q.card(threeOfSpades, { zone: "field" }), token);
          game.resolveCombatWithoutRetaliation();
        }
        expect(p.cards(vacuousServant, { zone: "field" })).toHaveLength(0);
      });
});
