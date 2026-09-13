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
import { creativeShock } from "./creative-shock.ts";
/** @covers BqDw4Mei4C-a1 */
describe("Creative Shock draws before its discard and conditional damage choice", () => {
  for (const classBonus of [false, true])
    for (const fireDiscard of [false, true])
      for (const accept of [false, true])
        it(`class=${classBonus}, fire discard=${fireDiscard}, damage=${accept}`, () => {
          const champion = createClassBonusTestChampion(
              creativeShock,
              classBonus,
              "activation-discount",
            ),
            game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [creativeShock, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                  field: [giantTortoise, jewelOfEnlightenment],
                  "main-deck": [fireball, woodlandSquirrels, giantTortoise],
                },
              },
              playerTwo: {
                champion,
                zones: { hand: [fireball], field: [giantTortoise, jewelOfEnlightenment] },
              },
            });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            top = p.zone("main-deck").slice(0, 2),
            hero = p.card(champion),
            target = accept ? q.card(giantTortoise) : hero,
            pay = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          expect(() => p.activate(creativeShock, { reservePayment: pay.slice(1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(creativeShock, { reservePayment: pay });
          expect(p.zone("hand")).toHaveLength(0);
          passEffectsStack(game);
          expect(p.zone("hand")).toEqual(top);
          const drawn = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [q.card(fireball).objectId]),
          ).toThrow();
          expect(game.state).toEqual(drawn);
          const discarded = top[fireDiscard ? 0 : 1]!;
          answerDecision(game, "resolve-effect-choice", [discarded.objectId]);
          passEffectsStack(game);
          expect(p.zone("graveyard").map((c) => c.objectId)).toContain(discarded.objectId);
          if (classBonus && fireDiscard) {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
            if (accept) {
              const choice = game.state;
              expect(() =>
                answerDecision(game, "resolve-effect-choice", [
                  q.card(jewelOfEnlightenment).objectId,
                ]),
              ).toThrow();
              expect(game.state).toEqual(choice);
              answerDecision(game, "resolve-effect-choice", [target.objectId]);
              passEffectsStack(game);
            }
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.objects[q.card(giantTortoise).objectId]!.damage).toBe(
            classBonus && fireDiscard && accept ? 2 : 0,
          );
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
          expect(p.zone("hand")).toEqual(top.filter((c) => c.objectId !== discarded.objectId));
          expect(q.zone("hand")).toHaveLength(1);
        });
});
