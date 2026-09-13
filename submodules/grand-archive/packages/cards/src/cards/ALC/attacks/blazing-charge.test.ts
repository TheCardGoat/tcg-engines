import type { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveTestEngine as TestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { blazingCharge } from "./blazing-charge.ts";

function advanceToMain(
  game: GrandArchiveTestEngine,
  playerId: "player-one" | "player-two",
  afterTurn = -1,
): void {
  for (let step = 0; step < 256; step++) {
    if (
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "main" &&
      game.state.turn.number > afterTurn
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
  }
  throw new Error(`Did not reach ${playerId}'s main phase`);
}

function declareBlazingCharge(classMatches: boolean) {
  const champion = createClassBonusTestChampion(blazingCharge, classMatches, "activation-discount");
  const game = TestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [blazingCharge, woodlandSquirrels, woodlandSquirrels],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [automatedGardener, automatedGardener],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  const attacker = player.card(champion, { zone: "field" });
  const target = opponent.card(champion, { zone: "field" });
  player.activate(blazingCharge, {
    attackAttackerId: attacker.objectId,
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => ({ kind: "card", cardId: card.objectId })),
  });
  expect(game.resolveStackUntilChoice()).toBe("decision");
  player.executeLegal(
    (candidate) =>
      candidate.command.move === "answer-decision" &&
      typeof candidate.command.answer === "object" &&
      candidate.command.answer !== null &&
      "attackerId" in candidate.command.answer &&
      candidate.command.answer.attackerId === attacker.objectId &&
      !("delegatePlayerId" in candidate.command.answer) &&
      "targetIds" in candidate.command.answer &&
      Array.isArray(candidate.command.answer.targetIds) &&
      candidate.command.answer.targetIds.includes(target.objectId),
    "declare Blazing Charge against the opposing champion",
  );
  advanceCombatToTrigger(game, "s5jwsl7ded-a2");
  passEffectsStack(game);
  game.resolveCombatWithoutRetaliation();
  return { game, player, opponent, champion, target };
}

/** @covers s5jwsl7ded-a1 */
describe("Blazing Charge — Class Bonus power", () => {
  for (const classMatches of [false, true]) {
    it(`deals ${classMatches ? 5 : 3} combat damage with class match=${classMatches}`, () => {
      const { game, target } = declareBlazingCharge(classMatches);
      expect(game.state.objects[target.objectId]!.damage).toBe(classMatches ? 5 : 3);
    });
  }
});

/** @covers s5jwsl7ded-a2 */
describe("Blazing Charge — champion damage amplification", () => {
  it("adds one through the next opponent turn and expires at the controller's next turn", () => {
    const { game, player, opponent, champion } = declareBlazingCharge(true);
    const ownChampion = player.card(champion, { zone: "field" });
    const enemyAttackers = opponent.cards(automatedGardener, { zone: "field" });

    advanceToMain(game, "player-two");
    opponent.declareAttack(enemyAttackers[0]!, ownChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(3);

    const firstOpponentTurn = game.state.turn.number;
    advanceToMain(game, "player-two", firstOpponentTurn);
    opponent.declareAttack(enemyAttackers[1]!, ownChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(5);
  });
});
