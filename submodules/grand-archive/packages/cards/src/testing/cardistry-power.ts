import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { twoOfHearts } from "../cards/DTR/allies/two-of-hearts.ts";
import { threeOfSpades } from "../cards/DTR/allies/three-of-spades.ts";
import { fourOfSpades } from "../cards/DTR/allies/four-of-spades.ts";
import { duchessSixOfHearts } from "../cards/DTR/allies/duchess-six-of-hearts.ts";
import { fiveOfSpades } from "../cards/DTR/allies/five-of-spades.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveCardistryPower({
  card,
  abilityId,
  cost,
  bonus,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  cost: 2 | 5;
  bonus: number;
}) {
  for (const variety of ["alone", "duplicates", "distinct", "zero"] as const)
    it(`uses distinct owned costs (${variety}), increases actual damage for one turn, and remains used`, () => {
      const extras =
        variety === "alone"
          ? []
          : variety === "duplicates"
            ? [card, card]
            : variety === "zero"
              ? [twoOfHearts, threeOfSpades, fourOfSpades, fiveOfSpades, duchessSixOfHearts]
              : [twoOfHearts, threeOfSpades, fiveOfSpades];
      const amount = Math.max(0, cost - (variety === "zero" ? 5 : variety === "distinct" ? 3 : 1));
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card, ...extras, woodlandSquirrels],
            hand: Array.from({ length: 6 }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [twoOfHearts, threeOfSpades, fiveOfSpades],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.cards(card, { zone: "field" })[0]!;
      const payment = () =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, amount)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      if (amount) {
        const before = game.state;
        expect(() =>
          p.activateAbility(source, abilityId, { reservePayment: payment().slice(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activateAbility(source, abilityId, { reservePayment: payment() });
      expect(p.zone("memory")).toHaveLength(amount);
      passEffectsStack(game);
      p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1 + bonus);
      // A same-name copy does not receive this source's bonus.
      if (variety !== "alone") {
        p.declareAttack(p.cards(card, { zone: "field" })[1]!, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2 + bonus);
      }
      const before = game.state;
      expect(() => p.activateAbility(source, abilityId, { reservePayment: payment() })).toThrow();
      expect(game.state).toEqual(before);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      const damage = game.state.objects[q.card(champion).objectId]!.damage;
      p.declareAttack(source, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(damage + 1);
      const after = game.state;
      expect(() => p.activateAbility(source, abilityId, { reservePayment: payment() })).toThrow();
      expect(game.state).toEqual(after);
    });
}
