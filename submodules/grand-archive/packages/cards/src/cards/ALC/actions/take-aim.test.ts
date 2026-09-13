import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { reposition } from "./reposition.ts";
import { takeAim } from "./take-aim.ts";

function advanceToNextOwnMain(game: GrandArchiveTestEngine, turn: number): void {
  for (
    let step = 0;
    !(
      game.state.turn.number > turn &&
      game.state.turn.playerId === "player-one" &&
      game.state.turn.phase === "main"
    ) && step < 128;
    step++
  ) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  expect(game.state.turn.playerId).toBe("player-one");
  expect(game.state.turn.phase).toBe("main");
}

/** @covers vnta6qsesw-a1 */
describe("Take Aim — next attack and Class Bonus Ranged", () => {
  for (const classBonus of [false, true]) {
    for (const distant of [false, true]) {
      it(`Class Bonus=${classBonus}, distant=${distant}`, () => {
        const champion = createClassBonusTestChampion(takeAim, classBonus, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise, potionOfHealing],
              hand: [
                takeAim,
                ...(distant ? [reposition] : []),
                ...Array.from({ length: 3 }, () => woodlandSquirrels),
                giantTortoise,
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const attacker = player.card(giantTortoise, { zone: "field" });
        const target = opponent.card(champion);
        const payments = player.cards(woodlandSquirrels, { zone: "hand" });
        if (distant) {
          player.activate(reposition, {
            reservePayment: [{ kind: "card", cardId: payments[0]!.objectId }],
            targets: { "target-1": [attacker.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[attacker.objectId]!.states.has("distant")).toBe(true);
        }
        if (!classBonus && !distant) {
          for (const invalid of [
            player.card(potionOfHealing),
            player.card(giantTortoise, { zone: "hand" }),
          ]) {
            const before = game.state;
            expect(() =>
              player.activate(takeAim, {
                reservePayment: payments
                  .slice(0, 2)
                  .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
                targets: { "target-1": [invalid.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
        }
        const remainingPayments = payments.slice(distant ? 1 : 0);
        const reservePayment = remainingPayments
          .slice(0, 2)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        const before = game.state;
        expect(() =>
          player.activate(takeAim, {
            reservePayment: reservePayment.slice(0, 1),
            targets: { "target-1": [attacker.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        player.activate(takeAim, {
          reservePayment,
          targets: { "target-1": [attacker.objectId] },
        });
        passEffectsStack(game);
        player.declareAttack(attacker, target);
        expect(game.state.stack).toHaveLength(1);
        passEffectsStack(game);
        game.resolveCombatWithoutRetaliation();
        const firstDamage = 3 + (classBonus && distant ? 2 : 0);
        expect(game.state.objects[target.objectId]!.damage).toBe(firstDamage);

        const turn = game.state.turn.number;
        advanceToNextOwnMain(game, turn);
        expect(game.state.objects[attacker.objectId]!.states.has("distant")).toBe(false);
        player.declareAttack(attacker, target);
        expect(game.state.stack).toHaveLength(0);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(firstDamage + 1);
      });
    }
  }
});
