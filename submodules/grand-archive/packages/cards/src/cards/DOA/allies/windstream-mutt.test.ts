import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { windstreamMutt } from "./windstream-mutt.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { grayWolf } from "./gray-wolf.ts";
import { favorableWinds } from "../actions/favorable-winds.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
/** @covers 1o0tKizBZ6-a1 */
describe("Windstream Mutt's random wind reveal and other-ally buff", () => {
  for (const classBonus of [false, true])
    for (const wind of [false, true])
      it(`class=${classBonus}, wind=${wind}`, () => {
        const champion = createClassBonusTestChampion(
            windstreamMutt,
            classBonus,
            "activation-discount",
          ),
          paymentCard = wind ? favorableWinds : woodlandSquirrels;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [windstreamMutt, paymentCard, paymentCard, paymentCard],
              field: [woodlandSquirrels, grayWolf],
            },
          },
          playerTwo: { champion, zones: { field: [woodlandSquirrels], memory: [favorableWinds] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = p.card(woodlandSquirrels, { zone: "field" });
        p.activate(windstreamMutt, {
          reservePayment: p
            .cards(paymentCard, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        const memory = p.zone("memory").map((c) => c.objectId),
          history = game.state.eventHistory.length;
        passEffectsStack(game);
        if (classBonus && wind) {
          const before = game.state;
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          if (game.state.decision?.kind === "resolve-effect-choice")
            expect(game.state.decision.selection.id).toBe("chosen-object");
          for (const ref of [p.card(windstreamMutt), q.card(woodlandSquirrels), p.card(champion)]) {
            expect(() => answerDecision(game, "resolve-effect-choice", [ref.objectId])).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [target.objectId]);
          passEffectsStack(game);
        }
        const reveals = game.state.eventHistory
          .slice(history)
          .filter((e) => e.type === "card-revealed");
        expect(reveals).toHaveLength(classBonus ? 1 : 0);
        for (const event of reveals) expect(memory).toContain(event.objectId);
        expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(
          classBonus && wind ? 1 : 0,
        );
        expect(game.state.objects[p.card(windstreamMutt).objectId]!.counters.buff ?? 0).toBe(0);
        p.declareAttack(target, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          classBonus && wind ? 2 : 1,
        );
      });
});
