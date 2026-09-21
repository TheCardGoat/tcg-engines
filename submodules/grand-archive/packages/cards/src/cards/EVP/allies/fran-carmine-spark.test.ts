import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { franCarmineSpark } from "./fran-carmine-spark.ts";

/** @covers WRu4cuRHOS-a1 */
describe("Fran, Carmine Spark — Class Bonus On Attack", () => {
  for (const classBonus of [false, true]) {
    for (const fire of classBonus ? [false, true] : [false]) {
      it(`Class Bonus=${classBonus}, chosen card is fire=${fire}`, () => {
        const champion = createClassBonusTestChampion(
          franCarmineSpark,
          classBonus,
          "activation-discount",
        );
        const choice = fire ? fireball : woodlandSquirrels;
        const other = fire ? woodlandSquirrels : fireball;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [franCarmineSpark],
              hand: [nascentBlast, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { graveyard: [choice, other] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const selected = opponent.card(choice, { zone: "graveyard" });
        player.declareAttack(franCarmineSpark, opponent.card(champion));
        if (classBonus) {
          advanceCombatToTrigger(game, "WRu4cuRHOS-a1");
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-player": [opponent.id] },
          });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
        }
        game.resolveCombatWithoutRetaliation();
        player.activate(nascentBlast, {
          targets: { "target-1": [opponent.card(champion).objectId] },
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        passEffectsStack(game);
        expect(
          player.cards(nascentBlast, { zone: classBonus && fire ? "memory" : "graveyard" }),
        ).toHaveLength(1);
      });
    }
  }
});
