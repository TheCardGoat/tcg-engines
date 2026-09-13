import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { allianceGearshield } from "../items/alliance-gearshield.ts";
import { aurousteelGreatsword } from "../tokens/aurousteel-greatsword.ts";
import { vanitasDominusRex } from "./vanitas-dominus-rex.ts";

/** @covers 3vkxrw9462-a1 */
describe("vanitas-dominus-rex — Lineage", () => {
  proveChampionLineage({
    card: vanitasDominusRex,
    lineageName: "Vanitas",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers 3vkxrw9462-a2 */
describe("Vanitas, Dominus Rex — material-deck activation", () => {
  it("activates from the material deck with one discount per three champion damage", () => {
    const champion = createClassBonusTestChampion(vanitasDominusRex, true, "activation-discount");
    const opponentChampion = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [aurousteelGreatsword],
          "material-deck": [vanitasDominusRex],
          memory: [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: opponentChampion },
    });
    const player = game.player("player-one");
    player.declareAttack(player.card(champion), game.player("player-two").card(opponentChampion), {
      weaponIds: [player.card(aurousteelGreatsword).objectId],
    });
    game.resolveCombatWithoutRetaliation();
    const card = player.card(vanitasDominusRex, { zone: "material-deck" });
    player.execute({
      move: "activate-card",
      cardId: card.objectId,
    });
    expect(game.state.objects[card.objectId]!.zone).toBe("effects-stack");
    expect(player.zone("memory")).toHaveLength(0);
  });
});

/** @covers 3vkxrw9462-a3 */
describe("Vanitas, Dominus Rex — Champion Hit materialization tax", () => {
  it("taxes the hit opponent's materializations until Vanitas' next turn", () => {
    const starter = lineageTestChampion("Vanitas", 0);
    const opponentChampion = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [
          lineageTestChampion("Vanitas", 1),
          lineageTestChampion("Vanitas", 2),
          vanitasDominusRex,
        ],
        zones: { field: [aurousteelGreatsword] },
      },
      playerTwo: {
        champion: opponentChampion,
        zones: {
          field: [automatedGardener],
          "material-deck": [allianceGearshield],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.declareAttack(player.card(starter), opponent.card(opponentChampion), {
      weaponIds: [player.card(aurousteelGreatsword).objectId],
    });
    advanceCombatToTrigger(game, "3vkxrw9462-a3");
    passEffectsStack(game);
    if (game.state.combat) game.resolveCombatWithoutRetaliation();

    for (let step = 0; step < 96; step++) {
      const wait = game.waitState();
      if (
        game.state.turn.playerId === opponent.id &&
        game.state.turn.phase === "materialize" &&
        wait.kind === "materialization-choice"
      )
        break;
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    expect(() =>
      opponent.materialize(allianceGearshield, {
        targets: { "intrinsic-link-target": [opponent.card(automatedGardener).objectId] },
      }),
    ).toThrow();
  });
});
