import { describe, expect, it } from "vitest";
import { enPassant } from "./en-passant.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers pZAA0nHyXM-a1 */
describe("En Passant — Command", () => {
  proveCommandAttack({ card: enPassant });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  passEffectsStack,
  declareResolvedAttack,
  advanceToMain,
} from "../../../testing/decisions.ts";
import { pawnPiece } from "../tokens/pawn-piece.ts";
import { snowWhiteWeissQueen } from "../../DTR/allies/snow-white-weiss-queen.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers pZAA0nHyXM-a2 */
describe("En Passant — Pawn-only On Kill", () => {
  for (const pawn of [false, true])
    it(`grants two buff counters once only to a Pawn: ${pawn}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(enPassant, false, "activation-discount"),
      );
      const ally = pawn ? pawnPiece : snowWhiteWeissQueen;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [enPassant, enPassant, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            field: [ally],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        attacker = p.card(ally);
      const attacks = p.cards(enPassant),
        targets = q.cards(woodlandSquirrels, { zone: "field" });
      for (let index = 0; index < 2; index++) {
        if (index) advanceToMain(game, p.id, game.state.turn.number);
        p.activate(attacks[index]!, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          attackAttackerId: attacker.objectId,
        });
        passEffectsStack(game);
        declareResolvedAttack(game, attacker.objectId, targets[index]!.objectId, "En Passant kill");
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[targets[index]!.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[attacker.objectId]!.counters.buff ?? 0).toBe(pawn ? 2 : 0);
      }
    });
});
