import type { GrandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import { describe } from "vitest";
import { veiledGambit } from "./veiled-gambit.ts";
import { pawnPiece } from "../tokens/pawn-piece.ts";
import { spirelleSchwartzQueen } from "../../DTR/allies/spirelle-schwartz-queen.ts";
import { proveAdditionalSacrifice } from "../../../testing/additional-sacrifice.ts";
/** @covers hxdfyA0eP1-a1 */
describe("veiled-gambit additional sacrifice", () => {
  proveAdditionalSacrifice(veiledGambit, 1, [pawnPiece, spirelleSchwartzQueen]);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { fireball } from "../../DOA/actions/fireball.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

function preventionFixture() {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(fireball, true, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [
          veiledGambit,
          ...Array.from({ length: 12 }, () => fireball),
          sparkAlight,
          sparkAlight,
          ...Array.from({ length: 30 }, () => woodlandSquirrels),
        ],
        field: [pawnPiece, giantTortoise, trainingSword],
        "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [giantTortoise],
        "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const pay = (n: number) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const cast = (targetIds: GrandArchiveObjectId[]) =>
    p.activate(veiledGambit, {
      reservePayment: pay(1),
      targets: { "target-1": targetIds },
      costSelections: [[p.card(pawnPiece).objectId]],
    });
  const hit = (targetId: GrandArchiveObjectId, unpreventable = false) => {
    p.activate(p.cards(unpreventable ? sparkAlight : fireball, { zone: "hand" })[0]!, {
      reservePayment: pay(2),
      targets: { "target-1": [targetId] },
    });
    passEffectsStack(game);
  };
  return { game, p, q, champion, cast, hit };
}

/** @covers hxdfyA0eP1-a2 */
describe("Veiled Gambit — prevention", () => {
  it("excludes the champion already protected and rejects nonunits and duplicate targets", () => {
    const { game, p, q, champion, cast } = preventionFixture();
    const before = game.state;
    for (const ids of [
      [p.card(champion).objectId],
      [p.card(trainingSword).objectId],
      [q.card(champion).objectId, q.card(champion).objectId],
    ]) {
      expect(() => cast(ids)).toThrow();
      expect(game.state).toEqual(before);
    }
  });
  for (const targetKind of ["none", "own-ally", "opposing-ally", "opposing-champion"])
    for (const expired of [false, true])
      for (const targetFirst of [false, true])
        it(`tracks damage independently: ${targetKind}, expired=${expired}, targetFirst=${targetFirst}`, () => {
          const { game, p, q, champion, cast, hit } = preventionFixture();
          const own = p.card(champion).objectId;
          const other =
            targetKind === "none"
              ? undefined
              : targetKind === "own-ally"
                ? p.card(giantTortoise).objectId
                : targetKind === "opposing-ally"
                  ? q.card(giantTortoise).objectId
                  : q.card(champion).objectId;
          cast(other ? [other] : []);
          passEffectsStack(game);
          if (expired) advanceToMain(game, "player-one", game.state.turn.number);
          const recipients = other ? (targetFirst ? [other, own] : [own, other]) : [own];
          if (!expired)
            for (const id of recipients) {
              hit(id, true);
              expect(game.state.objects[id]!.damage).toBe(3);
            }
          for (let n = 1; n <= (expired ? 1 : 5); n++) {
            for (const id of recipients) {
              hit(id);
              expect(game.state.objects[id]!.damage).toBe(expired ? 1 : 3 + Math.max(0, n - 4));
            }
          }
          const untouched =
            targetKind === "own-ally"
              ? q.card(giantTortoise).objectId
              : p.card(giantTortoise).objectId;
          hit(untouched);
          expect(game.state.objects[untouched]!.damage).toBe(1);
          expect(game.state.decision).toBeNull();
        });
});
