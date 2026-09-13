import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { proveBanishDrawItem } from "../../../testing/banish-draw-item.ts";
import { describe, expect, it } from "vitest";
import { tomeOfKnowledge } from "./tome-of-knowledge.ts";

/** @covers yDARN8eV6B-a2 */
describe("Tome of Knowledge \u2014 resolution", () => {
  proveBanishDrawItem({ card: tomeOfKnowledge, abilityId: "yDARN8eV6B-a2" });
});
/** @covers yDARN8eV6B-a1 */
describe("Tome of Knowledge's conditional level", () => {
  for (const matching of [true, false])
    it(`grants a level only while present with Class Bonus (${matching})`, () => {
      const champion = createClassBonusTestChampion(
        tomeOfKnowledge,
        matching,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [tomeOfKnowledge], "main-deck": [woodlandSquirrels] },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const level = (id: typeof p.id) =>
        deriveGrandArchiveNumericProperty(
          game.state.objects[game.player(id).card(champion).objectId]!,
          "level",
          { program: game.program, state: game.state, controllerId: id, bindings: {} },
        );
      expect(level(p.id)).toBe(matching ? 1 : 0);
      expect(level(q.id)).toBe(0);
      p.activateAbility(tomeOfKnowledge, "yDARN8eV6B-a2");
      expect(level(p.id)).toBe(0);
      expect(p.zone("hand")).toHaveLength(0);
      passEffectsStack(game);
      expect(level(p.id)).toBe(0);
      expect(p.zone("hand")).toHaveLength(1);
    });
});
