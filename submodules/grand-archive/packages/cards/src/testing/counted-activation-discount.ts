import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveCountedActivationDiscount({
  card,
  cost,
  qualifying,
  zone,
}: {
  card: Card;
  cost: number;
  qualifying: Card;
  zone: "field" | "banishment";
}): void {
  for (const classBonus of [false, true])
    for (const count of [0, 1, 2, cost + 1])
      it(`pays for ${count} qualifying ${zone} cards, class=${classBonus}`, () => {
        const champion = createClassBonusTestChampion(card, classBonus, "activation-discount"),
          expected = classBonus ? Math.max(0, cost - count) : cost;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: expected }, () => woodlandSquirrels)],
              ...(zone === "field"
                ? {
                    field: [...Array.from({ length: count }, () => qualifying), woodlandSquirrels],
                    banishment: [qualifying],
                  }
                : {
                    banishment: [
                      ...Array.from({ length: count }, () => qualifying),
                      woodlandSquirrels,
                    ],
                    graveyard: [qualifying],
                  }),
            },
          },
          playerTwo: { champion, zones: { [zone]: [qualifying, qualifying] } },
        });
        const p = game.player("player-one"),
          payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (expected > 0) {
          const before = game.state;
          expect(() => p.activate(card, { reservePayment: payment.slice(1) })).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(card, { reservePayment: payment });
        expect(p.zone("memory")).toHaveLength(expected);
        expect(p.cards(card, { zone: "field" })).toHaveLength(0);
        passEffectsStack(game);
        expect(p.cards(card, { zone: "field" })).toHaveLength(1);
      });
}
