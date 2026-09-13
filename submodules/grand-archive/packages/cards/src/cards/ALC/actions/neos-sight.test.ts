import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { neosSight } from "./neos-sight.ts";
import { reposition } from "./reposition.ts";

/** @covers 4n1n3gygoj-a1 */
describe("Neos Sight", () => {
  for (const objects of [7, 8, 9]) {
    it(`draws into memory only at eight controlled objects (${objects} present)`, () => {
      const champion = createClassBonusTestChampion(neosSight, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [neosSight],
            field: Array.from({ length: objects - 1 }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels, reposition, neosSight],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      player.activate(neosSight);
      expect(player.zone("hand")).toHaveLength(0);
      expect(player.zone("memory")).toHaveLength(0);
      expect(player.zone("main-deck")).toEqual(deck);
      expect(game.resolveStackUntilChoice()).toBe("stack-empty");
      expect(player.zone("hand")).toEqual([deck[0]]);
      expect(player.zone("memory")).toEqual(objects >= 8 ? [deck[1]] : []);
      expect(player.zone("main-deck")).toEqual(deck.slice(objects >= 8 ? 2 : 1));
      expect(game.player("player-two").zone("hand")).toHaveLength(0);
    });
  }
});
