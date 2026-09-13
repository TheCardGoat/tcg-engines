import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { inundatingClash } from "../attacks/inundating-clash.ts";
import { relicOfSunkenPast } from "./relic-of-sunken-past.ts";

/** @covers dqqwey9xys-a2 */
describe("Relic of Sunken Past — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: relicOfSunkenPast });
});

/** @covers dqqwey9xys-a1 */
describe("Relic of Sunken Past — recollection sacrifice", () => {
  for (const water of [2, 3]) {
    it(`${water >= 3 ? "may sacrifice to draw" : "does not offer the sacrifice"} with ${water} water cards`, () => {
      const { starter } = classBonusLeveledChampion(relicOfSunkenPast, false, 0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion: starter,
          zones: {
            field: [relicOfSunkenPast],
            graveyard: Array.from({ length: water }, () => inundatingClash),
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: starter,
          zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const source = player.card(relicOfSunkenPast, { zone: "field" });
      const top = player.zone("main-deck")[0]!;
      advanceToRecollection(game, player.id);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "dqqwey9xys-a1",
        ),
      ).toBe(true);
      passEffectsStack(game);
      if (water < 3) {
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(player.zone("hand")).toHaveLength(0);
        return;
      }
      answerDecision(game, "resolve-optional-effect", true);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      expect(player.zone("hand")[0]).toEqual(top);
    });
  }
});
