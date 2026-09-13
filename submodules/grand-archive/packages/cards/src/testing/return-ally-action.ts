import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveReturnAllyAction({
  card,
  cost,
  controlledOnly = false,
  upTo,
  draw = 0,
  classBonus = false,
  level = 0,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  controlledOnly?: boolean;
  upTo?: number;
  draw?: number;
  classBonus?: boolean;
  level?: number;
}): void {
  for (const controller of controlledOnly ? ["player-one"] : ["player-one", "player-two"]) {
    for (const amount of upTo === undefined ? [1] : [0, 1, upTo]) {
      it(`returns ${amount} of ${controller}'s allies, Class Bonus=${classBonus}, level=${level}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(card, classBonus, "activation-discount"),
          level,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = game.player(controller);
        const allies = owner.cards(woodlandSquirrels, { zone: "field" });
        const ids = allies.slice(0, amount).map((c) => c.objectId);
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        const activate = (targetIds: readonly GrandArchiveTargetId[]) =>
          p.activate(card, { reservePayment, targets: { "target-1": targetIds } });
        expect(() => activate([p.card(champion).objectId])).toThrow();
        expect(game.state).toEqual(before);
        if (controlledOnly) {
          expect(() =>
            activate([q.cards(woodlandSquirrels, { zone: "field" })[0]!.objectId]),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        if (upTo !== undefined) {
          expect(() => activate(allies.map((c) => c.objectId))).toThrow();
          expect(game.state).toEqual(before);
        }
        if (cost > 0) {
          expect(() =>
            p.activate(card, {
              reservePayment: reservePayment.slice(1),
              targets: { "target-1": ids },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        activate(ids);
        expect(owner.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(3);
        passEffectsStack(game);
        expect(owner.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(3 - amount);
        for (const id of ids) {
          expect(owner.zone("hand").map((c) => c.objectId)).toContain(id);
          expect(game.state.objects[id]!.ownerId).toBe(owner.id);
        }
        expect(p.zone("hand")).toHaveLength((controller === p.id ? amount : 0) + draw);
        expect(q.zone("hand")).toHaveLength(controller === q.id ? amount : 0);
      });
    }
  }
}
