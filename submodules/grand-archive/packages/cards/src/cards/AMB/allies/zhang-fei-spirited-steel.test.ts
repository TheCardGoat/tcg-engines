import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { zhangFeiSpiritedSteel } from "./zhang-fei-spirited-steel.ts";

function advanceToEnd(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 128; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === "end") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to end`);
  }
  throw new Error("Did not reach the end phase");
}

/** @covers qxnv0jqeym-a1 */
describe("Zhang Fei, Spirited Steel — Class Bonus Vigor", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "wakes" : "stays rested"} at the beginning of the end phase`, () => {
      const champion = createClassBonusTestChampion(
        zhangFeiSpiritedSteel,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [zhangFeiSpiritedSteel],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const ally = player.card(zhangFeiSpiritedSteel, { zone: "field" });
      player.declareAttack(ally, game.player("player-two").card(champion, { zone: "field" }));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
      advanceToEnd(game, player.id);
      if (game.state.decision?.kind === "order-triggered-abilities") {
        answerDecision(game, "order-triggered-abilities", game.state.decision.pendingTriggerIds);
      }
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(!classBonus);
    });
  }
});

/** @covers qxnv0jqeym-a2 */
describe("Zhang Fei, Spirited Steel — sole-ally end-phase buff", () => {
  for (const classBonus of [false, true]) {
    for (const onlyAlly of [false, true]) {
      it(`classBonus=${classBonus}, only ally=${onlyAlly}`, () => {
        const champion = createClassBonusTestChampion(
          zhangFeiSpiritedSteel,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: onlyAlly
                ? [zhangFeiSpiritedSteel]
                : [zhangFeiSpiritedSteel, woodlandSquirrels],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
          },
        });
        const player = game.player("player-one");
        const ally = player.card(zhangFeiSpiritedSteel, { zone: "field" });
        expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
        advanceToEnd(game, player.id);
        if (game.state.decision?.kind === "order-triggered-abilities") {
          answerDecision(game, "order-triggered-abilities", game.state.decision.pendingTriggerIds);
        }
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(
          classBonus && onlyAlly ? 1 : 0,
        );
      });
    }
  }
});
