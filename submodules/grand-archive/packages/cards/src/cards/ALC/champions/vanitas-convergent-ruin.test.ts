import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enchainingGale } from "../actions/enchaining-gale.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { allianceGearshield } from "../items/alliance-gearshield.ts";
import { aurousteelGreatsword } from "../tokens/aurousteel-greatsword.ts";
import { vanitasConvergentRuin } from "./vanitas-convergent-ruin.ts";

/** @covers 8m69iq4d5v-a1 */
describe("vanitas-convergent-ruin — Lineage", () => {
  proveChampionLineage({
    card: vanitasConvergentRuin,
    lineageName: "Vanitas",
    level: 2,
    memoryCost: 2,
  });
});

function fixture() {
  const starter = lineageTestChampion("Vanitas", 0);
  const opponentChampion = lineageTestChampion("Opponent", 0);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: starter,
      lineage: [lineageTestChampion("Vanitas", 1), vanitasConvergentRuin],
      zones: {
        field: [aurousteelGreatsword, aurousteelGreatsword],
        hand: [enchainingGale, woodlandSquirrels],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: opponentChampion,
      zones: {
        field: [automatedGardener],
        "material-deck": [allianceGearshield],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  return { game, starter, opponentChampion };
}

/** @covers 8m69iq4d5v-a2 */
describe("Vanitas, Convergent Ruin — next unarmed attack", () => {
  it("gets one power after activating a Spell and does not require a weapon", () => {
    const { game, starter, opponentChampion } = fixture();
    const player = game.player("player-one");
    const target = game.player("player-two").card(opponentChampion);
    const spellTarget = game.player("player-two").card(automatedGardener);
    player.activate(enchainingGale, {
      targets: { "target-1": [spellTarget.objectId] },
      reservePayment: [
        { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    passEffectsStack(game);
    player.declareAttack(player.card(starter), target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
});

/** @covers 8m69iq4d5v-a3 */
describe("Vanitas, Convergent Ruin — seven-damage Champion Hit", () => {
  it("makes that opponent's materializations cost one more until Vanitas' next turn", () => {
    const { game, starter, opponentChampion } = fixture();
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.card(opponentChampion);
    player.declareAttack(player.card(starter), target, {
      weaponIds: player.cards(aurousteelGreatsword).map((card) => card.objectId),
    });
    advanceCombatToTrigger(game, "8m69iq4d5v-a3");
    passEffectsStack(game);
    if (game.state.combat) game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(7);

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
