import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { celestialNavigation } from "./celestial-navigation.ts";
import { describe } from "vitest";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers QAU8WVUZM0-a1 */
describe("Celestial Navigation — Glimpse 5", () => {
  for (const length of [0, 2, 5, 7])
    for (const placement of ["top", "bottom", "split"] as const)
      it(`reorders only the top five: deck=${length}, placement=${placement}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Navigation", 0));
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [celestialNavigation, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(celestialNavigation);
        const deck = p.zone("main-deck").map((c) => c.objectId),
          otherDeck = q.zone("main-deck");
        const before = game.state;
        expect(() => p.activate(source, { reservePayment: [] })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        });
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck);
        passEffectsStack(game);
        const seen = deck.slice(0, 5).reverse();
        const top = placement === "top" ? seen : placement === "split" ? seen.slice(0, 1) : [];
        const bottom = placement === "bottom" ? seen : placement === "split" ? seen.slice(1) : [];
        if (length > 0) {
          const decision = game.state.decision;
          if (decision?.kind !== "resolve-glimpse")
            throw new Error(`Expected Glimpse, got ${decision?.kind}`);
          expect(decision.cardIds).toEqual(deck.slice(0, 5));
          for (const invalid of [
            otherDeck[0]!.objectId,
            source.objectId,
            ...(deck[5] ? [deck[5]] : []),
          ]) {
            const choosing = game.state;
            expect(() =>
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                top: [invalid, ...seen.slice(1)],
                bottom: [],
              }),
            ).toThrow();
            expect(game.state).toEqual(choosing);
          }
          answerDecision(game, "resolve-glimpse", { kind: "reorder", top, bottom });
          passEffectsStack(game);
        }
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
          ...top,
          ...deck.slice(5),
          ...bottom,
        ]);
        expect(p.zone("hand")).toHaveLength(0);
        expect(p.zone("memory")).toHaveLength(2);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(q.zone("main-deck")).toEqual(otherDeck);
        expect(game.state.decision).toBeNull();
      });
});
