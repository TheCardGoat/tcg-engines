import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { windsOfRetribution } from "./winds-of-retribution.ts";

function champion(level: 0 | 1 | 2, classMatches: boolean) {
  const base = lineageTestChampion("Winds", level);
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

function advanceToOwnMain(game: GrandArchiveTestEngine): void {
  const turn = game.state.turn.number;
  for (let step = 0; step < 128; step++) {
    if (
      game.state.turn.number > turn &&
      game.state.turn.playerId === game.player("player-one").id &&
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

/** @covers huqj5bbae3-a1 */
/** @covers huqj5bbae3-a2 */
describe("Winds of Retribution — doubly restricted discount and ally power", () => {
  for (const [level, classMatches, expectedCost] of [
    [2, true, 4],
    [1, true, 6],
    [2, false, 6],
  ] as const) {
    it(`level=${level}, class match=${classMatches}, cost=${expectedCost}`, () => {
      const starter = champion(0, classMatches);
      const enemyChampion = lineageTestChampion("Winds opponent", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: Array.from({ length: level }, (_, index) =>
            champion((index + 1) as 1 | 2, classMatches),
          ),
          zones: {
            field: [woodlandSquirrels, woodlandSquirrels],
            hand: [windsOfRetribution, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: enemyChampion,
          zones: {
            field: [woodlandSquirrels],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const payment = player.cards(woodlandSquirrels, { zone: "hand" });
      const beforeUnderpayment = game.state;
      expect(() =>
        player.activate(windsOfRetribution, {
          reservePayment: payment.slice(0, expectedCost - 1).map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
        }),
      ).toThrow();
      expect(game.state).toEqual(beforeUnderpayment);

      player.activate(windsOfRetribution, {
        reservePayment: payment.slice(0, expectedCost).map((card) => ({
          kind: "card",
          cardId: card.objectId,
        })),
      });
      const [firstAlly, secondAlly] = player.cards(woodlandSquirrels, { zone: "field" });
      const opposingAlly = opponent.card(woodlandSquirrels, { zone: "field" });
      passEffectsStack(game);
      const target = opponent.card(enemyChampion);
      player.declareAttack(firstAlly!, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(3);
      expect(game.state.objects[opposingAlly.objectId]!.damage).toBe(0);

      advanceToOwnMain(game);
      player.declareAttack(secondAlly!, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(4);
    });
  }
});
