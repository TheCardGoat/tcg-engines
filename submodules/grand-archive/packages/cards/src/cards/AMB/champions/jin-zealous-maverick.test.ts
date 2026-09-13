import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { jinZealousMaverick } from "./jin-zealous-maverick.ts";

/** @covers 5ramr16052-a1 */
describe("Jin, Zealous Maverick — Lineage", () => {
  proveChampionLineage({
    card: jinZealousMaverick,
    lineageName: "Jin",
    level: 2,
    memoryCost: 2,
  });
});

/** @covers 5ramr16052-a2 */
describe("Jin, Zealous Maverick — next attack", () => {
  it("gives the next attack +1 POWER and wakes Jin", () => {
    const starter = lineageTestChampion("Jin", 0);
    const opponent = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Jin", 1)],
        zones: {
          "material-deck": [jinZealousMaverick],
          field: [trainingSword],
          memory: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: opponent,
        zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const champion = player.card(starter, { zone: "field" });
    const target = game.player("player-two").card(opponent, { zone: "field" });
    const weapon = player.card(trainingSword, { zone: "field" });
    player.materialize(jinZealousMaverick);
    player.pass();
    game.player("player-two").pass();
    passEffectsStack(game);
    advanceToMain(game, player.id);
    player.declareAttack(champion, target, { weaponIds: [weapon.objectId] });
    passEffectsStack(game);
    if (game.state.stack.length > 0) passEffectsStack(game);
    expect(game.state.objects[champion.objectId]!.states.has("rested")).toBe(false);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
});
