import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveTargetPlayerAction({
  card,
  kind,
  counterAmount,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  kind: "mill" | "reveal";
  counterAmount: number;
}): void {
  for (const classBonus of [false, true])
    for (const self of [false, true])
      for (const count of [0, 1, 3])
        it(`${kind} ${self ? "own" : "opposing"} ${count} cards, class=${classBonus}`, () => {
          const champion = createClassBonusTestChampion(card, classBonus, "activation-discount");
          const deck = Array.from({ length: count }, () => grayWolf),
            memory = Array.from({ length: count }, () => grayWolf);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [card, woodlandSquirrels, woodlandSquirrels],
                "main-deck": kind === "mill" ? deck : [grayWolf],
                memory,
              },
            },
            playerTwo: { champion, zones: { "main-deck": deck, memory } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            target = self ? p : q,
            other = self ? q : p,
            beforeOtherDeck = other.zone("main-deck").map((c) => c.objectId),
            targetDeck = target.zone("main-deck").map((c) => c.objectId);
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          expect(() =>
            p.activate(card, {
              reservePayment: payment,
              targets: { "target-player": [q.card(champion).objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(card, { reservePayment: payment, targets: { "target-player": [target.id] } });
          const revealedIds = target.zone("memory").map((c) => c.objectId),
            history = game.state.eventHistory.length;
          expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(
            classBonus ? counterAmount : 0,
          );
          expect(game.state.objects[q.card(champion).objectId]!.counters.preparation ?? 0).toBe(0);
          if (kind === "mill") {
            expect(
              target
                .zone("graveyard")
                .filter((c) => c.definitionId === grayWolf.canonicalId)
                .map((c) => c.objectId),
            ).toEqual(targetDeck.slice(0, 2));
            expect(target.zone("main-deck").map((c) => c.objectId)).toEqual(targetDeck.slice(2));
            expect(other.zone("main-deck").map((c) => c.objectId)).toEqual(beforeOtherDeck);
          } else {
            const revealed = game.state.eventHistory
              .slice(history)
              .filter((e) => e.type === "card-revealed")
              .map((e) => e.objectId);
            expect(revealed.sort()).toEqual(revealedIds.sort());
            expect(
              target
                .zone("memory")
                .map((c) => c.objectId)
                .sort(),
            ).toEqual([...revealedIds].sort());
            expect(p.zone("hand")).toHaveLength(1);
            expect(q.zone("hand")).toHaveLength(0);
          }
        });
}
