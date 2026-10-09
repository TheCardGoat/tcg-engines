import { describe, expect, it } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { merlinAmethystsGlow } from "./merlin-amethysts-glow.ts";

/** @covers dPP9I4nVn0-a1 */
describe("Merlin, Amethyst's Glow — Lineage restriction", () => {
  proveChampionLineage({
    card: merlinAmethystsGlow,
    lineageName: "Merlin",
    level: 2,
    memoryCost: 2,
  });
});

import { fracturedMemoriesFixture } from "../../../testing/fractured-memories-fixture.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { rainwovenCrysalis } from "../actions/rainwoven-crysalis.ts";

/** @covers dPP9I4nVn0-a3 */
describe("Merlin's sheen discount and once-only preparation", () => {
  for (const casts of [0, 1, 4, 5]) {
    it(`pays max(0, 9 - ${casts * 2}) after earning mastery counters`, () => {
      const merlin = enableAllTestElements(merlinAmethystsGlow);
      const { game, p, q, hero, foe, pay } = fracturedMemoriesFixture(
        [sparkAlight, ...Array.from({ length: casts }, () => rainwovenCrysalis)],
        [],
        [merlin],
      );
      p.activate(sparkAlight, { reservePayment: pay(2), targets: { "target-1": [foe.objectId] } });
      passEffectsStack(game);
      const initialTurn = game.state.turn.number;
      for (let step = 0; step < 128; step++) {
        const wait = game.waitState();
        if (
          wait.kind === "materialization-choice" &&
          wait.playerId === p.id &&
          game.state.turn.number > initialTurn
        )
          break;
        if (wait.kind === "materialization-choice")
          game.player(wait.playerId).execute({ move: "skip-materialization" });
        else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected wait: ${wait.kind}`);
      }
      p.materialize(merlin);
      passEffectsStack(game);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [foe.objectId] },
      });
      passEffectsStack(game);
      advanceToMain(game, p.id);
      expect(game.state.objects[foe.objectId]!.counters["named:sheen"]).toBe(2);
      expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(0);
      for (const rain of p.cards(rainwovenCrysalis, { zone: "hand" })) {
        p.activate(rain, { reservePayment: pay(2) });
        passEffectsStack(game);
      }
      const sheen = casts * 2,
        cost = Math.max(0, 9 - sheen);
      expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(sheen);
      const ability = "dPP9I4nVn0-a3",
        before = game.state;
      if (cost > 0) {
        expect(() => p.activateAbility(hero, ability, { reservePayment: pay(cost - 1) })).toThrow();
        expect(game.state).toEqual(before);
      }
      expect(() => p.activateAbility(hero, ability, { reservePayment: pay(cost + 1) })).toThrow();
      expect(game.state).toEqual(before);
      expect(() => q.activateAbility(hero, ability)).toThrow();
      expect(game.state).toEqual(before);
      const deck = p.zone("main-deck"),
        hand = p.zone("hand").length;
      p.activateAbility(hero, ability, { reservePayment: pay(cost) });
      expect(p.zone("hand")).toHaveLength(hand - cost);
      expect(p.zone("main-deck")).toEqual(deck);
      expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(0);
      passEffectsStack(game);
      expect(p.zone("hand")).toHaveLength(hand - cost + 1);
      expect(p.zone("hand")).toContainEqual(deck[0]);
      expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(1);
      expect(game.state.players[p.id]!.mastery?.counters["named:sheen"] ?? 0).toBe(sheen);
      const resolved = game.state;
      expect(() => p.activateAbility(hero, ability, { reservePayment: pay(cost) })).toThrow();
      expect(game.state).toEqual(resolved);
      const turn = game.state.turn.number;
      advanceToMain(game, p.id, turn);
      const later = game.state;
      expect(() => p.activateAbility(hero, ability, { reservePayment: pay(cost) })).toThrow();
      expect(game.state).toEqual(later);
    });
  }
});
import { proveEntryCounter } from "../../../testing/entry-counter.ts";
/** @covers dPP9I4nVn0-a2 */
describe("merlin-amethysts-glow — entry counter", () =>
  proveEntryCounter(merlinAmethystsGlow, "named:sheen", 2));
