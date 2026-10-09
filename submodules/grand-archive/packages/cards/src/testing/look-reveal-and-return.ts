import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
type Card = GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;

/** Exercise an actual top-deck reveal, optional hand or memory transfer, and ordered bottom return. */
export function proveLookRevealAndReturn(
  source: Card,
  amount: number,
  cost: number,
  eligible: readonly Card[],
  destination: "hand" | "memory" = "hand",
  sourceDestination: "graveyard" | "field" = "graveyard",
) {
  for (const matching of [false, true])
    for (const candidate of eligible)
      for (const length of [0, 1, amount - 1, amount, amount + 2])
        for (const mode of ["take", "decline", "no-match"] as const)
          it(`matching=${matching}, candidate=${candidate.slug}, deck=${length}, mode=${mode}`, () => {
            const champion = createClassBonusTestChampion(source, matching, "activation-discount");
            const contents = Array.from({ length }, (_, index) =>
              mode !== "no-match" && (index === 0 || index === amount - 1 || index >= amount)
                ? candidate
                : woodlandSquirrels,
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [
                    source,
                    ...Array.from({ length: cost }, () => woodlandSquirrels),
                    candidate,
                  ],
                  "main-deck": contents,
                  graveyard: [candidate],
                },
              },
              playerTwo: { champion, zones: { "main-deck": [candidate], hand: [candidate] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const deck = p.zone("main-deck"),
              looked = deck.slice(0, amount);
            const held = p.card(candidate, { zone: "hand" });
            const dead = p.card(candidate, { zone: "graveyard" });
            const sourceRef = p.card(source, { zone: "hand" });
            const payment = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            p.activate(sourceRef, { reservePayment: payment });
            passEffectsStack(game);
            const chosen =
              mode === "take"
                ? looked.filter((c) => c.definitionId === candidate.canonicalId).at(-1)
                : undefined;
            if (
              game.state.decision?.kind === "resolve-effect-choice" &&
              game.state.decision.selection.id === "chosen-card"
            ) {
              const before = game.state;
              const invalid = [
                held,
                dead,
                sourceRef,
                q.zone("main-deck")[0]!,
                q.zone("hand")[0]!,
                ...deck.slice(amount),
                ...looked.filter((c) => c.definitionId !== candidate.canonicalId),
              ];
              for (const bad of invalid) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [bad.objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              if (chosen) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [chosen.objectId, chosen.objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", chosen ? [chosen.objectId] : []);
              passEffectsStack(game);
            } else expect(chosen).toBeUndefined();
            const remainder = looked
              .filter((c) => c.objectId !== chosen?.objectId)
              .reverse()
              .map((c) => c.objectId);
            if (game.state.decision?.kind === "resolve-effect-choice") {
              const before = game.state;
              if (remainder.length) {
                for (const bad of [
                  [],
                  remainder.slice(1),
                  [held.objectId, ...remainder.slice(1)],
                  ...(chosen ? [[chosen.objectId, ...remainder.slice(1)]] : []),
                ]) {
                  expect(() => answerDecision(game, "resolve-effect-choice", bad)).toThrow();
                  expect(game.state).toEqual(before);
                }
              }
              answerDecision(game, "resolve-effect-choice", remainder);
              passEffectsStack(game);
            }
            expect(game.state.decision).toBeNull();
            expect(game.state.stack).toHaveLength(0);
            expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
              ...deck.slice(amount).map((c) => c.objectId),
              ...remainder,
            ]);
            expect(p.zone("hand").map((c) => c.objectId)).toEqual([
              held.objectId,
              ...(chosen && destination === "hand" ? [chosen.objectId] : []),
            ]);
            expect(p.zone("memory").map((c) => c.objectId)).toEqual([
              ...payment.map((c) => c.cardId),
              ...(chosen && destination === "memory" ? [chosen.objectId] : []),
            ]);
            expect(p.zone("graveyard").map((c) => c.objectId)).toEqual([
              dead.objectId,
              ...(sourceDestination === "graveyard" ? [sourceRef.objectId] : []),
            ]);
            expect(p.card(source, { zone: sourceDestination }).objectId).toBe(sourceRef.objectId);
            const reveals = game.state.eventHistory.filter((e) => e.type === "card-revealed");
            expect(reveals.map((e) => e.objectId)).toEqual(chosen ? [chosen.objectId] : []);
            expect(q.zone("hand")).toHaveLength(1);
            expect(q.zone("main-deck")).toHaveLength(1);
            expect(game.state.winnerIds).toEqual([]);
          });
}
