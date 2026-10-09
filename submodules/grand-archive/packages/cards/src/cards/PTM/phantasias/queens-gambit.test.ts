import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { queensGambit } from "./queens-gambit.ts";
import { queenPiece } from "../tokens/queen-piece.ts";
import { pawnPiece } from "../tokens/pawn-piece.ts";
import { spirelleSchwartzQueen } from "../../DTR/allies/spirelle-schwartz-queen.ts";
import { goldenPawn } from "../allies/golden-pawn.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers NGAy4rNwUo-a1 @covers NGAy4rNwUo-a2 */
describe("Queen's Gambit — sacrificed Chessman", () => {
  for (const sacrifice of [queenPiece, spirelleSchwartzQueen, pawnPiece, goldenPawn]) {
    it(`uses the sacrificed ${sacrifice.slug} for its entry effect`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(queensGambit, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [pawnPiece],
        playerOne: {
          champion,
          zones: {
            hand: [queensGambit, woodlandSquirrels, woodlandSquirrels],
            field: [sacrifice, woodlandSquirrels, trainingSword],
            graveyard: [sacrifice],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [sacrifice] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(queensGambit),
        paid = p.card(sacrifice, { zone: "field" });
      const deck = p.zone("main-deck");
      const top = deck[sacrifice === goldenPawn ? 1 : 0]!;
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      for (const ids of [
        [],
        [paid.objectId, paid.objectId],
        [q.card(sacrifice).objectId],
        [p.card(sacrifice, { zone: "graveyard" }).objectId],
        [p.card(woodlandSquirrels, { zone: "field" }).objectId],
        [p.card(trainingSword).objectId],
      ]) {
        expect(() => p.activate(source, { reservePayment, costSelections: [ids] })).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(source, { reservePayment, costSelections: [[paid.objectId]] });
      expect(game.state.objects[paid.objectId]?.zone).not.toBe("field");
      expect(p.zone("memory")).toHaveLength(2);
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(p.zone("memory")).toContainEqual(top);
      expect(p.zone("memory")).toHaveLength(3);
      expect(p.zone("main-deck")).toHaveLength(sacrifice === goldenPawn ? 0 : 1);
      if (sacrifice === goldenPawn) expect(p.zone("hand")).toContainEqual(deck[0]);
      const queen = sacrifice === queenPiece || sacrifice === spirelleSchwartzQueen;
      expect(p.cards(pawnPiece, { zone: "field" })).toHaveLength(queen ? 3 : 0);
      expect(q.cards(pawnPiece, { zone: "field" })).toHaveLength(sacrifice === pawnPiece ? 1 : 0);
    });
  }
});
