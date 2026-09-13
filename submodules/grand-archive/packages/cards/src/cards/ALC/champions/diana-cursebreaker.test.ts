import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { platedBullet } from "../../P24/items/plated-bullet.ts";
import { umbraSight } from "../actions/umbra-sight.ts";
import { aurousteelGreatsword } from "../tokens/aurousteel-greatsword.ts";
import { dianaCursebreaker } from "./diana-cursebreaker.ts";

/** @covers o0qtb31x97-a1 */
describe("diana-cursebreaker — Lineage", () => {
  proveChampionLineage({ card: dianaCursebreaker, lineageName: "Diana", level: 3, memoryCost: 3 });
});

/** @covers o0qtb31x97-a2 */
describe("Diana, Cursebreaker — lineage release", () => {
  it("banishes four Curses, materializes two Bullets, and wakes on attack", () => {
    const starter = lineageTestChampion("Diana", 0);
    const opponentChampion = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [
          lineageTestChampion("Diana", 1),
          lineageTestChampion("Diana", 2),
          dianaCursebreaker,
        ],
        zones: {
          hand: Array.from({ length: 4 }, () => umbraSight),
          field: [aurousteelGreatsword],
          "material-deck": [platedBullet, platedBullet],
          "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: opponentChampion,
        zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const champion = player.card(starter, { zone: "field" });
    for (const curse of player.cards(umbraSight, { zone: "hand" })) {
      player.activate(curse);
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", true);
      passEffectsStack(game);
    }
    const curses = player.cards(umbraSight, { zone: "inner-lineage" });
    expect(curses).toHaveLength(4);
    player.activateAbility(champion, "o0qtb31x97-a2", {
      costSelections: [curses.map((card) => card.objectId)],
    });
    expect(player.cards(umbraSight, { zone: "banishment" })).toHaveLength(4);
    passEffectsStack(game);
    const bullets = player.cards(platedBullet, { zone: "material-deck" });
    answerDecision(
      game,
      "resolve-effect-choice",
      bullets.map((card) => card.objectId),
    );
    for (const bullet of bullets) {
      passEffectsStack(game);
      expect(game.state.decision).toMatchObject({
        kind: "announce-effect-materialization",
        cardId: bullet.objectId,
      });
      answerDecision(game, "announce-effect-materialization", {});
    }
    passEffectsStack(game);
    expect(player.cards(platedBullet, { zone: "field" })).toHaveLength(2);

    player.declareAttack(champion, game.player("player-two").card(opponentChampion), {
      weaponIds: [player.card(aurousteelGreatsword).objectId],
    });
    expect(game.state.objects[champion.objectId]!.states.has("rested")).toBe(true);
    advanceCombatToTrigger(game, "granted-guor22-a1");
    passEffectsStack(game);
    expect(game.state.objects[champion.objectId]!.states.has("rested")).toBe(false);
  });
});
