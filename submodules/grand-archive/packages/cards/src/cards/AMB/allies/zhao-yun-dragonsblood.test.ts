import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { zhaoYunDragonsblood } from "./zhao-yun-dragonsblood.ts";

function advanceToMain(game: GrandArchiveTestEngine, playerId: string): void {
  for (let step = 0; step < 128; step++) {
    if (game.state.turn.playerId === playerId && game.state.turn.phase === "main") return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
  }
  throw new Error("Did not reach main phase");
}

/** @covers mwfrfo3wzq-a1 */
describe("Zhao Yun, Dragonsblood — Class Bonus On Attack", () => {
  for (const classBonus of [false, true]) {
    for (const accept of [false, true]) {
      it(`classBonus=${classBonus}, self-damage=${accept}`, () => {
        const champion = createClassBonusTestChampion(
          zhaoYunDragonsblood,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: { champion, zones: { field: [zhaoYunDragonsblood] } },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion, { zone: "field" });
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(player.card(zhaoYunDragonsblood, { zone: "field" }), target);
        passEffectsStack(game);
        if (classBonus) {
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
        }
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(classBonus && accept ? 2 : 0);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(classBonus && accept ? 4 : 2);
      });
    }
  }
});

/** @covers mwfrfo3wzq-a2 */
describe("Zhao Yun, Dragonsblood — Class Bonus On Kill immortality", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "gains" : "does not gain"} immortality after a kill`, () => {
      const champion = createClassBonusTestChampion(
        zhaoYunDragonsblood,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [zhaoYunDragonsblood],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [woodlandSquirrels, automatedGardener, automatedGardener],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const zhao = player.card(zhaoYunDragonsblood, { zone: "field" });
      player.declareAttack(zhao, opponent.card(woodlandSquirrels, { zone: "field" }));
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
      }
      game.resolveCombatWithoutRetaliation();
      expect(opponent.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
      advanceToMain(game, opponent.id);
      const attackers = opponent.cards(automatedGardener, { zone: "field" });
      opponent.declareAttack(attackers[0]!, zhao);
      game.resolveCombatWithoutRetaliation();
      opponent.declareAttack(attackers[1]!, zhao);
      game.resolveCombatWithoutRetaliation();
      if (classBonus) {
        expect(game.state.objects[zhao.objectId]!.zone).toBe("field");
        expect(game.state.objects[zhao.objectId]!.damage).toBeGreaterThanOrEqual(3);
      } else {
        expect(game.state.objects[zhao.objectId]!.zone).toBe("graveyard");
      }
    });
  }
});
