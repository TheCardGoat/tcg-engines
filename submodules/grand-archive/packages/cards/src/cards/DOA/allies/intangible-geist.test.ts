import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { intangibleGeist } from "./intangible-geist.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { markTheTarget } from "../actions/mark-the-target.ts";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
/** @covers Zu53izIFTX-a1 */
describe("Intangible Geist's optional regalia recovery", () => {
  for (const count of [-1, 0, 1, 2])
    it(`returns ${count < 0 ? "no cards when declined" : count} selected regalia`, () => {
      const champion = createClassBonusTestChampion(intangibleGeist, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              intangibleGeist,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            banishment: [trainingSword, curvedDagger, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { banishment: [trainingSword] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        ids = [p.card(trainingSword).objectId, p.card(curvedDagger).objectId];
      p.activate(intangibleGeist, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", count >= 0);
      passEffectsStack(game);
      if (count >= 0) {
        const before = game.state;
        for (const id of [
          p.card(woodlandSquirrels, { zone: "banishment" }).objectId,
          q.card(trainingSword).objectId,
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", [id])).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-effect-choice", ids.slice(0, count));
        passEffectsStack(game);
      }
      expect(p.zone("material-deck").map((c) => c.objectId)).toEqual(
        ids.slice(0, Math.max(0, count)),
      );
      expect(p.zone("banishment")).toHaveLength(3 - Math.max(0, count));
      expect(q.cards(trainingSword, { zone: "banishment" })).toHaveLength(1);
    });
});
/** @covers Zu53izIFTX-a2 */
describe("Intangible Geist's class-restricted combat prevention", () => {
  for (const classBonus of [false, true])
    for (const combat of [false, true])
      it(`class=${classBonus}, combat=${combat}`, () => {
        const base = createClassBonusTestChampion(
            intangibleGeist,
            classBonus,
            "activation-discount",
          ),
          face = requireSingleFace(base),
          champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...face, elements: [...face.elements, "FIRE" as const] },
            },
          };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [woodlandSquirrels, woodlandSquirrels],
              hand: [markTheTarget, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [intangibleGeist, woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = q.card(intangibleGeist);
        if (combat) {
          p.declareAttack(p.cards(woodlandSquirrels, { zone: "field" })[0]!, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(classBonus ? 0 : 1);
          p.declareAttack(
            p.cards(woodlandSquirrels, { zone: "field" })[1]!,
            q.card(woodlandSquirrels),
          );
          game.resolveCombatWithoutRetaliation();
          expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
        } else {
          p.activate(markTheTarget, {
            reservePayment: [
              { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
            ],
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
        }
      });
});
