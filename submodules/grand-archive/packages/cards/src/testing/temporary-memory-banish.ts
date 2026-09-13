import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "./decisions.ts";
export function proveTemporaryMemoryBanish({
  card,
  cost,
  amount,
  level = 0,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  amount: number;
  level?: number;
}): void {
  for (const count of [0, 1, 3])
    it(`randomly banishes ${amount} of ${count} opposing memory cards until their next end phase`, () => {
      const champion = grantTestChampionLevel(
        createClassBonusTestChampion(card, false, "activation-discount"),
        level,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            memory: Array.from({ length: count }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        memory = q.zone("memory").map((c) => c.objectId),
        payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        p.activate(card, { reservePayment: payment, targets: { "target-opponent": [p.id] } }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(card, { reservePayment: payment, targets: { "target-opponent": [q.id] } });
      expect(q.zone("memory").map((c) => c.objectId)).toEqual(memory);
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      const banished = q.zone("banishment").map((c) => c.objectId);
      expect(banished).toHaveLength(Math.min(amount, count));
      for (const id of banished) expect(memory).toContain(id);
      expect(q.zone("memory")).toHaveLength(count - banished.length);
      expect(p.zone("banishment")).toHaveLength(0);
      advanceToMain(game, q.id);
      for (const id of banished) expect(game.state.objects[id]!.zone).toBe("banishment");
      advanceToMain(game, p.id);
      for (const id of banished) {
        expect(game.state.objects[id]!.zone).toBe("memory");
        expect(game.state.objects[id]!.ownerId).toBe(q.id);
      }
      expect(
        q
          .zone("memory")
          .map((c) => c.objectId)
          .sort(),
      ).toEqual([...banished].sort());
      expect(q.zone("banishment")).toHaveLength(0);
    });
}
