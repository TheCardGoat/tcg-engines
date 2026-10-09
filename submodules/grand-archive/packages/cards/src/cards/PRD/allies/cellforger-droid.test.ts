import { describe } from "vitest";
import { cellforgerDroid } from "./cellforger-droid.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers wgX472k6J7-a1 */
describe("cellforgerDroid", () => {
  proveSummonOnEnter({
    card: cellforgerDroid,
    token: powercell,
    cost: 2,
    count: 1,
    abilityId: "wgX472k6J7-a1",
    rested: true,
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers wgX472k6J7-a2 */
describe("Cellforger Droid — activated production", () => {
  for (const existing of [false, true])
    it(`pays four and rests to produce a rested cell, existing=${existing}`, () => {
      const champion = createClassBonusTestChampion(cellforgerDroid, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [powercell],
        playerOne: {
          champion,
          zones: {
            field: [cellforgerDroid, ...(existing ? [powercell] : [])],
            hand: Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion, zones: { field: [powercell] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(cellforgerDroid);
      const pay = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const before = game.state;
      expect(() =>
        p.activateAbility(source, "wgX472k6J7-a2", { reservePayment: pay.slice(0, 3) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activateAbility(source, "wgX472k6J7-a2", { reservePayment: pay.slice(0, 4) });
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      expect(p.cards(powercell, { zone: "field" })).toHaveLength(existing ? 1 : 0);
      passEffectsStack(game);
      const cells = p.cards(powercell, { zone: "field" });
      expect(cells).toHaveLength(existing ? 2 : 1);
      expect(
        cells.filter((ref) => game.state.objects[ref.objectId]!.states.has("rested")),
      ).toHaveLength(1);
      expect(q.cards(powercell, { zone: "field" })).toHaveLength(1);
      const after = game.state;
      expect(() =>
        p.activateAbility(source, "wgX472k6J7-a2", { reservePayment: pay.slice(4) }),
      ).toThrow();
      expect(game.state).toEqual(after);
    });
});
