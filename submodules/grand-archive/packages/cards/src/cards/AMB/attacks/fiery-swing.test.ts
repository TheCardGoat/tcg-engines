import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { heatedVengeance } from "./heated-vengeance.ts";
import { fierySwing } from "./fiery-swing.ts";

/** @covers ijkyboiopv-a1 */
describe("Fiery Swing — Class Bonus On Attack", () => {
  it("gains +1 power per banished fire card", () => {
    const { starter } = classBonusLeveledChampion(fierySwing, true, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          hand: [fierySwing, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
          graveyard: [heatedVengeance, heatedVengeance, woodlandSquirrels],
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const attacker = player.card(starter, { zone: "field" });
    const target = game.player("player-two").card(starter, { zone: "field" });
    const fires = player.cards(heatedVengeance, { zone: "graveyard" });
    player.activate(fierySwing, {
      attackAttackerId: attacker.objectId,
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(game);
    declareResolvedAttack(game, attacker.objectId, target.objectId, "declare Fiery Swing");
    advanceCombatToTrigger(game, "ijkyboiopv-a1");
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    answerDecision(
      game,
      "resolve-effect-choice",
      fires.map((card) => card.objectId),
    );
    passEffectsStack(game);
    if (game.state.combat) game.resolveCombatWithoutRetaliation();
    expect(player.cards(heatedVengeance, { zone: "banishment" })).toHaveLength(2);
    expect(game.state.objects[target.objectId]!.damage).toBe(8);
  });
});
