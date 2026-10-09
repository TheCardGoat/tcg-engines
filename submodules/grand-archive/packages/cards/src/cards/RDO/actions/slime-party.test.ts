import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { slimeParty } from "./slime-party.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { babyGraySlime } from "../../PRD/allies/baby-gray-slime.ts";
import { babyBlueSlime } from "../../P24/allies/baby-blue-slime.ts";
import { babyGreenSlime } from "../../P24/allies/baby-green-slime.ts";
import { babyRedSlime } from "../../P24/allies/baby-red-slime.ts";
import { ghastlySlime } from "../../PTM/allies/ghastly-slime.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";

/** @covers AJeuUDTPmV-a1
 * @covers AJeuUDTPmV-a2
 */
describe("Slime Party — distinct controlled elements and resolution buffs", () => {
  const colors = [babyGraySlime, babyBlueSlime, babyGreenSlime, babyRedSlime, ghastlySlime];
  for (const count of [0, 1, 2, 4, 5])
    for (const copies of [1, 2])
      for (const matching of [false, true])
        for (const removed of count ? [false, true] : [false]) {
          it(`elements=${count}, copies=${copies}, Silvie=${matching}, removed in response=${removed}`, () => {
            const champion = enableAllTestElements(
              createLineageTestChampion(slimeParty, matching ? "Silvie" : "Other"),
            );
            const slimes = colors
              .slice(0, count)
              .flatMap((card) => Array.from({ length: copies }, () => card));
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [...slimes, woodlandSquirrels],
                  hand: [
                    slimeParty,
                    slimeParty,
                    reclaim,
                    ...colors,
                    ...Array.from({ length: 14 }, () => woodlandSquirrels),
                  ],
                  graveyard: colors,
                  "main-deck": [woodlandSquirrels],
                },
              },
              playerTwo: { champion, zones: { field: colors, "main-deck": [woodlandSquirrels] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const ownSlimes = colors
              .slice(0, count)
              .flatMap((card) => p.cards(card, { zone: "field" }));
            const sources = p.cards(slimeParty),
              bounced = ownSlimes[0];
            const cost = (elements: number) => (matching ? Math.max(0, 4 - elements) : 4);
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const before = game.state;
            for (const amount of cost(count) ? [cost(count) - 1, cost(count) + 1] : [1]) {
              expect(() => p.activate(sources[0]!, { reservePayment: pay(amount) })).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(sources[0]!, { reservePayment: pay(cost(count)) });
            for (const ref of ownSlimes)
              expect(game.state.objects[ref.objectId]!.counters.buff ?? 0).toBe(0);
            if (removed)
              p.activate(reclaim, {
                targets: { "target-1": [bounced!.objectId] },
                reservePayment: pay(2),
              });
            passEffectsStack(game);
            for (const ref of ownSlimes)
              expect(game.state.objects[ref.objectId]!.counters.buff ?? 0).toBe(
                removed && ref.objectId === bounced!.objectId ? 0 : 1,
              );
            const remainingElements = count - (removed && copies === 1 ? 1 : 0);
            p.activate(sources[1]!, { reservePayment: pay(cost(remainingElements)) });
            passEffectsStack(game);
            for (const ref of ownSlimes)
              expect(game.state.objects[ref.objectId]!.counters.buff ?? 0).toBe(
                removed && ref.objectId === bounced!.objectId ? 0 : 2,
              );
            for (const card of colors) {
              expect(game.state.objects[q.card(card).objectId]!.counters.buff ?? 0).toBe(0);
              for (const ref of p.cards(card, { zone: "graveyard" }))
                expect(game.state.objects[ref.objectId]!.counters.buff ?? 0).toBe(0);
            }
            expect(
              game.state.objects[p.card(woodlandSquirrels, { zone: "field" }).objectId]!.counters
                .buff ?? 0,
            ).toBe(0);
            expect(game.state.decision).toBeNull();
            expect(game.state.winnerIds).toEqual([]);
          });
        }
});
