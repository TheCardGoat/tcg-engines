import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tonorisMightOfHumanity } from "./tonoris-might-of-humanity.ts";

const guardianWeapon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tonoris-might-test-weapon",
  slug: "tonoris-might-test-weapon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tonoris-might-test-weapon:face:default",
      catalogId: "tonoris-might-test-weapon",
      name: "Tonoris Might Test Weapon",
      cost: { kind: "memory", amount: 0 },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: { power: 1, durability: 2 },
      rulesText: "",
      abilities: [],
    },
  },
};

/** @covers yevpmu6gvn-a1 */
describe("tonoris-might-of-humanity — Lineage", () => {
  proveChampionLineage({
    card: tonorisMightOfHumanity,
    lineageName: "Tonoris",
    level: 2,
    memoryCost: 2,
  });
});

function advanceToOwnMain(game: GrandArchiveTestEngine, afterTurn = 0): void {
  for (
    let step = 0;
    !(
      game.state.turn.playerId === "player-one" &&
      game.state.turn.phase === "main" &&
      game.state.turn.number > afterTurn
    ) && step < 128;
    step++
  ) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  expect(game.state.turn.playerId).toBe("player-one");
  expect(game.state.turn.phase).toBe("main");
  expect(game.state.turn.number).toBeGreaterThan(afterTurn);
}

/** @covers yevpmu6gvn-a2 */
describe("Tonoris, Might of Humanity — next attack bonus", () => {
  it("creates the bonus on entry for only the next attack that turn", () => {
    const starter = lineageTestChampion("Tonoris", 0);
    const levelOne = lineageTestChampion("Tonoris", 1);
    const opponentChampion = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: starter,
        lineage: [levelOne],
        zones: {
          "material-deck": [tonorisMightOfHumanity],
          field: [guardianWeapon],
          memory: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion: opponentChampion,
        zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const champion = player.card(starter);
    const weapon = player.card(guardianWeapon);
    const target = opponent.card(opponentChampion);
    player.materialize(tonorisMightOfHumanity);
    expect(game.state.objects[champion.objectId]!.activeDefinitionId).not.toBe(
      tonorisMightOfHumanity.canonicalId,
    );
    player.pass();
    opponent.pass();
    expect(game.state.objects[champion.objectId]!.activeDefinitionId).toBe(
      tonorisMightOfHumanity.canonicalId,
    );
    expect(game.state.stack).toHaveLength(1);
    expect(game.state.stack[0]).toMatchObject({
      kind: "triggered-ability",
      sourceId: champion.objectId,
      ability: { id: "yevpmu6gvn-a2" },
    });
    passEffectsStack(game);
    advanceToOwnMain(game);

    player.declareAttack(champion, target, { weaponIds: [weapon.objectId] });
    expect(game.state.stack).toHaveLength(1);
    passEffectsStack(game);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(4);

    const firstTurn = game.state.turn.number;
    advanceToOwnMain(game, firstTurn);
    player.declareAttack(champion, target, { weaponIds: [weapon.objectId] });
    expect(game.state.stack).toHaveLength(0);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(5);
  });
});
