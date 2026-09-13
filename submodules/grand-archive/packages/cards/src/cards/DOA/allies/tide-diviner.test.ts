import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { tideDiviner } from "./tide-diviner.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
/** @covers zrBBvgIvt6-a1 */
describe("Tide Diviner chooses one of the available top 1+LV and mills the remainder", () => {
  for (const level of [0, 1, 3])
    for (const count of [0, 2, 5])
      it(`level=${level}, deck=${count}`, () => {
        const champion = grantTestChampionLevel(
            createClassBonusTestChampion(tideDiviner, false, "activation-discount"),
            level,
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [tideDiviner, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                "main-deck": Array.from({ length: count }, () => woodlandSquirrels),
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          deck = p.zone("main-deck"),
          looked = deck.slice(0, 1 + level),
          selected = looked.at(-1),
          before = game.state,
          pay = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        expect(() => p.activate(tideDiviner, { reservePayment: pay.slice(0, 3) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(tideDiviner, { reservePayment: pay });
        passEffectsStack(game);
        if (selected) {
          const choice = game.state;
          for (const bad of [q.zone("main-deck")[0]!, p.card(champion), ...deck.slice(1 + level)]) {
            expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
            expect(game.state).toEqual(choice);
          }
          expect(() => answerDecision(game, "resolve-effect-choice", [])).toThrow();
          expect(game.state).toEqual(choice);
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
        }
        expect(p.zone("hand")).toEqual(selected ? [selected] : []);
        expect(
          p
            .zone("graveyard")
            .map((c) => c.objectId)
            .sort(),
        ).toEqual(
          looked
            .filter((c) => c.objectId !== selected?.objectId)
            .map((c) => c.objectId)
            .sort(),
        );
        expect(p.zone("main-deck")).toEqual(deck.slice(1 + level));
        expect(q.zone("main-deck")).toHaveLength(1);
        expect(p.card(tideDiviner, { zone: "field" })).toBeDefined();
      });
});
