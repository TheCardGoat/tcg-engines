import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { zhangFeiSpiritedSteel } from "../allies/zhang-fei-spirited-steel.ts";
import { leadingCharge } from "./leading-charge.ts";

/** @covers WWnmb1Hjdo-a2 */
describe("Leading Charge — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: leadingCharge });
});

/** @covers WWnmb1Hjdo-a1 */
describe("Leading Charge — unique Warrior ally discount", () => {
  for (const [classBonus, uniqueWarrior] of [
    [true, true],
    [true, false],
    [false, true],
  ] as const) {
    it(`costs ${classBonus && uniqueWarrior ? 2 : 4} with class=${classBonus} unique=${uniqueWarrior}`, () => {
      const { starter } = classBonusLeveledChampion(leadingCharge, classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            field: uniqueWarrior ? [zhangFeiSpiritedSteel] : [woodlandSquirrels],
            hand: [leadingCharge, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion: starter },
      });
      const player = game.player("player-one");
      const attacker = player.card(starter, { zone: "field" });
      const cost = classBonus && uniqueWarrior ? 2 : 4;
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      if (cost > 0) {
        const before = game.state;
        expect(() =>
          player.activate(leadingCharge, {
            attackAttackerId: attacker.objectId,
            reservePayment: payment.slice(0, cost - 1),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      player.activate(leadingCharge, {
        attackAttackerId: attacker.objectId,
        reservePayment: payment,
      });
      expect(player.cards(leadingCharge, { zone: "effects-stack" })).toHaveLength(1);
    });
  }
});
