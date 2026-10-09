import { describe, expect, it } from "vitest";
import { flickeringAfterglow } from "./flickering-afterglow.ts";
import { spallingCleanse } from "../../SP4/actions/spalling-cleanse.ts";
import { fracturedMemoriesFixture } from "../../../testing/fractured-memories-fixture.ts";
import {
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers tng0Gpe9mI-a1 */
describe("Flickering Afterglow mastery discount", () => {
  for (const sheen of [0, 2, 4])
    it(`pays reserve cost after ${sheen} mastery sheen`, () => {
      const { game, p, hero, foe, pay } = fracturedMemoriesFixture([
        flickeringAfterglow,
        ...Array.from({ length: sheen / 2 }, () => spallingCleanse),
      ]);
      for (const card of p.cards(spallingCleanse, { zone: "hand" })) {
        p.activate(card, { reservePayment: pay(2) });
        passEffectsStack(game);
      }
      const cost = Math.max(0, 3 - sheen),
        memory = p.zone("memory").length;
      if (cost) {
        const before = game.state;
        expect(() =>
          p.activate(flickeringAfterglow, {
            reservePayment: pay(cost - 1),
            attackAttackerId: hero.objectId,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(flickeringAfterglow, {
        reservePayment: pay(cost),
        attackAttackerId: hero.objectId,
      });
      passEffectsStack(game);
      expect(p.zone("memory")).toHaveLength(memory + cost);
      declareResolvedAttack(game, hero.objectId, foe.objectId, "Resolve Flickering Afterglow");
      for (let step = 0; step < 64 && (game.state.combat || game.state.stack.length); step++) {
        const d = game.state.decision;
        if (d?.kind === "resolve-optional-effect") answerDecision(game, d.kind, false);
        else if (d?.kind === "choose-retaliators") answerDecision(game, d.kind, []);
        else {
          const w = game.waitState();
          if (w.kind !== "opportunity") throw new Error(w.kind);
          game.player(w.playerId).pass();
        }
      }
      expect(game.state.objects[foe.objectId]!.damage).toBe(4);
    });
});
