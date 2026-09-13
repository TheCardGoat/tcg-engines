import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { surveillanceStone } from "./surveillance-stone.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
/** @covers kk46Whz7CJ-a1 */
describe("Surveillance Stone counts an opponent's third unit attack each turn", () => {
  for (const accept of [false, true])
    it(`banish on third attack=${accept}`, () => {
      const champion = createClassBonusTestChampion(
          surveillanceStone,
          false,
          "activation-discount",
        ),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [surveillanceStone, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: Array.from({ length: 4 }, () => woodlandSquirrels),
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        stone = p.card(surveillanceStone);
      for (const ally of p.cards(woodlandSquirrels, { zone: "field" })) {
        p.declareAttack(ally, q.card(champion));
        game.resolveCombatWithoutRetaliation();
      }
      expect(p.zone("hand")).toHaveLength(0);
      expect(game.state.objects[stone.objectId]!.zone).toBe("field");
      advanceToMain(game, q.id);
      for (const [index, ally] of q.cards(woodlandSquirrels, { zone: "field" }).entries()) {
        q.declareAttack(ally, p.card(champion));
        advanceCombatToTrigger(game, "kk46Whz7CJ-a1");
        if (index === 2) {
          passEffectsStack(game);
          expect(game.state.objects[stone.objectId]!.zone).toBe("field");
          expect(p.zone("hand")).toHaveLength(0);
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        expect(p.zone("hand")).toHaveLength(accept && index >= 2 ? 1 : 0);
      }
      expect(game.state.objects[stone.objectId]!.zone).toBe(accept ? "banishment" : "field");
      expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(4);
      if (accept) return;
      advanceToMain(game, p.id);
      advanceToMain(game, q.id);
      const hand = p.zone("hand").length;
      for (const [index, ally] of q
        .cards(woodlandSquirrels, { zone: "field" })
        .slice(0, 3)
        .entries()) {
        q.declareAttack(ally, p.card(champion));
        advanceCombatToTrigger(game, "kk46Whz7CJ-a1");
        if (index === 2) {
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        expect(p.zone("hand")).toHaveLength(hand + (index === 2 ? 1 : 0));
      }
      expect(game.state.objects[stone.objectId]!.zone).toBe("banishment");
    });
});
