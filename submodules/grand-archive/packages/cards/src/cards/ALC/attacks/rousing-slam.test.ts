import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceCombatToTrigger, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { rousingSlam } from "./rousing-slam.ts";

const abilityId = "v5klryvfq3-a1";

function guardianChampion(level: 1 | 2, classMatches: boolean) {
  const base = lineageTestChampion("Rousing", level);
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  const championClass = classMatches ? "GUARDIAN" : "MAGE";
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        typeLine: {
          ...base.layout.face.typeLine,
          classes: [championClass],
          subtypes: [championClass],
        },
        elements: ["NORM", "WIND"] as const,
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

function advanceToMain(
  game: GrandArchiveTestEngine,
  playerId: ReturnType<GrandArchiveTestEngine["player"]>["id"],
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

function declareRousingAttack(level: 1 | 2, classMatches: boolean) {
  const starter = lineageTestChampion("Rousing", 0);
  const champion = guardianChampion(level, classMatches);
  const opponentChampion = lineageTestChampion("Opponent", 0);
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion: starter,
      lineage: level === 2 ? [lineageTestChampion("Rousing", 1)] : [],
      zones: {
        "material-deck": [champion],
        memory: Array.from({ length: level }, () => woodlandSquirrels),
        field: [automatedGardener],
        hand: [rousingSlam, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: opponentChampion,
      zones: {
        field: [giantTortoise, giantTortoise],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  const attacker = player.card(starter);
  const target = opponent.card(opponentChampion);
  player.materialize(champion);
  player.pass();
  opponent.pass();
  advanceToMain(game, player.id);
  player.activate(rousingSlam, {
    attackAttackerId: attacker.objectId,
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 4)
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
    "declare the Rousing Slam attack against the opposing champion",
  );
  advanceCombatToTrigger(game, abilityId);
  return { game, player, opponent, attacker, target };
}

/** @covers v5klryvfq3-a1 */
describe("Rousing Slam — restricted Vigor and Taunt grant", () => {
  it("wakes the attacker, enforces Taunt, and expires at the controller's next turn", () => {
    const { game, player, opponent, attacker, target } = declareRousingAttack(2, true);
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
      ),
    ).toBe(true);
    passEffectsStack(game);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(4);
    expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);

    for (
      let step = 0;
      game.state.objects[attacker.objectId]!.states.has("rested") && step < 64;
      step++
    ) {
      if (game.state.stack.length > 0) passEffectsStack(game);
      else {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
    }
    expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(false);
    advanceToMain(game, opponent.id);

    const [firstOpponentAttacker, secondOpponentAttacker] = opponent.cards(giantTortoise);
    const alternateTarget = player.card(automatedGardener);
    const beforeIgnoredTaunt = game.state;
    expect(() => opponent.declareAttack(firstOpponentAttacker!, alternateTarget)).toThrow();
    expect(game.state).toEqual(beforeIgnoredTaunt);
    opponent.declareAttack(firstOpponentAttacker!, attacker);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[attacker.objectId]!.damage).toBe(1);

    const firstOpponentTurn = game.state.turn.number;
    advanceToMain(game, opponent.id, firstOpponentTurn);
    opponent.declareAttack(secondOpponentAttacker!, alternateTarget);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[alternateTarget.objectId]!.damage).toBe(1);
  });

  for (const [level, classMatches] of [
    [1, true],
    [2, false],
  ] as const) {
    it(`does not trigger at level ${level} with class match=${classMatches}`, () => {
      const { game, attacker } = declareRousingAttack(level, classMatches);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
        ),
      ).toBe(false);
      expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(true);
    });
  }
});
