import { describe } from "vitest";
import { proveAliceCommandedWill } from "../../../testing/alice-commanded-will.ts";
import { queenPiece } from "./queen-piece.ts";

// @covers m69XrVkaVh-a2
describe("queen-piece — Alice Commanded Will", () => {
  proveAliceCommandedWill(queenPiece, 6);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { snowWhiteWeissQueen } from "../../DTR/allies/snow-white-weiss-queen.ts";
import { pawnPiece } from "./pawn-piece.ts";

/** @covers m69XrVkaVh-a1 */
describe("Queen Piece — Alice and a controlled Pawn prevent each damage event", () => {
  for (const named of [false, true])
    for (const support of ["none", "own-pawn", "opposing-pawn", "other-chessman"] as const)
      for (const kind of ["spell", "combat", "unpreventable"] as const)
        it(`Alice=${named}, support=${support}, damage=${kind}`, () => {
          const champion = enableAllTestElements(lineageTestChampion(named ? "Alice" : "Other", 0));
          const base = enableAllTestElements(lineageTestChampion("Other", 0));
          const opponent = grantTestChampionLevel(
            {
              ...base,
              layout: {
                kind: "single-faced",
                face: { ...requireSingleFace(base), stats: { level: 0, life: 30, power: 3 } },
              },
            },
            2,
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [
                  queenPiece,
                  ...(support === "own-pawn"
                    ? [pawnPiece]
                    : support === "other-chessman"
                      ? [snowWhiteWeissQueen]
                      : []),
                ],
              },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                field: support === "opposing-pawn" ? [pawnPiece] : [],
                hand: [
                  fireball,
                  fireball,
                  sparkAlight,
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            queen = p.card(queenPiece),
            protectedQueen = named && support === "own-pawn",
            expected = kind === "unpreventable" ? 2 : protectedQueen ? 0 : 3;
          for (let i = 0; i < (kind === "spell" && protectedQueen ? 2 : 1); i++) {
            if (kind === "combat") {
              q.declareAttack(q.card(opponent), queen);
              game.resolveCombatWithoutRetaliation();
            } else {
              q.activate(q.cards(kind === "spell" ? fireball : sparkAlight, { zone: "hand" })[0]!, {
                targets: { "target-1": [queen.objectId] },
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, kind === "spell" ? 4 : 2)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              });
              passEffectsStack(game);
            }
            expect(game.state.objects[queen.objectId]!.damage).toBe(expected);
            expect(game.state.objects[queen.objectId]!.zone).toBe("field");
          }
        });
  for (const count of [1, 2])
    it(`protection ends only after the last of ${count} Pawns leaves`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Alice", 0)),
        opponent = grantTestChampionLevel(
          enableAllTestElements(lineageTestChampion("Other", 0)),
          2,
        );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: { field: [queenPiece, ...Array.from({ length: count }, () => pawnPiece)] },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            hand: [
              fireball,
              fireball,
              fireball,
              sparkAlight,
              sparkAlight,
              ...Array.from({ length: 16 }, () => woodlandSquirrels),
            ],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        queen = p.card(queenPiece),
        pawns = p.cards(pawnPiece);
      const cast = (
        card: typeof fireball | typeof sparkAlight,
        target: typeof queen,
        cost: number,
      ) => {
        q.activate(q.cards(card, { zone: "hand" })[0]!, {
          targets: { "target-1": [target.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
      };
      cast(fireball, queen, 4);
      expect(game.state.objects[queen.objectId]!.damage).toBe(0);
      for (const [i, pawn] of pawns.entries()) {
        cast(sparkAlight, pawn, 2);
        expect(game.state.objects[pawn.objectId]).toBeUndefined();
        cast(fireball, queen, 4);
        expect(game.state.objects[queen.objectId]!.damage).toBe(i === count - 1 ? 3 : 0);
      }
    });
});
