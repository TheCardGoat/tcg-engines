import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { crimsonRupture } from "../../RDO/actions/crimson-rupture.ts";
import { ferventLancer } from "./fervent-lancer.ts";

/** @covers aws20fsihd-a1 @covers aws20fsihd-a2 */
describe("Fervent Lancer — banish resolving Exia and champion-attack requirement", () => {
  for (const banish of [false, true]) {
    it(`${banish ? "banishes" : "does not banish"} the Exia card and ${banish ? "gains" : "keeps"} power`, () => {
      const champion = createClassBonusTestChampion(ferventLancer, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [ferventLancer, potionOfHealing],
            hand: [crimsonRupture, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(crimsonRupture, {
        targets: { "target-1": [player.card(potionOfHealing, { zone: "field" }).objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "aws20fsihd-a1",
        ),
      ).toBe(true);
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", banish);
      }
      passEffectsStack(game);
      expect(player.cards(crimsonRupture, { zone: "banishment" })).toHaveLength(banish ? 1 : 0);
      expect(player.cards(crimsonRupture, { zone: "graveyard" })).toHaveLength(banish ? 0 : 1);
      const target = opponent.card(champion, { zone: "field" });
      const lancer = player.card(ferventLancer, { zone: "field" });
      player.declareAttack(lancer, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(banish ? 5 : 3);
    });
  }
});
