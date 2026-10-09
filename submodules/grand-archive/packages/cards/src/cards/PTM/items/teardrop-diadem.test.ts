import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { describe, expect, it } from "vitest";
import { teardropDiadem } from "./teardrop-diadem.ts";
import { proveBanishDraw } from "../../../testing/banish-draw.ts";
/** @covers K15jWbHAMY-a3 */
describe("teardrop-diadem — banish and draw", () =>
  proveBanishDraw(teardropDiadem, "K15jWbHAMY-a3", true));

/** @covers K15jWbHAMY-a2 */
describe("Teardrop Diadem — exclusive floating memory payment", () => {
  for (const matching of [false, true])
    for (const memorySize of [0, 3]) {
      it(`requires exactly three legal floating memory cards, class=${matching}, memory=${memorySize}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(teardropDiadem, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              "material-deck": [teardropDiadem],
              memory: Array.from({ length: memorySize }, () => woodlandSquirrels),
              graveyard: [
                favorableWinds,
                favorableWinds,
                favorableWinds,
                favorableWinds,
                woodlandSquirrels,
              ],
              hand: [favorableWinds],
            },
          },
          playerTwo: { champion, zones: { graveyard: [favorableWinds] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const floating = p.cards(favorableWinds, { zone: "graveyard" }).map((c) => c.objectId),
          memory = p.zone("memory");
        for (const ids of [
          [],
          floating.slice(0, 1),
          floating.slice(0, 2),
          floating,
          [floating[0]!, floating[0]!, floating[1]!],
          ...[
            p.card(woodlandSquirrels, { zone: "graveyard" }),
            p.card(favorableWinds, { zone: "hand" }),
            q.card(favorableWinds, { zone: "graveyard" }),
          ].map((c) => [...floating.slice(0, 2), c.objectId]),
        ]) {
          const before = game.state;
          expect(() => p.materialize(teardropDiadem, { floatingMemoryCardIds: ids })).toThrow();
          expect(game.state).toEqual(before);
        }
        p.materialize(teardropDiadem, { floatingMemoryCardIds: floating.slice(0, 3) });
        expect(p.zone("memory")).toEqual(memory);
        expect(p.zone("banishment").map((c) => c.objectId)).toEqual(floating.slice(0, 3));
        expect(p.cards(teardropDiadem, { zone: "field" })).toHaveLength(0);
        passEffectsStack(game);
        expect(p.cards(teardropDiadem, { zone: "field" })).toHaveLength(1);
        expect(p.cards(favorableWinds, { zone: "graveyard" }).map((c) => c.objectId)).toEqual(
          floating.slice(3),
        );
        expect(q.cards(favorableWinds, { zone: "graveyard" })).toHaveLength(1);
      });
    }
});
