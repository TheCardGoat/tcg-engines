import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { dormantSacrificialAltar } from "../domains/dormant-sacrificial-altar.ts";
import { automatonDrone } from "../tokens/automaton-drone.ts";
import { summonSentinels } from "./summon-sentinels.ts";

/** @covers 5tlzsmw3rr-a1 @covers 5tlzsmw3rr-a2 */
describe("Summon Sentinels — Domain discount and buffed tokens", () => {
  for (const classBonus of [false, true]) {
    for (const domains of [0, 1, 4]) {
      it(`Class Bonus=${classBonus}, controlled Domains=${domains}`, () => {
        const champion = createClassBonusTestChampion(
          summonSentinels,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [summonSentinels, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              field: [
                automatedGardener,
                ...Array.from({ length: domains }, () => dormantSacrificialAltar),
              ],
            },
          },
          playerTwo: {
            champion,
            // Register the printed token representation through a legal field object;
            // the summoned copies still belong exclusively to player one.
            zones: {
              field: [automatonDrone, ...Array.from({ length: 4 }, () => dormantSacrificialAltar)],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const source = player.card(summonSentinels);
        const cost = classBonus ? Math.max(0, 4 - domains) : 4;
        const payment = player.cards(woodlandSquirrels, { zone: "hand" }).slice(0, cost);
        if (cost > 0) {
          const before = game.state;
          expect(() =>
            player.activate(source, {
              reservePayment: payment
                .slice(1)
                .map((card) => ({ kind: "card", cardId: card.objectId })),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        player.activate(source, {
          reservePayment: payment.map((card) => ({ kind: "card", cardId: card.objectId })),
        });
        expect(player.zone("memory")).toEqual(payment);
        expect(player.cards(automatonDrone, { zone: "field" })).toHaveLength(0);
        passEffectsStack(game);
        expect(player.zone("graveyard")).toEqual([source]);
        const tokens = player.cards(automatonDrone, { zone: "field" });
        expect(tokens).toHaveLength(2);
        for (const token of tokens) {
          expect(game.state.objects[token.objectId]!.isToken).toBe(true);
          expect(game.state.objects[token.objectId]!.counters.buff).toBe(1);
          expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(false);
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id)
            game.player(wait.playerId).pass();
          player.declareAttack(token, opponent.card(champion));
          game.resolveCombatWithoutRetaliation();
        }
        expect(game.state.objects[opponent.card(champion).objectId]!.damage).toBe(4);
        expect(player.cards(automatedGardener, { zone: "field" })).toHaveLength(1);
        expect(opponent.cards(dormantSacrificialAltar, { zone: "field" })).toHaveLength(4);
        expect(opponent.cards(automatonDrone, { zone: "field" })).toHaveLength(1);
      });
    }
  }
});
