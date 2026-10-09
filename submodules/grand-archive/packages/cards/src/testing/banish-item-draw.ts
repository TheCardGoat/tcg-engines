import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveBanishItemDraw({
  card,
  abilityId,
  cost,
  destination,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  cost: number;
  destination: "hand" | "memory";
}): void {
  for (const size of [1, 3])
    it(`banishes as a cost and draws the top card into ${destination}, deck size=${size}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card],
            hand: Array.from({ length: 2 * cost }, () => woodlandSquirrels),
            "main-deck": Array.from({ length: size }, () => fireball),
          },
        },
        playerTwo: { champion, zones: { field: [card], "main-deck": [fireball] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card, { zone: "field" }),
        deck = p.zone("main-deck"),
        enemyDeck = q.zone("main-deck");
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const before = game.state;
      expect(() =>
        p.activateAbility(source, abilityId, { reservePayment: reservePayment.slice(1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      expect(() => p.activateAbility(q.card(card), abilityId, { reservePayment })).toThrow();
      expect(game.state).toEqual(before);
      p.activateAbility(source, abilityId, { reservePayment });
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(p.zone("memory")).toHaveLength(cost);
      expect(p.zone("hand")).toHaveLength(cost);
      expect(p.zone("main-deck")).toEqual(deck);
      passEffectsStack(game);
      expect(p.cards(fireball, { zone: destination }).map((ref) => ref.objectId)).toEqual([
        deck[0]!.objectId,
      ]);
      expect(p.zone("main-deck")).toEqual(deck.slice(1));
      expect(q.zone("main-deck")).toEqual(enemyDeck);
      expect(q.cards(card, { zone: "field" })).toHaveLength(1);
      const after = game.state;
      expect(() =>
        p.activateAbility(source, abilityId, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(after);
    });
}
