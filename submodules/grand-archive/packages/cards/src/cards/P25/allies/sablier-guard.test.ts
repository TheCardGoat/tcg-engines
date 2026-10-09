import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { sablierGuard } from "./sablier-guard.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enragedBoars } from "../../DOA/allies/enraged-boars.ts";
import { chargeStatic } from "../../PRD/actions/charge-static.ts";
import { condemnedTrinket } from "../../DTR/items/condemned-trinket.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers tu7jvjf2gh-a1 */
describe("Sablier Guard — distinct own omen reserve costs", () => {
  for (const matching of [false, true])
    for (const opposing of [false, true])
      for (const kind of ["none", "one", "duplicate", "distinct"] as const)
        it(`class=${matching}, opposing omens=${opposing}, costs=${kind}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(sablierGuard, matching, "activation-discount"),
          );
          const omens =
            kind === "none"
              ? []
              : kind === "one"
                ? [woodlandSquirrels]
                : kind === "duplicate"
                  ? [woodlandSquirrels, woodlandSquirrels]
                  : [woodlandSquirrels, chargeStatic, enragedBoars];
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: opposing ? "playerTwo" : "playerOne",
            playerOne: {
              champion,
              zones: {
                field: [sablierGuard, ...(!opposing ? omens.map(() => condemnedTrinket) : [])],
                hand: Array.from({ length: omens.length * 3 }, () => woodlandSquirrels),
                graveyard: opposing ? [] : omens,
                banishment: [enragedBoars],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [
                  ...Array.from({ length: 5 }, () => woodlandSquirrels),
                  ...(opposing ? omens.map(() => condemnedTrinket) : []),
                ],
                hand: Array.from({ length: omens.length * 3 }, () => woodlandSquirrels),
                graveyard: opposing ? omens : [],
                banishment: [enragedBoars],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = opposing ? q : p,
            source = p.card(sablierGuard),
            enemy = q.card(champion);
          const stat = (property: "power" | "life") =>
            deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, property, {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          const costs = new Set<number>();
          expect(stat("power")).toBe(1);
          expect(stat("life")).toBe(1);
          for (const card of omens) {
            const chosen = owner.cards(card, { zone: "graveyard" })[0]!;
            owner.activateAbility(
              owner.cards(condemnedTrinket, { zone: "field" })[0]!,
              "21oy1nd4nw-a1",
              {
                reservePayment: owner
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 3)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              },
            );
            passEffectsStack(game);
            if (game.state.decision?.kind === "resolve-effect-choice") {
              answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
              passEffectsStack(game);
            }
            expect(game.state.objects[chosen.objectId]).toMatchObject({
              zone: "banishment",
              counters: { omen: 1 },
            });
            const cost = grandArchiveTestFace(card).cost;
            if (cost.kind !== "reserve" || typeof cost.amount !== "number")
              throw new Error("Expected reserve cost");
            costs.add(cost.amount);
            expect(stat("power")).toBe(1 + (opposing ? 0 : costs.size));
            expect(stat("life")).toBe(1 + (opposing ? 0 : costs.size));
          }
          advanceToMain(game, p.id);
          const expected = 1 + (opposing ? 0 : costs.size);
          p.declareAttack(source, enemy);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[enemy.objectId]!.damage).toBe(expected);
          advanceToMain(game, q.id);
          for (const [i, attacker] of q
            .cards(woodlandSquirrels, { zone: "field" })
            .slice(0, expected)
            .entries()) {
            q.declareAttack(attacker, source);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[source.objectId]!.zone).toBe(
              i + 1 === expected ? "graveyard" : "field",
            );
          }
        });
});
