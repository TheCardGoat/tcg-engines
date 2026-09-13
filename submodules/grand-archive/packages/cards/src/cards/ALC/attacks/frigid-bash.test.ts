import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { rustedWarshield } from "../items/rusted-warshield.ts";
import { frigidBash } from "./frigid-bash.ts";

/** @covers k2c7wklzjm-a1 */
describe("Frigid Bash — Shield discount", () => {
  it("costs one while its controller has a Shield item", () => {
    const champion = createClassBonusTestChampion(frigidBash, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [rustedWarshield], hand: [frigidBash, woodlandSquirrels] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activate(frigidBash, {
      attackAttackerId: player.card(champion).objectId,
      reservePayment: [
        { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    expect(player.cards(frigidBash, { zone: "effects-stack" })).toHaveLength(1);
  });
});

/** @covers k2c7wklzjm-a2 */
describe("Frigid Bash — frozen hit object", () => {
  it("keeps the hit object rested through its controller's next wake-up when they decline payment", () => {
    const champion = createClassBonusTestChampion(frigidBash, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [rustedWarshield],
          hand: [glacialGuidance, frigidBash, woodlandSquirrels, woodlandSquirrels],
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
    const target = opponent.card(automatedGardener);
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    player.activate(glacialGuidance, {
      targets: { "target-1": [target.objectId] },
      reservePayment: [{ kind: "card", cardId: payments[0]!.objectId }],
    });
    passEffectsStack(game);
    player.activate(frigidBash, {
      attackAttackerId: player.card(champion).objectId,
      reservePayment: [{ kind: "card", cardId: payments[1]!.objectId }],
    });
    for (let step = 0; game.waitState().kind !== "decision" && step < 16; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const attackChampion = player.card(champion).objectId;
    player.executeLegal(
      (candidate) =>
        candidate.command.move === "answer-decision" &&
        typeof candidate.command.answer === "object" &&
        candidate.command.answer !== null &&
        "attackerId" in candidate.command.answer &&
        candidate.command.answer.attackerId === attackChampion &&
        !("delegatePlayerId" in candidate.command.answer) &&
        "targetIds" in candidate.command.answer &&
        Array.isArray(candidate.command.answer.targetIds) &&
        candidate.command.answer.targetIds.includes(target.objectId),
      "attack the rested ally with Frigid Bash",
    );
    advanceCombatToTrigger(game, "k2c7wklzjm-a2");
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-payment", false);
    passEffectsStack(game);
    if (game.state.combat) game.resolveCombatWithoutRetaliation();

    for (let step = 0; step < 128; step++) {
      if (game.state.turn.playerId === opponent.id && game.state.turn.phase === "materialize")
        break;
      const wait = game.waitState();
      if (wait.kind === "materialization-choice")
        game.player(wait.playerId).execute({ move: "skip-materialization" });
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    expect(game.state.turn.playerId).toBe(opponent.id);
    expect(game.state.turn.phase).toBe("materialize");
    expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
  });
});
