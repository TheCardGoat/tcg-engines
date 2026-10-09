import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import { deepSeaFractal } from "../../FTC/phantasias/deep-sea-fractal.ts";
import { fractalOfRefreshment } from "./fractal-of-refreshment.ts";

/** @covers cxqf8rr452-a2 */
describe("Fractal of Refreshment — optional water memory exchange", () => {
  for (const matching of [false, true])
    for (const waterCount of [0, 1, 4])
      for (const deckSize of [0, 2, 5])
        for (const count of [-1, 0, 1, 3].filter((c) => c <= waterCount))
          it(`class=${matching}, water=${waterCount}, deck=${deckSize}, revealed=${count}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(fractalOfRefreshment, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [
                    fractalOfRefreshment,
                    deepSeaFractal,
                    ...Array.from({ length: 3 }, () => woodlandSquirrels),
                  ],
                  memory: [fireball, ...Array.from({ length: waterCount }, () => deepSeaFractal)],
                  "main-deck": [
                    fireball,
                    favorableWinds,
                    woodlandSquirrels,
                    fireball,
                    favorableWinds,
                  ].slice(0, deckSize),
                },
              },
              playerTwo: {
                champion,
                zones: { memory: [deepSeaFractal], "main-deck": [woodlandSquirrels] },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = p.card(fractalOfRefreshment);
            const deck = p.zone("main-deck"),
              enemyMemory = q.zone("memory"),
              enemyDeck = q.zone("main-deck");
            p.activate(source, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            });
            const memory = p.zone("memory"),
              selected = [...p.cards(deepSeaFractal, { zone: "memory" })]
                .reverse()
                .slice(0, Math.max(0, count));
            expect(game.state.objects[source.objectId]?.zone).toBe("effects-stack");
            expect(p.zone("main-deck")).toEqual(deck);
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]?.zone).toBe("field");
            if (game.state.decision?.kind === "resolve-optional-effect") {
              expect(game.state.decision.playerId).toBe(p.id);
              answerDecision(game, "resolve-optional-effect", count >= 0);
              passEffectsStack(game);
            } else expect(waterCount).toBe(0);
            if (count >= 0 && waterCount) {
              expect(game.state.decision).toMatchObject({
                kind: "resolve-effect-choice",
                playerId: p.id,
              });
              expect(p.zone("memory")).toEqual(memory);
              expect(p.zone("main-deck")).toEqual(deck);
              const eligible = p.cards(deepSeaFractal, { zone: "memory" });
              for (const ids of [
                [q.card(deepSeaFractal).objectId],
                [p.card(fireball, { zone: "memory" }).objectId],
                [p.card(deepSeaFractal, { zone: "hand" }).objectId],
                [source.objectId],
                [eligible[0]!.objectId, eligible[0]!.objectId],
                ...(waterCount === 4 ? [eligible.map((c) => c.objectId)] : []),
              ]) {
                const before = game.state;
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(
                game,
                "resolve-effect-choice",
                selected.map((c) => c.objectId),
              );
              passEffectsStack(game);
            }
            const returned = selected.length > 1 ? [...selected].reverse() : selected;
            if (selected.length > 1) {
              expect(game.state.decision).toMatchObject({
                kind: "resolve-effect-choice",
                playerId: p.id,
                selection: { ordered: true },
              });
              expect(p.zone("main-deck")).toEqual(deck);
              expect(p.zone("memory")).toEqual(memory);
              for (const ids of [
                [],
                selected.slice(1).map((c) => c.objectId),
                [selected[0]!.objectId, selected[0]!.objectId, selected[2]!.objectId],
                [
                  selected[0]!.objectId,
                  selected[1]!.objectId,
                  p.card(fireball, { zone: "memory" }).objectId,
                ],
              ]) {
                const before = game.state;
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(
                game,
                "resolve-effect-choice",
                returned.map((c) => c.objectId),
              );
              passEffectsStack(game);
            }
            const combined = [...deck, ...returned],
              drawn = combined.slice(0, selected.length);
            expect(p.zone("main-deck")).toEqual(combined.slice(selected.length));
            expect(p.zone("memory")).toEqual([
              ...memory.filter((c) => !selected.some((x) => x.objectId === c.objectId)),
              ...drawn,
            ]);
            expect(p.zone("hand")).toEqual([p.card(deepSeaFractal, { zone: "hand" })]);
            expect(q.zone("memory")).toEqual(enemyMemory);
            expect(q.zone("main-deck")).toEqual(enemyDeck);
            expect(
              game.state.eventHistory
                .filter((e) => e.type === "card-revealed")
                .map((e) => (e.type === "card-revealed" ? e.objectId : undefined)),
            ).toEqual(selected.map((c) => c.objectId));
            expect(game.state.decision).toBeNull();
            expect(game.state.winnerIds).toEqual([]);
          });
});
