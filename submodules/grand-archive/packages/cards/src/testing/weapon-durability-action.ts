import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { curvedDagger } from "../cards/DOA/weapons/curved-dagger.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveWeaponDurabilityAction({
  card,
  cost,
  amount,
  swordOnly,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  amount: number;
  swordOnly: boolean;
}): void {
  for (const weapon of swordOnly ? [trainingSword] : [trainingSword, curvedDagger])
    it(`adds ${amount} counters only to the controlled ${weapon.slug} on resolution`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
            field: [trainingSword, curvedDagger, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [trainingSword] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        target = p.card(weapon);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const wrong = [
        p.card(woodlandSquirrels, { zone: "field" }),
        q.card(trainingSword),
        ...(swordOnly ? [p.card(curvedDagger)] : []),
      ];
      for (const ref of wrong) {
        const before = game.state;
        expect(() =>
          p.activate(card, { reservePayment: payment, targets: { "target-1": [ref.objectId] } }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      const starting = weapon === trainingSword ? 2 : 1;
      p.activate(card, { reservePayment: payment, targets: { "target-1": [target.objectId] } });
      expect(game.state.objects[target.objectId]!.counters.durability).toBe(starting);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.counters.durability).toBe(starting + amount);
      expect(game.state.objects[q.card(trainingSword).objectId]!.counters.durability).toBe(2);
      p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [target.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.counters.durability).toBe(starting + amount - 1);
    });
}
