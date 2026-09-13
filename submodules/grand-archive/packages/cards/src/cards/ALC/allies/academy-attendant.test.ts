import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { academyAttendant } from "./academy-attendant.ts";

/** @covers m4c8ljyevp-a1 */
describe("Academy Attendant — live Class Bonus and Memory 4+", () => {
  for (const classBonus of [false, true]) {
    for (const initialMemory of [3, 4, 5]) {
      it(`Class Bonus=${classBonus}, initial memory=${initialMemory}`, () => {
        const champion = createClassBonusTestChampion(
          academyAttendant,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [academyAttendant, academyAttendant, academyAttendant],
              memory: Array.from({ length: initialMemory }, () => woodlandSquirrels),
              hand: [potionOfHealing, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              memory: Array.from({ length: 5 }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const attendants = player.cards(academyAttendant);
        const target = opponent.card(champion);
        const ready = () => {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id)
            game.player(wait.playerId).pass();
        };
        const attack = (index: number, expectedDamage: number) => {
          ready();
          const before = game.state.objects[target.objectId]!.damage;
          player.declareAttack(attendants[index]!, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(before + expectedDamage);
        };
        // The opponent's five memory cards cannot enable our restriction.
        attack(0, classBonus && initialMemory >= 4 ? 3 : 2);
        ready();
        player.activate(potionOfHealing, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        expect(player.zone("memory")).toHaveLength(initialMemory + 3);
        passEffectsStack(game);
        attack(1, classBonus ? 3 : 2);
        // Recollection removes the live bonus without removing or replaying the ally.
        advanceToRecollection(game, opponent.id);
        advanceToRecollection(game, player.id);
        for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn.phase).toBe("main");
        expect(player.zone("memory")).toHaveLength(0);
        attack(2, 2);
        expect(player.cards(academyAttendant, { zone: "field" })).toEqual(attendants);
      });
    }
  }
});
