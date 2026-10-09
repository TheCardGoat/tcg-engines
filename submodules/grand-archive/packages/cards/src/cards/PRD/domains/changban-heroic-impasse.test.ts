import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { changbanHeroicImpasse } from "./changban-heroic-impasse.ts";
import { huntWeissKing } from "../../PTM/allies/hunt-weiss-king.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers kmuuqzfvg8-a1 */
describe("Changban — unique ally resolution choice", () => {
  for (const own of [false, true])
    for (const matching of [false, true]) {
      it(`own unique=${own}, class=${matching}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(changbanHeroicImpasse, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [changbanHeroicImpasse, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
              field: [woodlandSquirrels, ...(own ? [huntWeissKing] : [])],
            },
          },
          playerTwo: { champion, zones: { field: [huntWeissKing] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        p.activate(changbanHeroicImpasse, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        if (own) {
          const before = game.state;
          for (const ids of [
            [],
            [p.card(woodlandSquirrels, { zone: "field" }).objectId],
            [q.card(huntWeissKing).objectId],
            [p.card(champion).objectId],
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [p.card(huntWeissKing).objectId]);
          passEffectsStack(game);
          expect(game.state.objects[p.card(huntWeissKing).objectId]!.counters.buff).toBe(1);
        }
        expect(game.state.objects[q.card(huntWeissKing).objectId]!.counters.buff ?? 0).toBe(0);
        expect(game.state.decision).toBeNull();
      });
    }
});
