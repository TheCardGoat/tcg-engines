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
import { igniteFate } from "../actions/ignite-fate.ts";
import { heatedVengeance } from "./heated-vengeance.ts";

function declareHeated(classBonus: boolean, damaged: boolean, acceptSelfDamage: boolean) {
  const { starter } = classBonusLeveledChampion(heatedVengeance, classBonus, 0);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: starter,
      zones: {
        hand: [
          heatedVengeance,
          ...(damaged ? [igniteFate] : []),
          ...Array.from({ length: damaged ? 6 : 3 }, () => woodlandSquirrels),
        ],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: starter,
      zones: {
        field: [woodlandSquirrels],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  const attacker = player.card(starter, { zone: "field" });
  const target = opponent.card(starter, { zone: "field" });
  if (damaged) {
    player.activate(igniteFate, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[attacker.objectId]!.damage).toBeGreaterThan(0);
  }
  player.activate(heatedVengeance, {
    attackAttackerId: attacker.objectId,
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 3)
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
  });
  passEffectsStack(game);
  declareResolvedAttack(game, attacker.objectId, target.objectId, "declare Heated Vengeance");
  advanceCombatToTrigger(game, "td460e8ig0-a2");
  if (classBonus) {
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", acceptSelfDamage);
    passEffectsStack(game);
  }
  if (game.state.combat) game.resolveCombatWithoutRetaliation();
  return { game, attacker, target };
}

/** @covers td460e8ig0-a1 @covers td460e8ig0-a2 */
describe("Heated Vengeance — damage bonus and Class Bonus self-hit", () => {
  it("stays at 2 power when the champion is undamaged", () => {
    const { game, target } = declareHeated(false, false, false);
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });

  it("gains +3 after the champion takes damage this turn", () => {
    const { game, target } = declareHeated(false, true, false);
    expect(game.state.objects[target.objectId]!.damage).toBe(7);
  });

  it("may deal 3 to its champion on attack with Class Bonus", () => {
    const { game, attacker, target } = declareHeated(true, false, true);
    expect(game.state.objects[attacker.objectId]!.damage).toBe(3);
    expect(game.state.objects[target.objectId]!.damage).toBe(5);
  });
});
