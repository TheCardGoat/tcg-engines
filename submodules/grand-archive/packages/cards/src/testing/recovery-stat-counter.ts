import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
import { breakApart } from "../cards/P26/actions/break-apart.ts";

/** Recover 2.1.1: a nonzero recovery triggers even at full health. */
export function proveRecoveryStatCounter({
  card,
  counter,
  entryCounters,
  classRestrictedRecovery,
  recipient,
  stat,
  base,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  counter: string;
  entryCounters: number;
  classRestrictedRecovery: boolean;
  recipient: "source" | "champion";
  stat: "power" | "life";
  base: number;
}): void {
  for (const classBonus of [false, true]) {
    it(`updates ${stat} after every recovery, including at full health, Class Bonus=${classBonus}`, () => {
      const cost = grandArchiveTestFace(card).cost;
      if (cost.kind !== "memory" || typeof cost.amount !== "number")
        throw new Error("Expected a fixed memory cost");
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, classBonus, "floating-memory"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [card],
            memory: Array.from({ length: cost.amount }, () => woodlandSquirrels),
            field: [potionOfHealing, potionOfHealing],
            hand: [breakApart, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.materialize(card);
      passEffectsStack(game);
      advanceToMain(game, p.id);
      const source = p.card(card),
        hero = p.card(champion),
        foe = q.card(champion);
      const target = recipient === "source" ? source : hero;
      const value = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, stat, {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      const initial = classBonus ? entryCounters : 0;
      expect(game.state.objects[source.objectId]!.counters[`named:${counter}`] ?? 0).toBe(initial);
      expect(value()).toBe(base + initial);
      for (let index = 1; index <= 2; index++) {
        p.activateAbility(p.cards(potionOfHealing, { zone: "field" })[0]!, "qtb31x97n2-a2");
        passEffectsStack(game);
        const expected = initial + (classRestrictedRecovery && !classBonus ? 0 : index);
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        expect(game.state.objects[source.objectId]!.counters[`named:${counter}`] ?? 0).toBe(
          expected,
        );
        expect(value()).toBe(base + expected);
        expect(
          deriveGrandArchiveNumericProperty(game.state.objects[foe.objectId]!, "life", {
            program: game.program,
            state: game.state,
            controllerId: q.id,
            bindings: {},
          }),
        ).toBe(15);
      }
      p.activate(breakApart, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 5)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        targets: { "target-1": [source.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(value()).toBe(base);
    });
  }
}
