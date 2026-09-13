import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { liuBeiOathkeeper } from "../allies/liu-bei-oathkeeper.ts";
import { bringDownTheMighty } from "./bring-down-the-mighty.ts";

function advanceToLaterMain(
  game: GrandArchiveTestEngine,
  playerId: string,
  afterTurn: number,
): void {
  for (let step = 0; step < 192; step++) {
    if (
      game.state.turn.number > afterTurn &&
      game.state.turn.playerId === playerId &&
      game.state.turn.phase === "main"
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach the requested main phase");
}

/** @covers ybds1rkgnp-a1 */
describe("Bring Down the Mighty — forbid attack and unique draw", () => {
  it("stops the targeted ally from attacking and draws only if that ally is unique", () => {
    for (const unique of [false, true]) {
      const champion = createClassBonusTestChampion(
        bringDownTheMighty,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [bringDownTheMighty, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [unique ? liuBeiOathkeeper : woodlandSquirrels],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const ally = opponent.card(unique ? liuBeiOathkeeper : woodlandSquirrels, { zone: "field" });
      const deck = player.zone("main-deck");
      player.activate(bringDownTheMighty, {
        reservePayment: [
          { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
        targets: { "target-1": [ally.objectId] },
      });
      passEffectsStack(game);
      if (unique) {
        expect(player.zone("memory")).toContainEqual(deck[0]);
        expect(player.zone("main-deck")).toEqual(deck.slice(1));
      } else {
        expect(player.zone("memory")).toHaveLength(1);
        expect(player.zone("main-deck")).toEqual(deck);
      }

      for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      const defender = player.card(champion, { zone: "field" });
      const blocked = game.state;
      expect(() => opponent.declareAttack(ally, defender)).toThrow();
      expect(game.state).toEqual(blocked);

      advanceToLaterMain(game, player.id, game.state.turn.number);
      advanceToLaterMain(game, opponent.id, game.state.turn.number);
      opponent.declareAttack(ally, defender);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[defender.objectId]!.damage).toBe(unique ? 2 : 1);
    }
  }, 15_000);
});
