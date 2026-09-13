import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
export function proveConditionalWeaponPower({
  card,
  classBonus,
  withAlly,
  targetAlly,
  expectedDamage,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  classBonus: boolean;
  withAlly: boolean;
  targetAlly: boolean;
  expectedDamage: number;
}): void {
  it(`deals ${expectedDamage}, class=${classBonus}, controlled ally=${withAlly}, target ally=${targetAlly}`, () => {
    const champion = createClassBonusTestChampion(card, classBonus, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [card, ...(withAlly ? [woodlandSquirrels] : [])] } },
      playerTwo: { champion, zones: { field: [card, giantTortoise] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const defender = q.card(targetAlly ? giantTortoise : champion);
    const before = game.state;
    expect(() =>
      p.declareAttack(p.card(champion), defender, { weaponIds: [q.card(card).objectId] }),
    ).toThrow();
    expect(game.state).toEqual(before);
    p.declareAttack(p.card(champion), defender, { weaponIds: [p.card(card).objectId] });
    expect(game.state.objects[defender.objectId]!.damage).toBe(0);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(expectedDamage);
  });
}
