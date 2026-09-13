import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { jewelOfEnlightenment } from "../cards/DOA/items/jewel-of-enlightenment.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveCombatRest({
  card,
  cost,
  freeze,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  freeze: boolean;
}): void {
  for (const classBonus of [false, true])
    for (const interrupt of [false, true])
      it(`class=${classBonus}, attacker selected=${interrupt}`, () => {
        const champion = createClassBonusTestChampion(card, classBonus, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, woodlandSquirrels, jewelOfEnlightenment],
                hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [woodlandSquirrels, giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          attacker = q.card(woodlandSquirrels),
          selected = interrupt ? attacker : q.card(giantTortoise),
          own = p.card(giantTortoise),
          other = p.card(woodlandSquirrels, { zone: "field" }),
          pay = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          binding = freeze ? "target-allies" : "target-1";
        q.declareAttack(attacker, hero);
        q.pass();
        const before = game.state;
        for (const ids of [
          [hero.objectId],
          [p.card(jewelOfEnlightenment).objectId],
          freeze
            ? [selected.objectId, own.objectId, other.objectId]
            : [selected.objectId, own.objectId],
          freeze ? [selected.objectId, selected.objectId] : [],
        ]) {
          expect(() =>
            p.activate(card, { reservePayment: pay, targets: { [binding]: ids } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(card, {
            reservePayment: pay.slice(1),
            targets: { [binding]: [selected.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(card, {
          reservePayment: pay,
          targets: { [binding]: freeze ? [selected.objectId, own.objectId] : [selected.objectId] },
        });
        expect(p.zone("memory")).toHaveLength(cost);
        passEffectsStack(game);
        expect(game.state.objects[selected.objectId]!.states.has("rested")).toBe(true);
        if (interrupt) {
          expect(game.state.combat).toBeNull();
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        } else {
          expect(game.state.combat).not.toBeNull();
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        }
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(
          !freeze && classBonus ? 1 : 0,
        );
        expect(game.state.objects[q.card(champion).objectId]!.counters.enlighten ?? 0).toBe(0);
        advanceToMain(game, p.id);
        expect(game.state.objects[own.objectId]!.states.has("rested")).toBe(freeze && classBonus);
        expect(game.state.objects[other.objectId]!.states.has("rested")).toBe(false);
        advanceToMain(game, q.id);
        expect(game.state.objects[selected.objectId]!.states.has("rested")).toBe(
          freeze && classBonus,
        );
        const unselected = interrupt ? q.card(giantTortoise) : attacker;
        expect(game.state.objects[unselected.objectId]!.states.has("rested")).toBe(false);
        advanceToMain(game, p.id);
        expect(game.state.objects[own.objectId]!.states.has("rested")).toBe(false);
        advanceToMain(game, q.id);
        expect(game.state.objects[selected.objectId]!.states.has("rested")).toBe(false);
      });
  if (freeze)
    it("allows zero targets without affecting unrelated allies", () => {
      const champion = createClassBonusTestChampion(card, true, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              field: [giantTortoise],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.activate(card, {
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
        targets: { "target-allies": [] },
      });
      passEffectsStack(game);
      expect(game.state.objects[p.card(giantTortoise).objectId]!.states.has("rested")).toBe(false);
      expect(game.state.objects[q.card(giantTortoise).objectId]!.states.has("rested")).toBe(false);
    });
}
