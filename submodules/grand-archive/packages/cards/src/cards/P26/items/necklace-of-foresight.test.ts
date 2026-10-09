import { describe } from "vitest";
import { necklaceOfForesight } from "./necklace-of-foresight.ts";

import { proveClassBonusMaterializationDiscount } from "../../../testing/class-bonus-materialization-discount.ts";

/** @covers lq2kkvoqk1-a1 */
describe("necklaceOfForesight — Class Bonus materialization discount", () => {
  proveClassBonusMaterializationDiscount(necklaceOfForesight, false);
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers lq2kkvoqk1-a2 */
describe("Necklace of Foresight — banish for Glimpse 4", () => {
  for (const length of [0, 2, 4, 6])
    for (const placement of ["top", "bottom", "split"] as const)
      it(`reorders only the top four: deck=${length}, placement=${placement}`, () => {
        const champion = lineageTestChampion("Foresight", 0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [necklaceOfForesight],
              "main-deck": Array.from({ length }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(necklaceOfForesight);
        const deck = p.zone("main-deck").map((c) => c.objectId),
          otherDeck = q.zone("main-deck");
        const before = game.state;
        expect(() => q.activateAbility(source, "lq2kkvoqk1-a2")).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "lq2kkvoqk1-a2");
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck);
        const paid = game.state;
        expect(() => p.activateAbility(source, "lq2kkvoqk1-a2")).toThrow();
        expect(game.state).toEqual(paid);
        passEffectsStack(game);
        const seen = deck.slice(0, 4).reverse();
        const top = placement === "top" ? seen : placement === "split" ? seen.slice(0, 1) : [];
        const bottom = placement === "bottom" ? seen : placement === "split" ? seen.slice(1) : [];
        if (length > 0) {
          const decision = game.state.decision;
          if (decision?.kind !== "resolve-glimpse")
            throw new Error(`Expected Glimpse, got ${decision?.kind}`);
          expect(decision.cardIds).toEqual(deck.slice(0, 4));
          for (const invalid of [
            otherDeck[0]!.objectId,
            source.objectId,
            ...(deck[4] ? [deck[4]] : []),
          ]) {
            const choosing = game.state;
            expect(() =>
              answerDecision(game, "resolve-glimpse", {
                kind: "reorder",
                top: [invalid, ...seen.slice(1)],
                bottom: [],
              }),
            ).toThrow();
            expect(game.state).toEqual(choosing);
          }
          answerDecision(game, "resolve-glimpse", { kind: "reorder", top, bottom });
          passEffectsStack(game);
        }
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
          ...top,
          ...deck.slice(4),
          ...bottom,
        ]);
        expect(p.zone("hand")).toHaveLength(0);
        expect(q.zone("main-deck")).toEqual(otherDeck);
        expect(game.state.decision).toBeNull();
      });
});
