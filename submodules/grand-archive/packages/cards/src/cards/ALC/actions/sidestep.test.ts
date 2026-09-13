import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sidestep } from "./sidestep.ts";

function advanceToControllersNextMain(game: GrandArchiveTestEngine): void {
  const initialTurn = game.state.turn.number;
  const controller = game.player("player-one").id;
  for (let step = 0; step < 128; step++) {
    if (
      game.state.turn.number > initialTurn &&
      game.state.turn.playerId === controller &&
      game.state.turn.phase === "main"
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind} while advancing to main`);
  }
  throw new Error("Did not reach the controller's next main phase");
}

function fixture(level: 1 | 2) {
  const starter = lineageTestChampion("Sidestep", 0);
  const opponentChampion = lineageTestChampion("Sidestep opponent", 0);
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: starter,
      lineage: Array.from({ length: level }, (_, index) =>
        lineageTestChampion("Sidestep", index + 1),
      ),
      zones: {
        field: [woodlandSquirrels],
        hand: [sidestep, woodlandSquirrels, woodlandSquirrels],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: opponentChampion,
      zones: {
        field: [woodlandSquirrels],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
  return { game, opponentChampion };
}

/** @covers voy5ttkk39-a1 */
/** @covers voy5ttkk39-a2 */
describe("Sidestep — level discount and temporary Stealth", () => {
  for (const level of [1, 2] as const) {
    it(`pays ${level >= 2 ? 1 : 2} reserve at level ${level} and expires at turn end`, () => {
      const { game } = fixture(level);
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const attacker = player.card(woodlandSquirrels, { zone: "field" });
      const target = opponent.card(woodlandSquirrels, { zone: "field" });
      const payment = player.cards(woodlandSquirrels, { zone: "hand" });
      const cost = level >= 2 ? 1 : 2;
      const before = game.state;
      expect(() =>
        player.activate(sidestep, {
          reservePayment: payment.slice(0, cost - 1).map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);

      player.activate(sidestep, {
        reservePayment: payment.slice(0, cost).map((card) => ({
          kind: "card",
          cardId: card.objectId,
        })),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(player.zone("memory")).toHaveLength(cost);
      const whileStealthed = game.state;
      expect(() => player.declareAttack(attacker, target)).toThrow();
      expect(game.state).toEqual(whileStealthed);

      advanceToControllersNextMain(game);
      player.declareAttack(attacker, target);
      game.resolveCombatWithoutRetaliation();
      expect(opponent.cards(target, { zone: "graveyard" })).toHaveLength(1);
    });
  }
});
