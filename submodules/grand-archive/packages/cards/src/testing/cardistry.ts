import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { twoOfHearts } from "../cards/DTR/allies/two-of-hearts.ts";
import { threeOfSpades } from "../cards/DTR/allies/three-of-spades.ts";
import { fiveOfSpades } from "../cards/DTR/allies/five-of-spades.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
/** Each sibling supplies the printed cost and result; all actions use the production interface. */
export function proveCardistry({
  card,
  abilityId,
  sourceCost,
  cost,
  result,
}: {
  card: Card;
  abilityId: string;
  sourceCost: number;
  cost: number;
  result: "draw-hand" | "draw-memory" | "buff-self" | "buff-team";
}) {
  for (const variety of ["alone", "duplicates", "distinct"] as const) {
    it(`resolves ${result}, discounts distinct controlled costs (${variety}), and remains used next turn`, () => {
      const extras =
        variety === "alone"
          ? []
          : variety === "duplicates"
            ? [twoOfHearts, twoOfHearts]
            : [twoOfHearts, threeOfSpades, fiveOfSpades];
      const discount =
        variety === "alone"
          ? 1
          : variety === "duplicates"
            ? sourceCost === 2
              ? 1
              : 2
            : [2, 3, 5].includes(sourceCost)
              ? 3
              : 4;
      const amount = Math.max(0, cost - discount);
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card, ...extras, woodlandSquirrels],
            hand: Array.from({ length: cost + 2 }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
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
        q = game.player("player-two");
      const source = p.card(card, { zone: "field" });
      const field = p.zone("field").map((c) => c.objectId);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, amount)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      if (amount > 0) {
        const before = game.state;
        expect(() =>
          p.activateAbility(source, abilityId, { reservePayment: payment.slice(1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      const top = p.zone("main-deck")[0]!;
      p.activateAbility(source, abilityId, { reservePayment: payment });
      expect(p.zone("memory").map((c) => c.objectId)).toEqual(payment.map((c) => c.cardId));
      expect(p.zone("main-deck")[0]).toEqual(top);
      for (const id of field) expect(game.state.objects[id]!.counters.buff ?? 0).toBe(0);
      passEffectsStack(game);
      if (result === "draw-hand" || result === "draw-memory") {
        expect(game.state.objects[top.objectId]!.zone).toBe(
          result === "draw-hand" ? "hand" : "memory",
        );
        expect(p.zone("main-deck")).toHaveLength(2);
      } else {
        for (const id of field) {
          const suited =
            id !== p.card(champion).objectId &&
            id !== p.card(woodlandSquirrels, { zone: "field" }).objectId;
          expect(game.state.objects[id]!.counters.buff ?? 0).toBe(
            result === "buff-self" ? Number(id === source.objectId) : Number(suited),
          );
        }
      }
      for (const { objectId: id } of q.zone("field"))
        expect(game.state.objects[id]!.counters.buff ?? 0).toBe(0);
      const before = game.state;
      expect(() => p.activateAbility(source, abilityId)).toThrow();
      expect(game.state).toEqual(before);
      const turn = game.state.turn.number;
      advanceToMain(game, p.id, turn);
      const after = game.state;
      expect(() =>
        p.activateAbility(source, abilityId, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, amount)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(after);
    });
  }
}
