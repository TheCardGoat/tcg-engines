import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tempusStalker } from "./tempus-stalker.ts";

/** @covers xp6qqi6vwf-a1 */
describe("Tempus Stalker — Pride 2", () => {
  provePrideAlly({ card: tempusStalker, pride: 2, power: 1 });
});

/** @covers xp6qqi6vwf-a2 */
describe("Tempus Stalker — Class Bonus recollection buff", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "adds" : "does not add"} a buff counter on its controller's recollection`, () => {
      const champion = createClassBonusTestChampion(
        tempusStalker,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [tempusStalker],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const ally = player.card(tempusStalker, { zone: "field" });
      advanceToRecollection(game, "player-two");
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
      expect(game.state.stack).toHaveLength(0);
      advanceToRecollection(game, "player-one");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "xp6qqi6vwf-a2",
        ),
      ).toBe(classBonus);
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(classBonus ? 1 : 0);
    });
  }
});
