import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { advanceToMain } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

export function proveAllyCombatStats({
  card,
  power,
  life,
  classBonus = false,
  level = 0,
  allies = [],
  hand = 0,
  memory = 0,
  graveyard = [],
}: {
  card: Card;
  power: number;
  life: number;
  classBonus?: boolean;
  level?: number;
  allies?: readonly Card[];
  hand?: number;
  memory?: number;
  graveyard?: readonly Card[];
}): void {
  it(`deals ${power} and survives until ${life} damage (class=${classBonus}, level=${level}, allies=${allies.length}, hand=${hand}, memory=${memory}, graveyard=${graveyard.length})`, () => {
    const champion = grantTestChampionLevel(
      createClassBonusTestChampion(card, classBonus, "activation-discount"),
      level,
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [card, ...allies],
          hand: Array.from({ length: hand }, () => woodlandSquirrels),
          memory: Array.from({ length: memory }, () => woodlandSquirrels),
          graveyard,
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: Array.from({ length: life }, () => woodlandSquirrels),
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      ally = p.card(card);
    p.declareAttack(ally, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(power);
    advanceToMain(game, q.id);
    for (const [index, attacker] of q.cards(woodlandSquirrels, { zone: "field" }).entries()) {
      q.declareAttack(attacker, ally);
      game.resolveCombatWithoutRetaliation();
      expect(p.cards(card, { zone: "field" })).toHaveLength(index + 1 < life ? 1 : 0);
    }
    expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
  });
}
