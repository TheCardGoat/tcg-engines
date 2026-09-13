import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveFixedDamageAction({
  card,
  cost,
  damage,
  targetKind,
  level = 0,
  classBonus = false,
  preparation = 0,
  draw = 0,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  damage: number;
  targetKind: "ally" | "champion" | "unit";
  level?: number;
  classBonus?: boolean;
  preparation?: number;
  draw?: number;
}): void {
  for (const controller of ["player-one", "player-two"]) {
    for (const kind of targetKind === "unit" ? ["ally", "champion"] : [targetKind]) {
      it(`deals ${damage} to ${controller}'s ${kind} at level ${level}, Class Bonus=${classBonus}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(card, classBonus, "activation-discount"),
          level,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              field: [giantTortoise, trainingSword],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const target = game
          .player(controller)
          .card(kind === "ally" ? giantTortoise : champion, { zone: "field" });
        const payments = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const options = { reservePayment: payments, targets: { "target-1": [target.objectId] } };
        const before = game.state;
        expect(() =>
          p.activate(card, {
            ...options,
            targets: { "target-1": [p.card(trainingSword).objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (cost > 0) {
          expect(() =>
            p.activate(card, { ...options, reservePayment: payments.slice(1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(card, options);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        expect(p.zone("hand")).toHaveLength(0);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(damage);
        expect(p.zone("hand")).toHaveLength(draw);
        expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(
          preparation,
        );
        expect(game.state.objects[q.card(champion).objectId]!.counters.preparation ?? 0).toBe(0);
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
      });
    }
  }
}
