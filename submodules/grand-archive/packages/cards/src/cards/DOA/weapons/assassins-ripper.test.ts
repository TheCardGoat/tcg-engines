import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { assassinsRipper } from "./assassins-ripper.ts";
import { acceptedContract } from "../actions/accepted-contract.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 8yzADlgx4R-a1 */
describe("Assassin's Ripper's paid temporary weapon power", () => {
  for (const classBonus of [false, true])
    it(`requires class=${classBonus}, rest, and one preparation counter`, () => {
      const champion = createClassBonusTestChampion(
        assassinsRipper,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [assassinsRipper],
            hand: [acceptedContract, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [assassinsRipper], "main-deck": [woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        weapon = p.card(assassinsRipper),
        hero = p.card(champion);
      const missing = game.state;
      expect(() => p.activateAbility(weapon, "8yzADlgx4R-a1")).toThrow();
      expect(game.state).toEqual(missing);
      p.activate(acceptedContract, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(3);
      if (!classBonus) {
        const before = game.state;
        expect(() => p.activateAbility(weapon, "8yzADlgx4R-a1")).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      p.activateAbility(weapon, "8yzADlgx4R-a1");
      expect(game.state.objects[weapon.objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(2);
      passEffectsStack(game);
      const rested = game.state;
      expect(() => p.activateAbility(weapon, "8yzADlgx4R-a1")).toThrow();
      expect(game.state).toEqual(rested);
      p.declareAttack(hero, q.card(champion), { weaponIds: [weapon.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
      expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(1);
      advanceToMain(game, q.id);
      q.declareAttack(q.card(champion), hero, { weaponIds: [q.card(assassinsRipper).objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(1);
      advanceToMain(game, p.id);
      p.declareAttack(hero, q.card(champion), { weaponIds: [weapon.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(4);
    });
});
