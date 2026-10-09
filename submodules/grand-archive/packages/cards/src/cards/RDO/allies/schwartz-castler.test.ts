import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { schwartzCastler } from "./schwartz-castler.ts";
import { pawnPiece } from "../../PTM/tokens/pawn-piece.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers PDLfDZFari-a2 */
describe("Schwartz Castler even-life entry condition", () => {
  for (const alice of [false, true])
    for (const even of [false, true])
      it(`requires Alice ${alice} and opposing even life ${even}`, () => {
        const champion = enableAllTestElements(lineageTestChampion(alice ? "Alice" : "Other", 0));
        const opponent = even
          ? lineageTestChampion("Foe", 0)
          : createClassBonusTestChampion(schwartzCastler, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          definitions: [pawnPiece],
          playerOne: {
            champion,
            zones: {
              hand: [schwartzCastler, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion: opponent },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        p.activate(schwartzCastler, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(p.cards(pawnPiece, { zone: "field" })).toHaveLength(alice && even ? 1 : 0);
        expect(q.cards(pawnPiece, { zone: "field" })).toHaveLength(0);
      });
});

import { proveCommandedWill } from "../../../testing/commanded-will.ts";
/** @covers PDLfDZFari-a1 */
describe("schwartzCastler — Commanded Will", () => {
  proveCommandedWill(schwartzCastler, 1);
});
