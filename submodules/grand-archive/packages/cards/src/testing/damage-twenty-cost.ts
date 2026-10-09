import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { remnantOfWill } from "../cards/PTM/actions/remnant-of-will.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function startDamageThresholdFixture(
  card: Card,
  matching: boolean,
  damage: number,
  hand: readonly Card[],
  field: readonly Card[] = [trainingSword, woodlandSquirrels],
) {
  const base = enableAllTestElements(
      createClassBonusTestChampion(card, matching, "activation-discount"),
    ),
    face = requireSingleFace(base);
  const champion = {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: { ...face, stats: { ...face.stats, life: 60, power: 1 } },
    },
  };
  const otherBase = enableAllTestElements(
      createClassBonusTestChampion(card, false, "activation-discount"),
    ),
    otherFace = requireSingleFace(otherBase);
  const opponent = grantTestChampionLevel(
    {
      ...otherBase,
      layout: {
        kind: "single-faced" as const,
        face: { ...otherFace, stats: { ...otherFace.stats, life: 60 } },
      },
    },
    Math.max(0, damage - 1),
  );
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: { field, hand, "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
    },
    playerTwo: {
      champion: opponent,
      zones: {
        field: [trainingSword],
        hand: damage
          ? [fireball, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels]
          : [],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    hero = p.card(champion);
  if (damage) {
    q.activate(fireball, {
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      targets: { "target-1": [hero.objectId] },
    });
    passEffectsStack(game);
  }
  expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
  advanceToMain(game, p.id);
  return { game, p, q, hero, champion, opponent };
}
export function proveDamageTwentyCost(card: Card, printedCost: number, destruction: boolean) {
  for (const matching of [false, true])
    for (const damage of [0, 19, 20, 21])
      for (const recover of [false, true])
        it(`class=${matching}, damage=${damage}, recover before activation=${recover}`, () => {
          const { game, p, q, hero } = startDamageThresholdFixture(card, matching, damage, [
            card,
            ...(recover ? [remnantOfWill] : []),
            ...Array.from({ length: printedCost + 1 }, () => woodlandSquirrels),
          ]);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (recover) {
            p.activate(remnantOfWill, { reservePayment: pay(1) });
            passEffectsStack(game);
          }
          const remaining = recover ? Math.max(0, damage - 4) : damage,
            cost = printedCost - (remaining >= 20 ? 2 : 0),
            memory = p.zone("memory").length,
            target = q.card(trainingSword);
          expect(game.state.objects[hero.objectId]!.damage).toBe(remaining);
          const options = destruction ? { targets: { "target-1": [target.objectId] } } : {},
            before = game.state;
          expect(() => p.activate(card, { ...options, reservePayment: pay(cost - 1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(card, { ...options, reservePayment: pay(cost) });
          expect(p.zone("memory")).toHaveLength(memory + cost);
          expect(game.state.objects[hero.objectId]!.damage).toBe(remaining);
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(remaining + (destruction ? 0 : 4));
          expect(p.card(card, { zone: "graveyard" })).toBeDefined();
          if (destruction) expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
        });
}
