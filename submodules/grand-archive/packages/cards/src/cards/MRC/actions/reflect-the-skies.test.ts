import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { reflectTheSkies } from "./reflect-the-skies.ts";

/** @covers 67duh1cy3g-a1 */
describe("Reflect the Skies — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: reflectTheSkies, discount: 1 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";

/** @covers 67duh1cy3g-a2 */
describe("Reflect the Skies — random bottom cards then Glimpse", () => {
  for (const matching of [false, true])
    for (const deckSize of [0, 1, 3, 4, 6, 8])
      for (const placement of ["top", "bottom", "split"] as const)
        for (const randomSeed of [41, 87])
          it(`class=${matching}, deck=${deckSize}, placement=${placement}, seed=${randomSeed}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(reflectTheSkies, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              randomSeed,
              playerOne: {
                champion,
                zones: {
                  hand: [reflectTheSkies, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                  "main-deck": Array.from({ length: deckSize }, (_, i) =>
                    i % 2 ? fireball : favorableWinds,
                  ),
                },
              },
              playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = p.card(reflectTheSkies);
            const deck = p.zone("main-deck").map((c) => c.objectId),
              enemyDeck = q.zone("main-deck"),
              randomBefore = game.state.random;
            const cost = matching ? 2 : 3,
              pay = (n: number) =>
                p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, n)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            for (const invalid of [cost - 1, cost + 1]) {
              const before = game.state;
              expect(() => p.activate(source, { reservePayment: pay(invalid) })).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(source, { reservePayment: pay(cost) });
            expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck);
            passEffectsStack(game);
            if (game.state.decision?.kind === "resolve-effect-choice") {
              expect(game.state.decision.playerId).toBe(p.id);
              const bottom = deck.slice(Math.max(0, deck.length - 4));
              for (const invalid of [
                [],
                [q.zone("main-deck")[0]!.objectId],
                ...(deck.length > 4 ? [deck.slice(0, 4)] : []),
              ]) {
                const before = game.state;
                expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", bottom);
              passEffectsStack(game);
            }
            const shuffled = p.zone("main-deck").map((c) => c.objectId),
              moved = Math.min(4, deckSize);
            expect(new Set(shuffled.slice(0, moved))).toEqual(
              new Set(deck.slice(deck.length - moved)),
            );
            expect(shuffled.slice(moved)).toEqual(deck.slice(0, deck.length - moved));
            if (moved > 1) expect(game.state.random).not.toEqual(randomBefore);
            if (deckSize) {
              expect(game.state.decision).toMatchObject({
                kind: "resolve-glimpse",
                playerId: p.id,
                cardIds: shuffled.slice(0, 2),
              });
              const viewed = shuffled.slice(0, 2),
                top =
                  placement === "top"
                    ? [...viewed].reverse()
                    : placement === "split"
                      ? viewed.slice(-1)
                      : [],
                bottom =
                  placement === "bottom"
                    ? [...viewed].reverse()
                    : placement === "split"
                      ? viewed.slice(0, -1)
                      : [];
              for (const answer of [
                { kind: "reorder", top: [], bottom: [] },
                {
                  kind: "reorder",
                  top: [q.zone("main-deck")[0]!.objectId],
                  bottom: viewed.slice(1),
                },
                { kind: "reorder", top: [viewed[0]!, ...viewed], bottom: [] },
              ]) {
                const before = game.state;
                expect(() => answerDecision(game, "resolve-glimpse", answer)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-glimpse", { kind: "reorder", top, bottom });
              passEffectsStack(game);
              expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
                ...top,
                ...shuffled.slice(viewed.length),
                ...bottom,
              ]);
            }
            expect(game.state.decision).toBeNull();
            expect(game.state.winnerIds).toEqual([]);
            expect(p.zone("hand")).toHaveLength(4 - cost);
            expect(p.zone("memory")).toHaveLength(cost);
            expect(q.zone("main-deck")).toEqual(enemyDeck);
            expect(game.state.objects[source.objectId]?.zone).toBe("graveyard");
          });
});
