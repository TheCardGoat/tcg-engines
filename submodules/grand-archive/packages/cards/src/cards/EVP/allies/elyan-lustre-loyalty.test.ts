import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { waveriderProtector } from "../../ALC/allies/waverider-protector.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { elyanLustreLoyalty } from "./elyan-lustre-loyalty.ts";

/** @covers 2jgiM0p4dt-a1 */
describe("Elyan, Lustre Loyalty — Class Bonus Stealth", () => {
  proveClassBonusStealth(elyanLustreLoyalty);
});

/** @covers 2jgiM0p4dt-a2 */
describe("Elyan, Lustre Loyalty — recovery scaling", () => {
  for (const amount of [1, 5] as const) {
    it(`gets +${amount} power and ${amount >= 4 ? "gains" : "does not gain"} unblockable`, () => {
      const champion = createClassBonusTestChampion(
        elyanLustreLoyalty,
        true,
        "activation-discount",
      );
      const recoveryCard = amount === 1 ? fraysia : potionOfHealing;
      const recoveryAbility = amount === 1 ? "soporhlq2k-a1" : "qtb31x97n2-a2";
      const opponentChampion = createClassBonusTestChampion(
        waveriderProtector,
        true,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [elyanLustreLoyalty, recoveryCard],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: opponentChampion,
          zones: {
            field: [waveriderProtector, ...Array.from({ length: amount }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const ownChampion = player.card(champion);
      for (const attacker of opponent.cards(woodlandSquirrels, { zone: "field" })) {
        opponent.declareAttack(attacker, ownChampion);
        game.resolveCombatWithoutRetaliation();
      }
      advanceToMain(game, player.id);
      player.activateAbility(player.card(recoveryCard), recoveryAbility);
      passEffectsStack(game);
      passEffectsStack(game);
      const source = player.card(elyanLustreLoyalty);
      const target = opponent.card(opponentChampion);
      if (amount < 4) {
        const before = game.state;
        expect(() => player.declareAttack(source, target)).toThrow();
        expect(game.state).toEqual(before);
        player.declareAttack(source, opponent.card(waveriderProtector));
      } else {
        player.declareAttack(source, target);
      }
      game.resolveCombatWithoutRetaliation();
      const defender = amount < 4 ? opponent.card(waveriderProtector) : target;
      expect(game.state.objects[defender.objectId]!.damage).toBe(2 + amount);
    });
  }
});
