import { describe } from "vitest";
import { proveAliceCommandedWill } from "../../../testing/alice-commanded-will.ts";
import { pawnPiece } from "./pawn-piece.ts";

// @covers Rpr6yCQKU6-a1
describe("pawn-piece — Alice Commanded Will", () => {
  proveAliceCommandedWill(pawnPiece, 1);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { trainingSession } from "../../DOA/actions/training-session.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { simpleSlime } from "../../RDO/allies/simple-slime.ts";
import { queenPiece } from "./queen-piece.ts";

/** @covers Rpr6yCQKU6-a2 */
describe("Pawn Piece — optional promotion requires seven actual combat damage", () => {
  for (const named of [false, true])
    for (const power of [6, 7, 8])
      for (const accept of [false, true])
        for (const mode of ["attack", "retaliation", "prevented"] as const)
          it(`Alice=${named}, power=${power}, accept=${accept}, mode=${mode}`, () => {
            const champion = enableAllTestElements(
                lineageTestChampion(named ? "Alice" : "Other", 0),
              ),
              base = lineageTestChampion("Other", 0);
            const opponent = {
              ...base,
              layout: {
                kind: "single-faced" as const,
                face: { ...requireSingleFace(base), stats: { level: 0, life: 30, power: 1 } },
              },
            };
            const game = GrandArchiveTestEngine.startFixture({
              definitions: [queenPiece],
              playerOne: {
                champion,
                zones: {
                  field: [pawnPiece],
                  hand: [
                    ...Array.from({ length: power }, () => trainingSession),
                    ...Array.from({ length: power * 2 }, () => woodlandSquirrels),
                  ],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion: opponent,
                zones: {
                  field: [simpleSlime],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              pawn = p.card(pawnPiece),
              foe = mode === "prevented" ? q.card(simpleSlime) : q.card(opponent);
            for (const spell of p.cards(trainingSession, { zone: "hand" })) {
              p.activate(spell, {
                targets: { "target-1": [pawn.objectId] },
                reservePayment: p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 2)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              });
              passEffectsStack(game);
            }
            if (mode === "retaliation") {
              advanceToMain(game, q.id);
              q.declareAttack(foe, pawn);
            } else p.declareAttack(pawn, foe);
            const start = game.state.eventHistory.length;
            let offers = 0,
              retaliations = 0;
            for (
              let i = 0;
              i < 96 && (game.state.combat || game.state.stack.length || game.state.decision);
              i++
            ) {
              const decision = game.state.decision;
              if (decision?.kind === "choose-retaliators") {
                answerDecision(game, decision.kind, mode === "retaliation" ? [pawn.objectId] : []);
                retaliations++;
              } else if (decision?.kind === "resolve-optional-effect") {
                offers++;
                expect(game.state.objects[pawn.objectId]!.zone).toBe("field");
                expect(p.cards(queenPiece, { zone: "field" })).toHaveLength(0);
                answerDecision(game, decision.kind, accept);
              } else {
                const w = game.waitState();
                if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
                game.player(w.playerId).pass();
              }
            }
            const dealt = game.state.eventHistory
              .slice(start)
              .filter((e) => e.type === "damage-marked" && e.objectId === foe.objectId)
              .reduce((n, e) => n + (e.type === "damage-marked" ? e.amount : 0), 0);
            expect(dealt).toBe(power - (mode === "prevented" ? 3 : 0));
            const eligible = named && dealt >= 7,
              promoted = eligible && accept;
            expect(offers).toBe(eligible ? 1 : 0);
            if (mode === "retaliation") expect(retaliations).toBe(1);
            expect(game.state.objects[pawn.objectId]?.zone).toBe(promoted ? undefined : "field");
            const queens = p.cards(queenPiece, { zone: "field" });
            expect(queens).toHaveLength(promoted ? 1 : 0);
            expect(q.cards(queenPiece, { zone: "field" })).toHaveLength(0);
            if (promoted)
              expect(game.state.objects[queens[0]!.objectId]).toMatchObject({
                isToken: true,
                controllerId: p.id,
                ownerId: p.id,
              });
            expect(game.state.combat).toBeNull();
            expect(game.state.stack).toHaveLength(0);
            expect(game.state.decision).toBeNull();
          });
});
