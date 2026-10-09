import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { rumbleCoordinator } from "./rumble-coordinator.ts";
import { chargeStatic } from "../actions/charge-static.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers U5Fns5U7He-a2 */
describe("Rumble Coordinator power", () => {
  for (const classBonus of [false, true])
    for (const level of [0, 1, 3])
      it(`uses earned static counters only with Class Bonus=${classBonus}, level=${level}`, () => {
        const champion = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(rumbleCoordinator, classBonus, "activation-discount"),
            level,
          ),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [rumbleCoordinator],
              hand: [chargeStatic, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          ally = p.card(rumbleCoordinator),
          target = q.card(champion);
        p.activate(chargeStatic, {
          reservePayment: p
            .cards(woodlandSquirrels)
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
          targets: { "target-1": [ally.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.counters.static ?? 0).toBe(level);
        p.declareAttack(ally, target);
        for (let step = 0; game.state.combat && step < 64; step++) {
          if (game.state.decision?.kind === "resolve-optional-effect")
            answerDecision(game, "resolve-optional-effect", false);
          else if (game.state.decision?.kind === "choose-retaliators")
            answerDecision(game, "choose-retaliators", []);
          else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        expect(game.state.combat).toBeNull();
        expect(game.state.objects[ally.objectId]!.counters.static ?? 0).toBe(level);
        expect(game.state.objects[target.objectId]!.damage).toBe(2 + (classBonus ? level : 0));
      });
});
