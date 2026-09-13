import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { zanderDeftExecutor } from "../../PRXY/champions/zander-deft-executor.ts";
import { nagasFang } from "./nagas-fang.ts";

/** @covers n67ghdh1t6-a1 */
describe("Naga's Fang — preparation power", () => {
  it("gains +1 POWER after removing a preparation counter", () => {
    const starter = lineageTestChampion("Zander", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Zander", 1)],
        zones: {
          "material-deck": [zanderDeftExecutor],
          field: [nagasFang],
          memory: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const champion = player.card(starter, { zone: "field" });
    const weapon = player.card(nagasFang, { zone: "field" });
    const before = game.state;
    expect(() => player.activateAbility(nagasFang, "n67ghdh1t6-a1")).toThrow();
    expect(game.state).toEqual(before);
    player.materialize(zanderDeftExecutor);
    player.pass();
    game.player("player-two").pass();
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-optional-effect")
      answerDecision(game, "resolve-optional-effect", false);
    passEffectsStack(game);
    expect(game.state.objects[champion.objectId]!.counters.preparation).toBeGreaterThanOrEqual(1);
    for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    player.activateAbility(nagasFang, "n67ghdh1t6-a1");
    passEffectsStack(game);
    player.declareAttack(
      champion,
      game.player("player-two").card(lineageTestChampion("Opponent", 0), { zone: "field" }),
      { weaponIds: [weapon.objectId] },
    );
    game.resolveCombatWithoutRetaliation();
    expect(
      game.state.objects[
        game.player("player-two").card(lineageTestChampion("Opponent", 0), { zone: "field" })
          .objectId
      ]!.damage,
    ).toBe(2);
  });
});
