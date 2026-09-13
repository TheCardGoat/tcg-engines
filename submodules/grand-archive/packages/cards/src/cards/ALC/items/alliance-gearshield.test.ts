import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { allianceGearshield } from "./alliance-gearshield.ts";

/** @covers c8ljyevpmu-a1 @covers c8ljyevpmu-a2 */
describe("Alliance Gearshield", () => {
  it("links to an ally, grants life, and grants Class Bonus power while retaliating", () => {
    const champion = createClassBonusTestChampion(allianceGearshield, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          field: [automatedGardener],
          "material-deck": [allianceGearshield],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [automatedGardener],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const defender = player.card(automatedGardener);
    player.materialize(allianceGearshield, {
      targets: { "intrinsic-link-target": [defender.objectId] },
    });
    passEffectsStack(game);
    const shield = player.card(allianceGearshield, { zone: "field" });
    expect(game.state.objects[shield.objectId]!.hostId).toBe(defender.objectId);

    for (
      let step = 0;
      step < 80 && !(game.state.turn.playerId === opponent.id && game.state.turn.phase === "main");
      step++
    ) {
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    const attacker = opponent.card(automatedGardener);
    opponent.declareAttack(attacker, defender);
    for (let step = 0; game.state.combat && step < 40; step++) {
      const wait = game.waitState();
      if (game.state.decision?.kind === "choose-retaliators") {
        answerDecision(game, "choose-retaliators", [defender.objectId]);
      } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    expect(opponent.cards(automatedGardener, { zone: "graveyard" })).toHaveLength(1);
    expect(game.state.objects[defender.objectId]!.zone).toBe("field");
    expect(game.state.objects[defender.objectId]!.damage).toBe(2);
  });
});
