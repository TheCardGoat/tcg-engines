import { describe } from "vitest";
import { blazingBowman } from "./blazing-bowman.ts";
import { proveUnretaliatedAttacks } from "../../../testing/unretaliated-attacks.ts";
/** @covers qry41lw9n0-a1 */
describe("Blazing Bowman — only its attacks cannot be retaliated", () =>
  proveUnretaliatedAttacks(blazingBowman));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers qry41lw9n0-a2 */
describe("Blazing Bowman — optional Fire graveyard banish grants temporary power", () => {
  for (const matching of [false, true])
    for (const available of [false, true])
      for (const accept of [false, true])
        it(`class=${matching}, Fire available=${available}, accept=${accept}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(blazingBowman, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  blazingBowman,
                  fireball,
                  ...Array.from({ length: 3 }, () => woodlandSquirrels),
                ],
                graveyard: [woodlandSquirrels, ...(available ? [fireball, fireball] : [])],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { graveyard: [fireball], "main-deck": [woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(blazingBowman),
            donors = p.cards(fireball, { zone: "graveyard" });
          p.activate(source, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-optional-effect") {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
          }
          if (available && accept) {
            expect(game.state.decision?.kind).toBe("resolve-effect-choice");
            for (const invalid of [
              [p.card(fireball, { zone: "hand" }).objectId],
              [q.card(fireball).objectId],
              [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
              [],
              donors.map((c) => c.objectId),
            ]) {
              const before = game.state;
              expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [donors[0]!.objectId]);
            passEffectsStack(game);
          }
          const power = () =>
            deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          expect(power()).toBe(available && accept ? 4 : 2);
          expect(p.cards(fireball, { zone: "banishment" })).toHaveLength(
            available && accept ? 1 : 0,
          );
          expect(q.card(fireball).objectId).toBeDefined();
          advanceToMain(game, p.id, game.state.turn.number);
          expect(power()).toBe(2);
          p.declareAttack(source, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
        });
});
