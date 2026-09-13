import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { namedClassBonusChampion } from "../../../testing/class-bonus-level.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  currentDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { crescentGlaive } from "../weapons/crescent-glaive.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { beseechingFlourish } from "./beseeching-flourish.ts";

/** @covers d60jobz3ct-a1 */
describe("Beseeching Flourish — Jin Bonus On Hit", () => {
  for (const jin of [false, true]) {
    it(`${jin ? "materializes" : "does not materialize"} a Polearm with Jin=${jin}`, () => {
      const { starter } = namedClassBonusChampion(beseechingFlourish, jin ? "Jin" : "Other", true);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            hand: [beseechingFlourish, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "material-deck": [crescentGlaive, trainingSword],
            memory: [woodlandSquirrels],
          },
        },
        playerTwo: { champion: lineageTestChampion("Opponent", 0) },
      });
      const player = game.player("player-one");
      const attacker = player.card(starter, { zone: "field" });
      player.activate(beseechingFlourish, {
        attackAttackerId: attacker.objectId,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      declareResolvedAttack(
        game,
        attacker.objectId,
        game.player("player-two").card(lineageTestChampion("Opponent", 0), { zone: "field" })
          .objectId,
        "declare Beseeching Flourish",
      );
      advanceCombatToTrigger(game, "d60jobz3ct-a1");
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "d60jobz3ct-a1",
        ),
      ).toBe(jin);
      passEffectsStack(game);
      if (jin && game.state.decision?.kind === "resolve-effect-choice") {
        const polearm = player.card(crescentGlaive, { zone: "material-deck" });
        const sword = player.card(trainingSword, { zone: "material-deck" });
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", [sword.objectId])).toThrow();
        expect(game.state).toEqual(before);
        answerDecision(game, "resolve-effect-choice", [polearm.objectId]);
        passEffectsStack(game);
        if (currentDecision(game)?.kind === "announce-effect-materialization")
          answerDecision(game, "announce-effect-materialization", {});
        passEffectsStack(game);
      }
      if (game.state.combat) game.resolveCombatWithoutRetaliation();
      expect(player.cards(crescentGlaive, { zone: "field" })).toHaveLength(jin ? 1 : 0);
    });
  }
});
