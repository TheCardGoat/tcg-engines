import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { crystalOfArgus } from "./crystal-of-argus.ts";
import { jewelOfEnlightenment } from "./jewel-of-enlightenment.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers j5iQQPd2m5-a1 */
describe("Crystal of Argus's complete groups of three enlighten counters", () => {
  for (const classBonus of [false, true])
    it(`updates level when counters are gained and spent, class=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        crystalOfArgus,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [crystalOfArgus, ...Array.from({ length: 6 }, () => jewelOfEnlightenment)],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [crystalOfArgus] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        id = p.card(champion).objectId;
      const level = (player: typeof p) =>
        deriveGrandArchiveNumericProperty(
          game.state.objects[player.card(champion).objectId]!,
          "level",
          { program: game.program, state: game.state, controllerId: player.id, bindings: {} },
        );
      expect(level(p)).toBe(0);
      for (let n = 1; n <= 6; n++) {
        p.activateAbility(p.cards(jewelOfEnlightenment, { zone: "field" })[0]!, "AKA19OwaCh-a1");
        passEffectsStack(game);
        expect(game.state.objects[id]!.counters.enlighten).toBe(n);
        expect(level(p)).toBe(classBonus ? Math.floor(n / 3) : 0);
        expect(level(q)).toBe(0);
      }
      p.activateAbility(p.card(champion), "game:enlighten-counter-a1");
      expect(game.state.objects[id]!.counters.enlighten).toBe(3);
      expect(level(p)).toBe(classBonus ? 1 : 0);
      passEffectsStack(game);
      expect(p.zone("hand")).toHaveLength(1);
    });
});
