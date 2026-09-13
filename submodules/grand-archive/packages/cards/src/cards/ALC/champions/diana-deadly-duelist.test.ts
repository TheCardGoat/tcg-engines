import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { platedBullet } from "../../P24/items/plated-bullet.ts";
import { aurousteelGreatsword } from "../tokens/aurousteel-greatsword.ts";
import { dianaDeadlyDuelist } from "./diana-deadly-duelist.ts";

/** @covers 7ozuj68m69-a1 */
describe("diana-deadly-duelist — Lineage", () => {
  proveChampionLineage({ card: dianaDeadlyDuelist, lineageName: "Diana", level: 2, memoryCost: 2 });
});

/** @covers 7ozuj68m69-a2 */
describe("Diana, Deadly Duelist — entry Bullet materialization", () => {
  it("chooses and materializes a Bullet from the material deck", () => {
    const starter = lineageTestChampion("Diana", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Diana", 1)],
        zones: {
          "material-deck": [dianaDeadlyDuelist, platedBullet],
          memory: [woodlandSquirrels, woodlandSquirrels],
          hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const bullet = player.card(platedBullet, { zone: "material-deck" });
    player.materialize(dianaDeadlyDuelist);
    player.pass();
    game.player("player-two").pass();
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [bullet.objectId]);
    passEffectsStack(game);
    answerDecision(game, "announce-effect-materialization", {});
    passEffectsStack(game);
    expect(game.state.objects[bullet.objectId]!.zone).toBe("field");
  });
});

/** @covers 7ozuj68m69-a3 */
describe("Diana, Deadly Duelist — inherited Ranged 2", () => {
  it("adds two power to a distant successor champion's attack", () => {
    const starter = lineageTestChampion("Diana", 0);
    const opponent = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [
          lineageTestChampion("Diana", 1),
          dianaDeadlyDuelist,
          lineageTestChampion("Diana", 3),
        ],
        zones: {
          field: [aurousteelGreatsword],
          hand: [reposition, woodlandSquirrels],
        },
      },
      playerTwo: { champion: opponent },
    });
    const player = game.player("player-one");
    const champion = player.card(starter);
    const target = game.player("player-two").card(opponent);
    player.activate(reposition, {
      targets: { "target-1": [champion.objectId] },
      reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
    });
    expect(game.resolveStackUntilChoice()).toBe("stack-empty");
    player.declareAttack(champion, target, {
      weaponIds: [player.card(aurousteelGreatsword).objectId],
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(5);
  });
});
