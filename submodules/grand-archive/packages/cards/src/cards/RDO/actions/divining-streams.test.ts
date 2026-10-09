import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { diviningStreams } from "./divining-streams.ts";

/** @covers TLqUZgBeg7-a2 */
describe("Divining Streams — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: diviningStreams });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

/** @covers TLqUZgBeg7-a1 */
describe("Divining Streams — assign distinct looked-at cards to graveyard, top, and bottom", () => {
  for (const matching of [false, true])
    for (const length of [0, 1, 2, 3, 5])
      for (const order of [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0],
      ])
        it(`matching=${matching}, length=${length}, order=${order.join()}`, () => {
          const champion = createClassBonusTestChampion(
            diviningStreams,
            matching,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [diviningStreams, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                "main-deck": Array.from({ length }, () => woodlandSquirrels),
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const deck = p.zone("main-deck"),
            looked = deck.slice(0, 3);
          const hand = p.cards(woodlandSquirrels, { zone: "hand" });
          const source = p.card(diviningStreams, { zone: "hand" });
          const payment = hand
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const picked = order.filter((i) => i < looked.length).map((i) => looked[i]!);
          const grave = picked[0],
            top = picked[1],
            bottom = picked[2];
          p.activate(source, { reservePayment: payment });
          passEffectsStack(game);
          for (const step of [
            { id: "graveyard-card", card: grave },
            { id: "top-card", card: top },
          ]) {
            if (
              game.state.decision?.kind === "resolve-effect-choice" &&
              game.state.decision.selection.id === step.id
            ) {
              expect(step.card).toBeDefined();
              const before = game.state;
              const invalid = [
                source,
                hand[3]!,
                q.zone("main-deck")[0]!,
                ...deck.slice(3),
                ...(step.id === "top-card" && grave ? [grave] : []),
              ];
              for (const bad of invalid) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [bad.objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              for (const bad of [[], [step.card!.objectId, step.card!.objectId]]) {
                expect(() => answerDecision(game, "resolve-effect-choice", bad)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", [step.card!.objectId]);
              passEffectsStack(game);
            }
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          expect(p.zone("graveyard").map((c) => c.objectId)).toEqual([
            ...(grave ? [grave.objectId] : []),
            source.objectId,
          ]);
          expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
            ...(top ? [top.objectId] : []),
            ...deck.slice(3).map((c) => c.objectId),
            ...(bottom ? [bottom.objectId] : []),
          ]);
          expect(p.zone("hand")).toEqual([hand[3]]);
          expect(p.zone("memory").map((c) => c.objectId)).toEqual(payment.map((c) => c.cardId));
          expect(q.zone("main-deck")).toHaveLength(1);
          expect(game.state.eventHistory.filter((e) => e.type === "card-revealed")).toHaveLength(0);
          expect(game.state.winnerIds).toEqual([]);
        });
});
