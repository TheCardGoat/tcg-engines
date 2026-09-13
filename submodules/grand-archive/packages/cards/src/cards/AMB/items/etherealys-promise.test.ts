import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { etherealysPromise } from "./etherealys-promise.ts";

/** @covers 7n0bv1sqgb-a1 */
describe("Etherealys' Promise — refinement on ally death", () => {
  it("counts allied deaths and may banish itself at three counters to draw", () => {
    const champion = createClassBonusTestChampion(etherealysPromise, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [etherealysPromise, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const promise = player.card(etherealysPromise, { zone: "field" });
    const allies = player.cards(woodlandSquirrels, { zone: "field" });
    const attackers = opponent.cards(woodlandSquirrels, { zone: "field" });
    const top = player.zone("main-deck")[0]!;

    for (const [index, victim] of allies.entries()) {
      opponent.declareAttack(attackers[index]!, victim);
      if (index < 2) {
        game.resolveCombatWithoutRetaliation();
        passEffectsStack(game);
        expect(game.state.objects[promise.objectId]!.counters["named:refinement"]).toBe(index + 1);
        expect(game.state.objects[promise.objectId]!.zone).toBe("field");
      } else {
        advanceCombatToTrigger(game, "7n0bv1sqgb-a1");
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
        }
      }
    }
    expect(game.state.objects[promise.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[top.objectId]?.zone).toBe("hand");
  });
});
