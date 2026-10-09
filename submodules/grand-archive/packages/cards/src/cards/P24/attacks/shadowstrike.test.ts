import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { shadowstrike } from "./shadowstrike.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers o191zv86la-a1
 * @covers o191zv86la-a2
 */
describe("Shadowstrike", () => {
  for (const amount of [1, 2, 3])
    it(`spends ${amount} preparation for ${amount} additional power`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(shadowstrike, true, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              shadowstrike,
              acceptedContract,
              ...Array.from({ length: 7 }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        foe = q.card(champion);
      p.activate(acceptedContract, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 5)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(3);
      const options = {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        attackAttackerId: hero.objectId,
        prepareAbilityIndexes: [0] as const,
      };
      for (const invalid of [0, 4]) {
        const before = game.state;
        expect(() => p.activate(shadowstrike, { ...options, variables: { X: invalid } })).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(shadowstrike, { ...options, variables: { X: amount } });
      expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(3 - amount);
      passEffectsStack(game);
      declareResolvedAttack(game, hero.objectId, foe.objectId, "Declare Shadowstrike");
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[foe.objectId]!.damage).toBe(4 + amount);
    });
});
