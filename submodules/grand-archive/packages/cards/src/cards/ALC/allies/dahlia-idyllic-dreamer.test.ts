import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { aqueousArmor } from "../phantasias/aqueous-armor.ts";
import { dahliaIdyllicDreamer } from "./dahlia-idyllic-dreamer.ts";

/** @covers 7xgwve1d47-a1 @covers 7xgwve1d47-a2 */
describe("Dahlia, Idyllic Dreamer — attack mill and graveyard-scaled Ranged", () => {
  it("mills the looked-at Water card and counts it for the distant attack", () => {
    const champion = createClassBonusTestChampion(
      dahliaIdyllicDreamer,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [dahliaIdyllicDreamer],
          hand: [reposition, woodlandSquirrels],
          graveyard: [aqueousArmor, aqueousArmor],
          "main-deck": [aqueousArmor, aqueousArmor],
        },
      },
      playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const dahlia = player.card(dahliaIdyllicDreamer);
    const target = game.player("player-two").card(champion);
    player.activate(reposition, {
      targets: { "target-1": [dahlia.objectId] },
      reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
    });
    passEffectsStack(game);
    player.declareAttack(dahlia, target);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(player.cards(aqueousArmor, { zone: "graveyard" })).toHaveLength(3);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(4);
  });
});
