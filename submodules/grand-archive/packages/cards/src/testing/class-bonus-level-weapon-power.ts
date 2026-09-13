import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { savageArrow } from "../cards/AMB/items/savage-arrow.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { classBonusLeveledChampion, printedWeaponPower } from "./class-bonus-level.ts";
import { passEffectsStack } from "./decisions.ts";

/** Class Bonus [Level 2+] weapon power: matching class at level 2 versus level 1 and a mismatch. */
export function proveClassBonusLevelWeaponPower({
  card,
  bonus,
  attackReserveCost = 0,
  loadBow = false,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly bonus: number;
  readonly attackReserveCost?: number;
  readonly loadBow?: boolean;
}): void {
  const printed = printedWeaponPower(card) + (loadBow ? 3 : 0);

  function setup(classBonusEnabled: boolean, level: number) {
    const { starter, lineage } = classBonusLeveledChampion(card, classBonusEnabled, level);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage,
        zones: {
          field: loadBow ? [card, savageArrow] : [card],
          hand: Array.from({ length: Math.max(attackReserveCost, 0) }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion: starter },
    });
    if (loadBow) {
      const player = game.player("player-one");
      player.activateAbility(savageArrow, "uuty5scwug-a1", {
        targets: { "target-weapon": [player.card(card, { zone: "field" }).objectId] },
      });
      passEffectsStack(game);
    }
    return { game, starter };
  }

  function swing(classBonusEnabled: boolean, level: number, expectedDamage: number): void {
    const { game, starter } = setup(classBonusEnabled, level);
    const player = game.player("player-one");
    const attacker = player.card(starter, { zone: "field" });
    const target = game.player("player-two").card(starter, { zone: "field" });
    const weapon = player.card(card, { zone: "field" });
    const reservePayment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, attackReserveCost)
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    if (attackReserveCost > 0) {
      const before = game.state;
      expect(() =>
        player.declareAttack(attacker, target, {
          weaponIds: [weapon.objectId],
          reservePayment: reservePayment.slice(0, attackReserveCost - 1),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    player.declareAttack(attacker, target, {
      weaponIds: [weapon.objectId],
      ...(attackReserveCost > 0 ? { reservePayment } : {}),
    });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(expectedDamage);
  }

  it("adds its Class Bonus [Level 2+] power only for a matching level 2 champion", () => {
    swing(true, 2, printed + bonus);
  });

  it("keeps printed power for a matching level 1 champion", () => {
    swing(true, 1, printed);
  });

  it("keeps printed power for a level 2 champion of another class", () => {
    swing(false, 2, printed);
  });
}
