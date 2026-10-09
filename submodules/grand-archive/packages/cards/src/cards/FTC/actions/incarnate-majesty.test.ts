import { describe } from "vitest";
import { incarnateMajesty } from "./incarnate-majesty.ts";
import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
/** @covers 7dl5j4lx6x-a1 */
describe("incarnateMajesty — Class Bonus Efficiency", () => {
  proveClassBonusEfficiency({ card: incarnateMajesty, printedCost: 12 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { hoarfrostSpine } from "../../AMB/weapons/hoarfrost-spine.ts";
import { sweetAmbrosia } from "../../P24/items/sweet-ambrosia.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";

/** @covers 7dl5j4lx6x-a2 */
describe("Incarnate Majesty — banished Regalia weapon discount", () => {
  for (const matching of [false, true])
    for (const weapons of [0, 2, 10, 13])
      it(`combines ${weapons} qualifying cards with Efficiency=${matching}`, () => {
        const champion = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(incarnateMajesty, matching, "activation-discount"),
            2,
          ),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [incarnateMajesty, ...Array.from({ length: 13 }, () => woodlandSquirrels)],
              banishment: [
                ...Array.from({ length: weapons }, () => trainingSword),
                hoarfrostSpine,
                sweetAmbrosia,
                woodlandSquirrels,
              ],
              graveyard: [trainingSword],
              "material-deck": [trainingSword],
            },
          },
          playerTwo: { champion, zones: { banishment: [trainingSword, trainingSword] } },
        });
        const p = game.player("player-one");
        const expected = Math.max(0, 12 - weapons - (matching ? 2 : 0));
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        if (expected) {
          expect(() =>
            p.activate(incarnateMajesty, { reservePayment: pay(expected - 1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const banished = p.zone("banishment");
        p.activate(incarnateMajesty, { reservePayment: pay(expected) });
        expect(p.zone("memory")).toHaveLength(expected);
        expect(p.zone("banishment")).toEqual(banished);
        expect(p.cards(incarnateMajesty, { zone: "effects-stack" })).toHaveLength(1);
      });
});
