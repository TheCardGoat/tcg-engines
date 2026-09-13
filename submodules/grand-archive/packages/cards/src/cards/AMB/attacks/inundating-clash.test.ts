import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { declareResolvedAttack, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { inundatingClash } from "./inundating-clash.ts";

/** @covers welp9q7c5l-a2 */
describe("Inundating Clash — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: inundatingClash });
});

/** @covers welp9q7c5l-a1 */
describe("Inundating Clash — Class Bonus rested target", () => {
  for (const [classBonus, rested] of [
    [true, true],
    [true, false],
    [false, true],
  ] as const) {
    it(`deals ${classBonus && rested ? 4 : 1} with class=${classBonus} rested=${rested}`, () => {
      const { starter } = classBonusLeveledChampion(inundatingClash, classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            hand: [
              inundatingClash,
              ...(rested ? [glacialGuidance] : []),
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: starter,
          zones: {
            field: [automatedGardener],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const attacker = player.card(starter, { zone: "field" });
      const ally = opponent.card(automatedGardener, { zone: "field" });
      if (rested) {
        player.activate(glacialGuidance, {
          targets: { "target-1": [ally.objectId] },
          reservePayment: [
            {
              kind: "card",
              cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
            },
          ],
        });
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
      }
      player.activate(inundatingClash, {
        attackAttackerId: attacker.objectId,
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      declareResolvedAttack(game, attacker.objectId, ally.objectId, "declare Inundating Clash");
      game.resolveCombatWithoutRetaliation();
      if (classBonus && rested) {
        expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
      } else {
        expect(game.state.objects[ally.objectId]!.damage).toBe(1);
      }
    });
  }
});
