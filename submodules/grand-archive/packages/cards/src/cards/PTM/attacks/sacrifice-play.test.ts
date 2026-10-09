import { describe, expect, it } from "vitest";
import { sacrificePlay } from "./sacrifice-play.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers 1jmQ9XSLph-a2 */
describe("Sacrifice Play — Command", () => {
  proveCommandAttack({ card: sacrificePlay, sacrifice: true });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, declareResolvedAttack } from "../../../testing/decisions.ts";
import { pawnPiece } from "../tokens/pawn-piece.ts";
import { snowWhiteWeissQueen } from "../../DTR/allies/snow-white-weiss-queen.ts";
import { spirelleSchwartzQueen } from "../../DTR/allies/spirelle-schwartz-queen.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers 1jmQ9XSLph-a1
 * @covers 1jmQ9XSLph-a3
 */
describe("Sacrifice Play — sacrificed allies set intent power", () => {
  for (const count of [0, 1, 2])
    it(`sacrifices ${count} awake Chessman allies at activation`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(sacrificePlay, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [sacrificePlay, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: [
              spirelleSchwartzQueen,
              snowWhiteWeissQueen,
              pawnPiece,
              pawnPiece,
              pawnPiece,
              woodlandSquirrels,
            ],
          },
        },
        playerTwo: { champion, zones: { field: [pawnPiece] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        attacker = p.card(spirelleSchwartzQueen),
        target = q.card(champion),
        pawns = p.cards(pawnPiece);
      p.declareAttack(snowWhiteWeissQueen, target);
      game.resolveCombatWithoutRetaliation();
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      for (const invalid of [
        [p.card(champion).objectId],
        [p.card(woodlandSquirrels, { zone: "field" }).objectId],
        [q.card(pawnPiece).objectId],
        [p.card(snowWhiteWeissQueen).objectId],
        pawns.map((ref) => ref.objectId),
        [pawns[0]!.objectId, pawns[0]!.objectId],
      ]) {
        const before = game.state;
        expect(() =>
          p.activate(sacrificePlay, {
            reservePayment,
            attackAttackerId: attacker.objectId,
            costSelections: [invalid],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(sacrificePlay, {
        reservePayment,
        attackAttackerId: attacker.objectId,
        costSelections: [pawns.slice(0, count).map((ref) => ref.objectId)],
      });
      expect(p.cards(pawnPiece, { zone: "field" })).toHaveLength(3 - count);
      passEffectsStack(game);
      declareResolvedAttack(
        game,
        attacker.objectId,
        target.objectId,
        "Sacrifice Play with paid additional cost",
      );
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(1 + 2 + 2 * count);
      expect(p.cards(pawnPiece, { zone: "field" })).toHaveLength(3 - count);
    });
});
