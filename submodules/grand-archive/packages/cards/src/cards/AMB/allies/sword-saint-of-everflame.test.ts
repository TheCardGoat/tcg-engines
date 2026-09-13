import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { dragonsDawn } from "../weapons/dragons-dawn.ts";
import { swordSaintOfEverflame } from "./sword-saint-of-everflame.ts";

/** @covers lpy7ie4v8n-a1 */
describe("Sword Saint of Everflame — Class Bonus graveyard buff", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "banishes itself and grants +2 POWER" : "cannot activate from the graveyard"}`, () => {
      const champion = createClassBonusTestChampion(
        swordSaintOfEverflame,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            graveyard: [swordSaintOfEverflame],
            field: [dragonsDawn],
            hand: [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const saint = player.card(swordSaintOfEverflame, { zone: "graveyard" });
      const fireWeapon = player.card(dragonsDawn, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      if (!classBonus) {
        const before = game.state;
        expect(() =>
          player.activateAbility(saint, "lpy7ie4v8n-a1", {
            reservePayment: payment,
            targets: { "target-1": [fireWeapon.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      const underpay = game.state;
      expect(() =>
        player.activateAbility(saint, "lpy7ie4v8n-a1", {
          reservePayment: payment.slice(0, 1),
          targets: { "target-1": [fireWeapon.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(underpay);
      player.activateAbility(saint, "lpy7ie4v8n-a1", {
        reservePayment: payment,
        targets: { "target-1": [fireWeapon.objectId] },
      });
      expect(game.state.objects[saint.objectId]!.zone).toBe("banishment");
      passEffectsStack(game);
      const target = opponent.card(champion, { zone: "field" });
      player.declareAttack(player.card(champion, { zone: "field" }), target, {
        weaponIds: [fireWeapon.objectId],
      });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(4);
    });
  }
});
