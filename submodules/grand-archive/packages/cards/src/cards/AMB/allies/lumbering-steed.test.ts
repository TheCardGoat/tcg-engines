import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { lumberingSteed } from "./lumbering-steed.ts";

/** @covers ic1ahsmwd0-a2 */
describe("Lumbering Steed — reserve life pump", () => {
  for (const pumped of [false, true]) {
    it(`${pumped ? "survives" : "dies to"} 3 damage after paying for the ability=${pumped}`, () => {
      const champion = createClassBonusTestChampion(lumberingSteed, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [lumberingSteed],
            hand: [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [automatedGardener, woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      if (pumped) {
        opponent.pass();
        const before = game.state;
        expect(() =>
          player.activateAbility(lumberingSteed, "ic1ahsmwd0-a2", {
            reservePayment: [
              {
                kind: "card",
                cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
              },
            ],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        player.activateAbility(lumberingSteed, "ic1ahsmwd0-a2", {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        });
        expect(player.zone("memory")).toHaveLength(2);
        passEffectsStack(game);
      }
      const wait = game.waitState();
      if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
        game.player(wait.playerId).pass();
      opponent.declareAttack(automatedGardener, lumberingSteed);
      game.resolveCombatWithoutRetaliation();
      const next = game.waitState();
      if (next.kind === "opportunity" && next.playerId !== opponent.id)
        game.player(next.playerId).pass();
      opponent.declareAttack(woodlandSquirrels, lumberingSteed);
      game.resolveCombatWithoutRetaliation();
      expect(player.cards(lumberingSteed, { zone: "field" })).toHaveLength(pumped ? 1 : 0);
    });
  }
});
