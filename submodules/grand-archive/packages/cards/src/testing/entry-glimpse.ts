import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveEntryGlimpse(card: Card, cost: number, count: number, link = false) {
  for (const matchingClass of [false, true])
    for (const size of [0, 1, 7])
      for (const mode of ["top", "bottom", "split"] as const)
        it(`entry Glimpse ${count}: class=${matchingClass}, deck=${size}, order=${mode}`, () => {
          const champion = createClassBonusTestChampion(card, matchingClass, "activation-discount");
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                field: [woodlandSquirrels],
                "main-deck": Array.from({ length: size }, () => woodlandSquirrels),
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const deck = p.zone("main-deck"),
            otherDeck = q.zone("main-deck");
          const payments = p.cards(woodlandSquirrels, { zone: "hand" });
          p.activate(card, {
            reservePayment: payments.map((ref) => ({ kind: "card", cardId: ref.objectId })),
            ...(link
              ? {
                  targets: {
                    "intrinsic-link-target": [
                      p.card(woodlandSquirrels, { zone: "field" }).objectId,
                    ],
                  },
                }
              : {}),
          });
          expect(p.zone("main-deck")).toEqual(deck);
          passEffectsStack(game);
          if (size) {
            const decision = game.state.decision;
            if (decision?.kind !== "resolve-glimpse")
              throw new Error(`Expected Glimpse, got ${decision?.kind}`);
            const ids = deck.slice(0, count).map((ref) => ref.objectId);
            expect(decision.playerId).toBe(p.id);
            expect(decision.cardIds).toEqual(ids);
            for (const top of [
              [...ids, ids[0]],
              ids.slice(1),
              [otherDeck[0]!.objectId, ...ids.slice(1)],
            ]) {
              const before = game.state;
              expect(() =>
                answerDecision(game, "resolve-glimpse", { kind: "reorder", top, bottom: [] }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            const looked = deck.slice(0, count).reverse();
            const split =
              mode === "top" ? looked.length : mode === "bottom" ? 0 : Math.ceil(looked.length / 2);
            answerDecision(game, "resolve-glimpse", {
              kind: "reorder",
              top: looked.slice(0, split).map((ref) => ref.objectId),
              bottom: looked.slice(split).map((ref) => ref.objectId),
            });
            passEffectsStack(game);
            expect(p.zone("main-deck")).toEqual([
              ...looked.slice(0, split),
              ...deck.slice(count),
              ...looked.slice(split),
            ]);
          } else expect(p.zone("main-deck")).toEqual([]);
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          expect(p.card(card, { zone: "field" })).toBeDefined();
          expect(p.zone("hand")).toHaveLength(0);
          expect(p.zone("memory")).toEqual(payments);
          expect(q.zone("main-deck")).toEqual(otherDeck);
          expect(q.zone("hand")).toHaveLength(0);
        });
}
