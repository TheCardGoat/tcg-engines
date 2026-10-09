import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { alkahest } from "./alkahest.ts";
import { draughtOfStamina } from "../../PRD/items/draught-of-stamina.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers xfpk9xycwz-a1 */
describe("Alkahest — controlled Potion choice on own recollection", () => {
  for (const count of [0, 1, 2])
    for (const matching of [false, true]) {
      it(`Potions=${count}, class=${matching}`, () => {
        const champion = createClassBonusTestChampion(alkahest, matching, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                alkahest,
                woodlandSquirrels,
                ...Array.from({ length: count }, () => draughtOfStamina),
              ],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [draughtOfStamina],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          potions = p.cards(draughtOfStamina);
        for (let turn = 1; turn <= 2; turn++) {
          advanceToRecollection(game, q.id);
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.decision).toBeNull();
          advanceToRecollection(game, p.id);
          expect(game.state.stack).toHaveLength(1);
          passEffectsStack(game);
          if (count) {
            const before = game.state;
            for (const ids of [
              [],
              [q.card(draughtOfStamina).objectId],
              [p.card(alkahest).objectId],
              [p.card(woodlandSquirrels, { zone: "field" }).objectId],
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [potions[0]!.objectId]);
            passEffectsStack(game);
          }
          for (const [i, potion] of potions.entries())
            expect(game.state.objects[potion.objectId]!.counters["named:age"] ?? 0).toBe(
              i === 0 ? turn : 0,
            );
          expect(
            game.state.objects[q.card(draughtOfStamina).objectId]!.counters["named:age"] ?? 0,
          ).toBe(0);
          expect(game.state.decision).toBeNull();
        }
      });
    }
});
