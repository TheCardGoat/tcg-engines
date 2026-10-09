import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { vantagePoint } from "../../RDO/actions/vantage-point.ts";
import { perilousMend } from "./perilous-mend.ts";

/** @covers A5jpuUlwDd-a2 */
describe("Perilous Mend — class and distant draw", () => {
  for (const matching of [false, true])
    for (const distant of [false, true])
      for (const own of [false, true]) {
        it(`class=${matching}, distant=${distant}, distant champion own=${own}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(perilousMend, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  perilousMend,
                  vantagePoint,
                  ...Array.from({ length: 5 }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const pay = (amount: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, amount)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (distant) {
            p.activate(vantagePoint, {
              targets: { "target-1": [(own ? p : q).card(champion).objectId] },
              reservePayment: pay(2),
            });
            passEffectsStack(game);
          }
          const deck = p.zone("main-deck"),
            otherDeck = q.zone("main-deck");
          p.activate(perilousMend, { reservePayment: pay(1) });
          const hand = p.zone("hand"),
            memory = p.zone("memory");
          expect(p.zone("main-deck")).toEqual(deck);
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          const draws = matching && distant && own;
          expect(p.zone("hand")).toEqual(draws ? [...hand, deck[0]!] : hand);
          expect(p.zone("main-deck")).toEqual(draws ? deck.slice(1) : deck);
          expect(p.zone("memory")).toEqual(memory);
          expect(q.zone("main-deck")).toEqual(otherDeck);
          expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
        });
      }
});
