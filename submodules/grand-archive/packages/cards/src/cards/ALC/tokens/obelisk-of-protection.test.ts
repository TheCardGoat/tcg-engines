import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { supplyDrone } from "../allies/supply-drone.ts";
import { dormantSacrificialAltar } from "../domains/dormant-sacrificial-altar.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { obeliskOfProtection } from "./obelisk-of-protection.ts";

/** @covers d6soporhlq-a1 */
describe("Obelisk of Protection — Domain discount and shielding", () => {
  for (const additionalDomains of [0, 2]) {
    it(`costs ${3 - additionalDomains} with ${additionalDomains + 1} controlled Domains`, () => {
      const champion = createClassBonusTestChampion(
        obeliskOfProtection,
        false,
        "activation-discount",
      );
      const cost = 3 - additionalDomains;
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [
              obeliskOfProtection,
              supplyDrone,
              automatedGardener,
              potionOfHealing,
              ...Array.from({ length: additionalDomains }, () => dormantSacrificialAltar),
            ],
            hand: [automatedGardener, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [automatedGardener, automatedGardener, automatedGardener] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const source = player.card(obeliskOfProtection, { zone: "field" });
      const target = player.card(automatedGardener, { zone: "field" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      opponent.pass();
      for (const invalid of [
        player.card(potionOfHealing, { zone: "field" }),
        player.card(automatedGardener, { zone: "hand" }),
      ]) {
        const before = game.state;
        expect(() =>
          player.activateAbility(source, "d6soporhlq-a1", {
            reservePayment: payment,
            targets: { "target-1": [invalid.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      if (cost > 0) {
        const before = game.state;
        expect(() =>
          player.activateAbility(source, "d6soporhlq-a1", {
            reservePayment: payment.slice(1),
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      player.activateAbility(source, "d6soporhlq-a1", {
        reservePayment: payment,
        targets: { "target-1": [target.objectId] },
      });
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      passEffectsStack(game);

      const attackers = opponent.cards(automatedGardener, { zone: "field" });
      const unrelated = player.card(supplyDrone, { zone: "field" });
      opponent.declareAttack(attackers[0]!, unrelated);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[unrelated.objectId]!.damage).toBe(2);
      opponent.declareAttack(attackers[1]!, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(0);
      opponent.declareAttack(attackers[2]!, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(2);
    });
  }
});
