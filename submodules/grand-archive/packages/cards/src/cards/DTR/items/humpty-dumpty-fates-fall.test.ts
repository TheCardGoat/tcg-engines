import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  deriveGrandArchiveNumericProperty,
  grandArchiveObjectCurrentCharacteristics,
} from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { humptyDumptyFatesFall } from "./humpty-dumpty-fates-fall.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers aou4be9z82-a1 @covers aou4be9z82-a2 */
describe("Humpty Dumpty — persistent buff growth and temporary ally form", () => {
  for (const count of [0, 1, 2])
    it(`builds ${count} counters before becoming a zero-base ally`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(humptyDumptyFatesFall, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [humptyDumptyFatesFall],
            hand: [fireball, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [humptyDumptyFatesFall],
            "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(humptyDumptyFatesFall);
      const stat = (property: "power" | "life") =>
        deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, property, {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      const payment = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() => p.activateAbility(q.card(humptyDumptyFatesFall), "aou4be9z82-a1")).toThrow();
      expect(game.state).toEqual(before);
      expect(() => p.declareAttack(source, q.card(champion))).toThrow();
      expect(game.state).toEqual(before);
      for (let n = 1; n <= count; n++) {
        const deck = p.zone("main-deck");
        p.activateAbility(source, "aou4be9z82-a1");
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(n - 1);
        const rested = game.state;
        expect(() => p.activateAbility(source, "aou4be9z82-a1")).toThrow();
        expect(game.state).toEqual(rested);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.counters.buff).toBe(n);
        expect(game.state.decision).toMatchObject({
          kind: "resolve-glimpse",
          cardIds: deck.slice(0, n).map((c) => c.objectId),
        });
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          top: [],
          bottom: deck
            .slice(0, n)
            .reverse()
            .map((c) => c.objectId),
        });
        passEffectsStack(game);
        expect(p.zone("main-deck")).toEqual([...deck.slice(n), ...deck.slice(0, n).reverse()]);
        expect(stat("power")).toBeUndefined();
        expect(stat("life")).toBeUndefined();
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
      }
      const unpaid = game.state;
      expect(() =>
        p.activateAbility(source, "aou4be9z82-a2", { reservePayment: payment(1) }),
      ).toThrow();
      expect(game.state).toEqual(unpaid);
      p.activateAbility(source, "aou4be9z82-a2", { reservePayment: payment(2) });
      expect(stat("life")).toBeUndefined();
      passEffectsStack(game);
      if (!count) {
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        return;
      }
      expect(
        grandArchiveObjectCurrentCharacteristics(
          game.program,
          game.state,
          game.state.objects[source.objectId]!,
        ).types,
      ).toEqual(expect.arrayContaining(["ITEM", "ALLY"]));
      expect(stat("power")).toBe(count);
      expect(stat("life")).toBe(count);
      p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(count);
      if (count === 2) {
        p.activate(fireball, {
          targets: { "target-1": [source.objectId] },
          reservePayment: payment(4),
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.damage).toBe(1);
      }
      advanceToMain(game, q.id);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.objects[source.objectId]!.damage).toBe(0);
      expect(stat("power")).toBeUndefined();
      expect(stat("life")).toBeUndefined();
      expect(game.state.objects[source.objectId]!.counters.buff).toBe(count);
      advanceToMain(game, p.id);
      const expired = game.state;
      expect(() => p.declareAttack(source, q.card(champion))).toThrow();
      expect(game.state).toEqual(expired);
    });
});
