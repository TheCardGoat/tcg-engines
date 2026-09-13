import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { airshipEngineer } from "../../ALC/allies/airship-engineer.ts";
import { ashFilcher } from "./ash-filcher.ts";

/** @covers b65hiv400w-a1 */
describe("Ash Filcher — Class Bonus On Attack fire banish", () => {
  for (const classBonus of [false, true]) {
    for (const banish of [false, true]) {
      it(`Class Bonus=${classBonus}, banish fire=${banish}`, () => {
        const champion = createClassBonusTestChampion(
          ashFilcher,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [ashFilcher],
              graveyard: [airshipEngineer, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { graveyard: [airshipEngineer] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(ashFilcher, target);
        if (!classBonus) {
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
          expect(player.cards(airshipEngineer, { zone: "graveyard" })).toHaveLength(1);
          return;
        }
        advanceCombatToTrigger(game, "b65hiv400w-a1");
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", banish);
          passEffectsStack(game);
        }
        if (banish && game.state.decision?.kind === "resolve-effect-choice") {
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [
              player.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
            ]),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", [
            player.card(airshipEngineer, { zone: "graveyard" }).objectId,
          ]);
          passEffectsStack(game);
        }
        if (game.state.combat) game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(banish ? 3 : 1);
        expect(player.cards(airshipEngineer, { zone: "banishment" })).toHaveLength(banish ? 1 : 0);
      });
    }
  }
});
