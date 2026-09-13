import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { blitzMage } from "../allies/blitz-mage.ts";
import { fireball } from "../actions/fireball.ts";
import { jewelOfEnlightenment } from "../items/jewel-of-enlightenment.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { recklessResearcher } from "./reckless-researcher.ts";
/** @covers dY36bObi9p-a1 */
describe("Reckless Researcher requires its controller's graveyard fire payment", () => {
  for (const classBonus of [false, true])
    for (const available of [false, true])
      for (const accept of [false, true])
        it(`class=${classBonus}, available=${available}, pay=${accept}`, () => {
          const champion = createClassBonusTestChampion(
              recklessResearcher,
              classBonus,
              "activation-discount",
            ),
            game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [
                    recklessResearcher,
                    woodlandSquirrels,
                    woodlandSquirrels,
                    woodlandSquirrels,
                  ],
                  graveyard: [woodlandSquirrels, ...(available ? [fireball, blitzMage] : [])],
                  field: [giantTortoise, jewelOfEnlightenment],
                },
              },
              playerTwo: { champion, zones: { graveyard: [fireball], field: [giantTortoise] } },
            });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            target = accept ? p.card(giantTortoise) : q.card(champion);
          p.activate(recklessResearcher, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          if (classBonus && available) {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
            if (accept && available) {
              const before = game.state;
              for (const bad of [
                p.card(woodlandSquirrels, { zone: "graveyard" }),
                q.card(fireball, { zone: "graveyard" }),
                p.card(recklessResearcher),
              ]) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [bad.objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              const paid = p.card(fireball, { zone: "graveyard" });
              answerDecision(game, "resolve-effect-choice", [paid.objectId]);
              passEffectsStack(game);
              expect(p.card(fireball, { zone: "banishment" }).objectId).toBe(paid.objectId);
              expect(game.state.objects[target.objectId]!.damage).toBe(0);
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [
                  p.card(jewelOfEnlightenment).objectId,
                ]),
              ).toThrow();
              answerDecision(game, "resolve-effect-choice", [target.objectId]);
              passEffectsStack(game);
            }
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe(
            classBonus && available && accept ? 2 : 0,
          );
          expect(q.cards(fireball, { zone: "graveyard" })).toHaveLength(1);
          expect(p.cards(fireball, { zone: "banishment" })).toHaveLength(
            classBonus && available && accept ? 1 : 0,
          );
          expect(p.card(recklessResearcher, { zone: "field" })).toBeDefined();
        });
});
