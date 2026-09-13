import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { powerOverwhelming } from "./power-overwhelming.ts";
import { jewelOfEnlightenment } from "../items/jewel-of-enlightenment.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision, advanceToMain } from "../../../testing/decisions.ts";
/** @covers AnEPyfFfHj-a1 */
describe("Power Overwhelming's chosen enlighten conversion", () => {
  for (const choices of [[0], [1], [3], [1, 2]])
    it(`converts ${choices.join(" then ")} counters into separate turn bonuses`, () => {
      const champion = createClassBonusTestChampion(
        powerOverwhelming,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: choices.map(() => powerOverwhelming),
            field: [jewelOfEnlightenment, jewelOfEnlightenment, jewelOfEnlightenment],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
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
      for (let n = 0; n < 3; n++) {
        p.activateAbility(p.cards(jewelOfEnlightenment, { zone: "field" })[0]!, "AKA19OwaCh-a1");
        passEffectsStack(game);
      }
      let removed = 0;
      for (const amount of choices) {
        p.activate(p.cards(powerOverwhelming, { zone: "hand" })[0]!);
        passEffectsStack(game);
        expect(game.state.objects[id]!.counters.enlighten).toBe(3 - removed);
        const before = game.state;
        for (const invalid of [-1, 4 - removed, 0.5]) {
          expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-effect-choice", amount);
        passEffectsStack(game);
        removed += amount;
        expect(game.state.objects[id]!.counters.enlighten ?? 0).toBe(3 - removed);
        expect(level(p)).toBe(removed);
        expect(level(q)).toBe(0);
      }
      advanceToMain(game, q.id);
      expect(level(p)).toBe(0);
      expect(game.state.objects[id]!.counters.enlighten ?? 0).toBe(3 - removed);
    });
});
