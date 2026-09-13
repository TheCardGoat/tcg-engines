import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { crescentGlaive } from "../weapons/crescent-glaive.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { jinFateDefiant } from "./jin-fate-defiant.ts";

/** @covers zd8l14052j-a1 */
describe("Jin, Fate Defiant — Inherited Polearm attacks", () => {
  it("buffs a Horse ally when Jin attacks with a Polearm weapon", () => {
    const starter = lineageTestChampion("Jin", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [jinFateDefiant, lineageTestChampion("Jin", 2)],
        zones: { field: [crescentGlaive, galesMare, woodlandSquirrels] },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const attacker = player.card(starter, { zone: "field" });
    const horse = player.card(galesMare, { zone: "field" });
    const target = game.player("player-two").card(lineageTestChampion("Opponent", 0), {
      zone: "field",
    });
    player.declareAttack(attacker, target, {
      weaponIds: [player.card(crescentGlaive, { zone: "field" }).objectId],
    });
    if (game.state.decision?.kind === "announce-triggered-ability") {
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [horse.objectId] },
      });
    }
    passEffectsStack(game);
    if (game.state.combat) game.resolveCombatWithoutRetaliation();
    player.declareAttack(horse, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(1 + 3);
  });

  it("does not trigger for a Sword weapon", () => {
    const starter = lineageTestChampion("Jin", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [jinFateDefiant, lineageTestChampion("Jin", 2)],
        zones: { field: [trainingSword, galesMare] },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    player.declareAttack(
      player.card(starter, { zone: "field" }),
      game.player("player-two").card(lineageTestChampion("Opponent", 0), { zone: "field" }),
      { weaponIds: [player.card(trainingSword, { zone: "field" }).objectId] },
    );
    expect(game.state.stack).toHaveLength(0);
  });
});
