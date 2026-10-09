import { describe, expect, it } from "vitest";
import { gleamingSmolder } from "./gleaming-smolder.ts";
import { proveDrawThenDiscard } from "../../../testing/draw-then-discard.ts";

/** @covers THjSE7caau-a1 */
describe("gleaming-smolder — draw then discard", () => {
  proveDrawThenDiscard(gleamingSmolder, 1, 1);
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers THjSE7caau-a2 */
describe("Gleaming Smolder — Merlin's conditional sheen", () => {
  for (const matching of [false, true])
    for (const fire of [false, true])
      for (const discardNew of [false, true])
        for (const chosenKind of [
          "own-ally",
          "own-champion",
          "opposing-ally",
          "opposing-champion",
        ] as const)
          it(`lineage=${matching}, fire=${fire}, new=${discardNew}, choose=${chosenKind}`, () => {
            const champion = enableAllTestElements(
              lineageTestChampion(matching ? "Merlin" : "Other", 0),
            );
            const discardCard = fire ? sparkAlight : woodlandSquirrels;
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [
                    gleamingSmolder,
                    gleamingSmolder,
                    discardCard,
                    ...Array.from({ length: 6 }, () => woodlandSquirrels),
                  ],
                  field: [woodlandSquirrels, trainingSword],
                  graveyard: [woodlandSquirrels, sparkAlight],
                  "main-deck": [discardCard, discardCard, discardCard],
                },
              },
              playerTwo: {
                champion,
                zones: { field: [woodlandSquirrels, trainingSword], hand: [sparkAlight] },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const sources = p.cards(gleamingSmolder),
              old = p.cards(discardCard, { zone: "hand" })[0]!,
              top = p.zone("main-deck")[0]!;
            const owner = chosenKind.startsWith("own") ? p : q;
            const chosen = chosenKind.endsWith("champion")
              ? owner.card(champion)
              : owner.card(woodlandSquirrels, { zone: "field" });
            const units = [
              p.card(champion),
              q.card(champion),
              p.card(woodlandSquirrels, { zone: "field" }),
              q.card(woodlandSquirrels, { zone: "field" }),
            ];
            const payment = () =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .filter((c) => c.objectId !== old.objectId)
                .slice(0, 2)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            p.activate(sources[0]!, { reservePayment: payment() });
            passEffectsStack(game);
            expect(game.state.decision?.kind).toBe("resolve-effect-choice");
            const discarded = discardNew ? top : old;
            answerDecision(game, "resolve-effect-choice", [discarded.objectId]);
            passEffectsStack(game);
            if (matching && fire) {
              expect(game.state.decision).toMatchObject({
                kind: "resolve-effect-choice",
                playerId: p.id,
              });
              for (const ids of [
                [],
                [p.card(trainingSword).objectId],
                [q.card(trainingSword).objectId],
                [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
                [sources[0]!.objectId],
                [chosen.objectId, chosen.objectId],
                [p.card(champion).objectId, q.card(champion).objectId],
              ]) {
                const before = game.state;
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
              passEffectsStack(game);
            }
            expect(game.state.decision).toBeNull();
            for (const unit of units)
              expect(game.state.objects[unit.objectId]!.counters["named:sheen"] ?? 0).toBe(
                matching && fire && unit.objectId === chosen.objectId ? 2 : 0,
              );
            expect(game.state.objects[discarded.objectId]!.zone).toBe("graveyard");
            expect(game.state.objects[sources[0]!.objectId]!.zone).toBe("graveyard");
            // A previous fire discard and fire cards already in the graveyard do not qualify.
            p.activate(sources[1]!, { reservePayment: payment() });
            passEffectsStack(game);
            answerDecision(game, "resolve-effect-choice", [
              p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
            ]);
            passEffectsStack(game);
            expect(game.state.decision).toBeNull();
            for (const unit of units)
              expect(game.state.objects[unit.objectId]!.counters["named:sheen"] ?? 0).toBe(
                matching && fire && unit.objectId === chosen.objectId ? 2 : 0,
              );
          });
});
