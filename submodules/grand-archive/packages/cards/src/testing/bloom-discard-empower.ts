import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveBloomDiscardEmpower(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  for (const matching of [false, true])
    for (const mode of ["normal", "expired", "stacked"] as const)
      it(`discards for draw and next-spell Empower: element=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          matching
            ? createClassBonusTestChampion(card, false, "activation-discount")
            : lineageTestChampion("Other", 0),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                card,
                card,
                fireball,
                fireball,
                ...Array.from({ length: 14 }, () => woodlandSquirrels),
              ],
              graveyard: [card],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion);
        const abilityId = `${card.canonicalId}-a2`;
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const cards = p.cards(card, { zone: "hand" });
        const before = game.state;
        expect(() =>
          p.activateAbility(p.card(card, { zone: "graveyard" }), abilityId, {
            reservePayment: pay(2),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        expect(() => q.activateAbility(cards[0]!, abilityId)).toThrow();
        expect(game.state).toEqual(before);
        if (!matching) {
          expect(() =>
            p.activateAbility(cards[0]!, abilityId, { reservePayment: pay(2) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        for (const source of cards.slice(0, mode === "stacked" ? 2 : 1)) {
          const state = game.state,
            deck = p.zone("main-deck"),
            hand = p.zone("hand").length;
          expect(() => p.activateAbility(source, abilityId, { reservePayment: pay(1) })).toThrow();
          expect(game.state).toEqual(state);
          p.activateAbility(source, abilityId, { reservePayment: pay(2) });
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(p.zone("hand")).toHaveLength(hand - 3);
          expect(p.zone("main-deck")).toEqual(deck);
          passEffectsStack(game);
          expect(p.zone("hand")).toHaveLength(hand - 2);
          expect(p.zone("hand")).toContainEqual(deck[0]);
          expect(p.zone("main-deck")).toEqual(deck.slice(1));
        }
        p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
        passEffectsStack(game);
        if (mode === "expired") {
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
        }
        const spells = p.cards(fireball, { zone: "hand" });
        const first = mode === "expired" ? 1 : mode === "stacked" ? 5 : 3;
        for (const [i, spell] of spells.entries()) {
          p.activate(spell, { reservePayment: pay(4), targets: { "target-1": [foe.objectId] } });
          passEffectsStack(game);
          expect(game.state.objects[foe.objectId]!.damage).toBe(first + i);
          expect(
            deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            }),
          ).toBe(0);
        }
      });
}
