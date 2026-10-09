import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { surgingObstruction } from "./surging-obstruction.ts";
import { goldenBishop } from "../../PTM/allies/golden-bishop.ts";
import { goldenRook } from "../../PTM/allies/golden-rook.ts";
import { grayWolf } from "../../DOA/allies/gray-wolf.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers VpM6CAp4ts-a1 @covers VpM6CAp4ts-a2 */
describe("Surging Obstruction — Bishop discount and parity payment", () => {
  for (const matching of [false, true])
    for (const mode of ["none", "own", "two", "opponent", "graveyard", "rook"])
      for (const targetCost of [0, 2, 3])
        for (const accept of [false, true])
          it(`class=${matching}, bishop=${mode}, reserve=${targetCost}, accept=${accept}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(surgingObstruction, matching, "activation-discount"),
            );
            const targetCard =
              targetCost === 0 ? woodlandSquirrels : targetCost === 2 ? grayWolf : goldenRook;
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: "playerTwo",
              playerOne: {
                champion,
                zones: {
                  field:
                    mode === "own"
                      ? [goldenBishop]
                      : mode === "two"
                        ? [goldenBishop, goldenBishop]
                        : mode === "rook"
                          ? [goldenRook]
                          : [],
                  graveyard: mode === "graveyard" ? [goldenBishop] : [],
                  hand: [surgingObstruction, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: mode === "opponent" ? [goldenBishop] : [],
                  hand: [targetCard, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = q.cards(targetCard, { zone: "hand" })[0]!;
            const pay = (player: typeof p, n: number) =>
              player
                .cards(woodlandSquirrels, { zone: "hand" })
                .filter((c) => c.objectId !== source.objectId)
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            q.activate(source, { reservePayment: pay(q, targetCost) });
            const target = game.state.stack.at(-1)!.id;
            q.pass();
            const cost = ["own", "two"].includes(mode) ? 2 : 3;
            const before = game.state;
            for (const invalidCost of [cost - 1, cost + 1]) {
              expect(() =>
                p.activate(surgingObstruction, {
                  reservePayment: pay(p, invalidCost),
                  targets: { "target-stack-item": [target] },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(surgingObstruction, {
              reservePayment: pay(p, cost),
              targets: { "target-stack-item": [target] },
            });
            expect(p.zone("memory")).toHaveLength(cost);
            passEffectsStack(game);
            expect(game.state.decision?.kind).toBe("resolve-effect-payment");
            const tax = targetCost % 2 ? 3 : 1;
            const choosing = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-payment", { reservePayment: pay(q, tax - 1) }),
            ).toThrow();
            expect(game.state).toEqual(choosing);
            answerDecision(
              game,
              "resolve-effect-payment",
              accept ? { reservePayment: pay(q, tax) } : false,
            );
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe(accept ? "field" : "graveyard");
            expect(q.zone("memory")).toHaveLength(targetCost + (accept ? tax : 0));
            expect(p.cards(surgingObstruction, { zone: "graveyard" })).toHaveLength(1);
            expect(game.state.decision).toBeNull();
          });
});
