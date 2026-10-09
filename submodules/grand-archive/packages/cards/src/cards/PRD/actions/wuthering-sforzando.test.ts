import { describe } from "vitest";
import { wutheringSforzando } from "./wuthering-sforzando.ts";
import { proveNextAttackBonus } from "../../../testing/next-attack-bonus.ts";
/** @covers Nlw3ZpjSxw-a2 */
describe("Wuthering Sforzando — next attack bonus", () =>
  proveNextAttackBonus(wutheringSforzando, 7, false));
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { songOfNurturing } from "../../DOA/actions/song-of-nurturing.ts";

/** @covers Nlw3ZpjSxw-a1 */
describe("Wuthering Sforzando — class and Melody cost", () => {
  for (const cls of ["SPIRIT", "CLERIC", "TAMER"] as const)
    for (const history of ["none", "own", "opponent", "previous"])
      it(`class=${cls}, Melody=${history}`, () => {
        const base = enableAllTestElements(
          createClassBonusTestChampion(wutheringSforzando, false, "activation-discount"),
        );
        const face = requireSingleFace(base);
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: {
              ...face,
              typeLine: { ...face.typeLine, classes: [cls] as const, subtypes: [cls] },
            },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              hand: [
                wutheringSforzando,
                songOfNurturing,
                ...Array.from({ length: 11 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [songOfNurturing, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
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
        if (history === "opponent") {
          p.pass();
          q.activate(songOfNurturing, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
        } else if (history !== "none") {
          p.activate(songOfNurturing, { reservePayment: pay(2) });
          passEffectsStack(game);
          if (history === "previous") advanceToMain(game, p.id, game.state.turn.number);
        }
        const cost = cls !== "SPIRIT" && history === "own" ? 4 : 7;
        const targets = { "target-1": [p.card(woodlandSquirrels, { zone: "field" }).objectId] };
        const before = game.state;
        for (const invalid of [cost - 1, cost + 1]) {
          expect(() =>
            p.activate(wutheringSforzando, { reservePayment: pay(invalid), targets }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const memory = p.zone("memory");
        p.activate(wutheringSforzando, { reservePayment: pay(cost), targets });
        expect(p.zone("memory")).toHaveLength(memory.length + cost);
        passEffectsStack(game);
        expect(p.cards(wutheringSforzando, { zone: "graveyard" })).toHaveLength(1);
      });
});
