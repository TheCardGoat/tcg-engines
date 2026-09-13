import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { pleaForPeace } from "./plea-for-peace.ts";

function advanceToMain(
  game: GrandArchiveTestEngine,
  playerId: "player-one" | "player-two",
  afterTurn = 0,
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

/** @covers ir99sx6q3p-a1 */
describe("Plea for Peace — attack declaration tax", () => {
  it("taxes each player's attacks until the beginning of its controller's next turn", () => {
    const champion = createClassBonusTestChampion(pleaForPeace, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [giantTortoise, woodlandSquirrels],
          hand: [pleaForPeace, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [automatedGardener],
          hand: [woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownChampion = player.card(champion);
    const opponentChampion = opponent.card(champion);
    const playerPayments = player.cards(woodlandSquirrels, { zone: "hand" });
    player.activate(pleaForPeace, {
      reservePayment: [{ kind: "card", cardId: playerPayments[0]!.objectId }],
    });
    passEffectsStack(game);

    const firstAttacker = player.card(giantTortoise, { zone: "field" });
    const beforeOwnUnpaid = game.state;
    expect(() => player.declareAttack(firstAttacker, opponentChampion)).toThrow();
    expect(game.state).toEqual(beforeOwnUnpaid);
    player.declareAttack(firstAttacker, opponentChampion, {
      reservePayment: [{ kind: "card", cardId: playerPayments[1]!.objectId }],
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[opponentChampion.objectId]!.damage).toBe(1);

    advanceToMain(game, "player-two");
    const opponentAttacker = opponent.card(automatedGardener, { zone: "field" });
    const beforeOpponentUnpaid = game.state;
    expect(() => opponent.declareAttack(opponentAttacker, ownChampion)).toThrow();
    expect(game.state).toEqual(beforeOpponentUnpaid);
    opponent.declareAttack(opponentAttacker, ownChampion, {
      reservePayment: [
        {
          kind: "card",
          cardId: opponent.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
        },
      ],
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);

    const opponentTurn = game.state.turn.number;
    advanceToMain(game, "player-one", opponentTurn);
    player.declareAttack(player.card(woodlandSquirrels, { zone: "field" }), opponentChampion);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[opponentChampion.objectId]!.damage).toBe(2);
  });
});
