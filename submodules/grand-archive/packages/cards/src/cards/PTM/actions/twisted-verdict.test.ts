import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { twistedVerdict } from "./twisted-verdict.ts";

/** @covers ANrnYgZNgq-a1 */
describe("Twisted Verdict — opponent chooses two of the controller's top five for memory", () => {
  for (const matching of [false, true])
    for (const length of [0, 1, 2, 3, 5, 7])
      for (const selection of ["first", "last", "split"] as const)
        for (const reverse of [false, true])
          it(`matching=${matching}, length=${length}, selection=${selection}, reverse=${reverse}`, () => {
            const champion = createClassBonusTestChampion(
              twistedVerdict,
              matching,
              "activation-discount",
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [twistedVerdict, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
                  "main-deck": Array.from({ length }, () => woodlandSquirrels),
                  graveyard: [woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: { "main-deck": [woodlandSquirrels], hand: [woodlandSquirrels] },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const deck = p.zone("main-deck"),
              looked = deck.slice(0, 5);
            const hand = p.cards(woodlandSquirrels, { zone: "hand" });
            const source = p.card(twistedVerdict, { zone: "hand" });
            const payment = hand
              .slice(0, 6)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const before = game.state;
            for (const targets of [[], [p.id], [q.id, q.id]]) {
              expect(() =>
                p.activate(source, {
                  reservePayment: payment,
                  targets: { "target-opponent": targets },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(source, { reservePayment: payment, targets: { "target-opponent": [q.id] } });
            passEffectsStack(game);
            const selected =
              selection === "first"
                ? looked.slice(0, 2)
                : selection === "last"
                  ? looked.slice(-2)
                  : looked.length > 1
                    ? [looked[0]!, looked.at(-1)!]
                    : looked;
            const chosen = selected.map((c) => c.objectId);
            if (
              game.state.decision?.kind === "resolve-effect-choice" &&
              game.state.decision.selection.id === "memory-cards"
            ) {
              const decision = game.state.decision;
              expect(decision.playerId).toBe(q.id);
              expect(q.view().decision?.id).toBe(decision.id);
              expect(p.view().decision).toBeNull();
              const before = game.state;
              expect(() =>
                p.execute({
                  move: "answer-decision",
                  decisionId: decision.id,
                  stateVersion: decision.stateVersion,
                  answer: chosen,
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              for (const bad of [
                hand[6]!,
                source,
                q.zone("main-deck")[0]!,
                q.zone("hand")[0]!,
                p.zone("graveyard")[0]!,
                ...deck.slice(5),
              ]) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [bad.objectId, ...chosen.slice(1)]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              if (chosen.length) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", chosen.slice(1)),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              if (chosen.length > 1) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [chosen[0], chosen[0]]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", chosen);
              passEffectsStack(game);
            }
            const remainder = looked
              .filter((c) => !chosen.includes(c.objectId))
              .map((c) => c.objectId);
            if (reverse) remainder.reverse();
            if (game.state.decision?.kind === "resolve-effect-choice") {
              const decision = game.state.decision;
              expect(decision.playerId).toBe(q.id);
              expect(q.view().decision?.id).toBe(decision.id);
              expect(p.view().decision).toBeNull();
              const before = game.state;
              expect(() =>
                p.execute({
                  move: "answer-decision",
                  decisionId: decision.id,
                  stateVersion: decision.stateVersion,
                  answer: remainder,
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              for (const bad of [[], remainder.slice(1), [chosen[0]!, ...remainder.slice(1)]]) {
                expect(() => answerDecision(game, "resolve-effect-choice", bad)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", remainder);
              passEffectsStack(game);
            }
            expect(game.state.decision).toBeNull();
            expect(game.state.stack).toHaveLength(0);
            expect(p.zone("memory").map((c) => c.objectId)).toEqual([
              ...payment.map((c) => c.cardId),
              ...chosen,
            ]);
            expect(p.zone("hand")).toEqual([hand[6]]);
            expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
              ...deck.slice(5).map((c) => c.objectId),
              ...remainder,
            ]);
            expect(q.zone("memory")).toHaveLength(0);
            expect(q.zone("main-deck")).toHaveLength(1);
            expect(q.zone("hand")).toHaveLength(1);
            const looks = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
            for (const event of looks) {
              if (event.type === "cards-looked-at") {
                expect(event.playerId).toBe(q.id);
                expect(event.objectIds).toEqual(looked.map((c) => c.objectId));
              }
            }
            if (length) expect(looks).toHaveLength(1);
            expect(game.state.eventHistory.filter((e) => e.type === "card-revealed")).toHaveLength(
              0,
            );
            expect(game.state.winnerIds).toEqual([]);
          });
});
