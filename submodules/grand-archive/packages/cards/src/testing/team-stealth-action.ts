import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { stillwaterPatrol } from "../cards/DOA/allies/stillwater-patrol.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveTeamStealth({
  card,
  cost,
  championProtected,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  championProtected: boolean;
}): void {
  it("protects the printed own units, permits true sight, and expires at this turn's end", () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
          field: [giantTortoise, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels, stillwaterPatrol],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      tortoise = p.card(giantTortoise),
      hero = p.card(champion);
    q.pass();
    p.activate(card, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(p.cards(woodlandSquirrels, { zone: "memory" })).toHaveLength(cost);
    for (const target of [
      tortoise,
      p.card(woodlandSquirrels, { zone: "field" }),
      ...(championProtected ? [hero] : []),
    ]) {
      const before = game.state;
      expect(() => q.declareAttack(woodlandSquirrels, target)).toThrow();
      expect(game.state).toEqual(before);
    }
    if (!championProtected) {
      q.declareAttack(woodlandSquirrels, hero);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(1);
    }
    q.declareAttack(stillwaterPatrol, tortoise);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[tortoise.objectId]!.damage).toBe(3);
    advanceToMain(game, p.id);
    p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
    advanceToMain(game, q.id);
    q.declareAttack(woodlandSquirrels, tortoise);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[tortoise.objectId]!.damage).toBe(1);
  });
}
