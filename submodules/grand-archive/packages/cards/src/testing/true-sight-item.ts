import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { patientRogue } from "../cards/DOA/allies/patient-rogue.ts";
import { blitzMage } from "../cards/DOA/allies/blitz-mage.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveTrueSightItem({
  card,
  abilityId,
  powerBonus,
  draw,
  animalOnly,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  powerBonus: number;
  draw: boolean;
  animalOnly: boolean;
}): void {
  it("pays banishment, respects own-ally restrictions, attacks stealth, and expires", () => {
    const champion = createClassBonusTestChampion(patientRogue, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [card, giantTortoise, blitzMage],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [patientRogue, patientRogue],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      item = p.card(card),
      ally = p.card(giantTortoise),
      enemies = q.cards(patientRogue);
    for (const target of [
      q.card(champion),
      p.card(champion),
      enemies[0]!,
      ...(animalOnly ? [p.card(blitzMage)] : []),
    ]) {
      const before = game.state;
      expect(() =>
        p.activateAbility(item, abilityId, { targets: { "target-1": [target.objectId] } }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    const before = game.state;
    expect(() => p.declareAttack(ally, enemies[0]!)).toThrow();
    expect(game.state).toEqual(before);
    p.activateAbility(item, abilityId, { targets: { "target-1": [ally.objectId] } });
    expect(game.state.objects[item.objectId]!.zone).toBe("banishment");
    expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(0);
    passEffectsStack(game);
    expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(draw ? 1 : 0);
    p.declareAttack(ally, enemies[0]!);
    game.resolveCombatWithoutRetaliation();
    if (powerBonus) expect(game.state.objects[enemies[0]!.objectId]!.zone).toBe("graveyard");
    else expect(game.state.objects[enemies[0]!.objectId]!.damage).toBe(1);
    const after = game.state;
    expect(() =>
      p.activateAbility(item, abilityId, { targets: { "target-1": [ally.objectId] } }),
    ).toThrow();
    expect(game.state).toEqual(after);
    advanceToMain(game, q.id, -1, true);
    advanceToMain(game, p.id);
    const expired = game.state;
    expect(() => p.declareAttack(ally, enemies[1]!)).toThrow();
    expect(game.state).toEqual(expired);
    p.declareAttack(ally, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
  });
}
