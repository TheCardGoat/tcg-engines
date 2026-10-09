import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { innervateKnowledge } from "./innervate-knowledge.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers pcescfpwak-a1
 * @covers pcescfpwak-a2
 */
describe("Innervate Knowledge", () => {
  for (const leveled of [false, true])
    for (const damage of [4, 5])
      it(`requires both delevel and full recovery before drawing, leveled=${leveled}, damage=${damage}`, () => {
        const starter = enableAllTestElements(lineageTestChampion("Knowledge", 0)),
          next = enableAllTestElements(lineageTestChampion("Knowledge", 1));
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: starter,
            lineage: leveled ? [next] : [],
            zones: {
              hand: [
                innervateKnowledge,
                ...Array.from({ length: damage }, () => singeingLeap),
                ...Array.from({ length: damage + 4 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion: starter },
        });
        const p = game.player("player-one"),
          hero = p.card(starter, { zone: "field" }),
          deck = p.zone("main-deck");
        for (const leap of p.cards(singeingLeap)) {
          p.activate(leap, {
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        const options = {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        };
        if (!leveled || damage < 5) {
          const before = game.state;
          expect(() => p.activate(innervateKnowledge, options)).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        p.activate(innervateKnowledge, options);
        expect(p.cards(next, { zone: "material-deck" })).toHaveLength(1);
        expect(game.state.objects[p.card(starter, { zone: "field" }).objectId]!.damage).toBe(0);
        expect(p.zone("hand")).toHaveLength(0);
        expect(p.zone("main-deck")).toEqual(deck);
        passEffectsStack(game);
        expect(p.zone("hand")).toEqual(deck.slice(0, 2));
        expect(p.zone("main-deck")).toEqual(deck.slice(2));
      });
});
