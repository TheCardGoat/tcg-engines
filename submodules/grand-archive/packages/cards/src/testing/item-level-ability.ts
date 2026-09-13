import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "./decisions.ts";
export function proveItemLevelAbility({
  card,
  abilityId,
  amount,
  banish = false,
  classBonus = false,
  restricted = false,
  entersRested = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  amount: number;
  banish?: boolean;
  classBonus?: boolean;
  restricted?: boolean;
  entersRested?: boolean;
}): void {
  it(`rest cost, own level +${amount}, class=${classBonus}, expires this turn`, () => {
    const champion = createClassBonusTestChampion(card, classBonus, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      phase: entersRested ? "materialize" : "main",
      playerOne: {
        champion,
        zones: {
          field: entersRested ? [] : [card],
          "material-deck": entersRested ? [card] : [],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      item = p.card(card);
    const level = (id: typeof p.id) =>
      deriveGrandArchiveNumericProperty(
        game.state.objects[game.player(id).card(champion).objectId]!,
        "level",
        { program: game.program, state: game.state, controllerId: id, bindings: {} },
      );
    if (entersRested) {
      p.materialize(card);
      passEffectsStack(game);
      expect(level(p.id)).toBe(2);
      const before = game.state;
      expect(() => p.activateAbility(item, abilityId)).toThrow();
      expect(game.state).toEqual(before);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
    }
    if (restricted && !classBonus) {
      const before = game.state;
      expect(() => p.activateAbility(item, abilityId)).toThrow();
      expect(game.state).toEqual(before);
      return;
    }
    p.activateAbility(item, abilityId);
    expect(level(p.id)).toBe(0);
    expect(game.state.objects[item.objectId]!.zone).toBe(banish ? "banishment" : "field");
    if (!banish) expect(game.state.objects[item.objectId]!.states.has("rested")).toBe(true);
    passEffectsStack(game);
    expect(level(p.id)).toBe(amount);
    expect(level(q.id)).toBe(0);
    const before = game.state;
    expect(() => p.activateAbility(item, abilityId)).toThrow();
    expect(game.state).toEqual(before);
    advanceToMain(game, q.id);
    expect(level(p.id)).toBe(0);
  });
}
