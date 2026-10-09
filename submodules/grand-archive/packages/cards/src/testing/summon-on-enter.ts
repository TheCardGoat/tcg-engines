import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveSummonOnEnter({
  card,
  token,
  cost,
  count,
  abilityId,
  materialize = false,
  rested = false,
  buff = 0,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  token: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  count: number;
  abilityId: string;
  materialize?: boolean;
  rested?: boolean;
  buff?: number;
}): void {
  for (const existing of [false, true])
    it(`summons only when its entry trigger resolves, existing=${existing}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const payments = Array.from({ length: cost }, () => woodlandSquirrels);
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [token],
        phase: materialize ? "materialize" : "main",
        playerOne: {
          champion,
          zones: {
            field: existing ? [token] : [],
            hand: materialize ? [] : [card, ...payments],
            memory: materialize ? payments : [],
            "material-deck": materialize ? [card] : [],
          },
        },
        playerTwo: { champion, zones: { field: [token] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const oldIds = p.cards(token, { zone: "field" }).map((ref) => ref.objectId);
      const opposing = q.card(token).objectId;
      if (materialize) p.materialize(card);
      else
        p.activate(card, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        });
      expect(p.cards(token, { zone: "field" })).toHaveLength(existing ? 1 : 0);
      p.pass();
      q.pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
        ),
      ).toBe(true);
      expect(p.cards(token, { zone: "field" })).toHaveLength(existing ? 1 : 0);
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      const refs = p.cards(token, { zone: "field" });
      expect(refs).toHaveLength(count + (existing ? 1 : 0));
      for (const ref of refs) {
        const object = game.state.objects[ref.objectId]!;
        expect(object.controllerId).toBe(p.id);
        expect(object.ownerId).toBe(p.id);
        expect(object.states.has("rested")).toBe(oldIds.includes(ref.objectId) ? false : rested);
        expect(object.counters.buff ?? 0).toBe(oldIds.includes(ref.objectId) ? 0 : buff);
        if (!oldIds.includes(ref.objectId)) expect(object.isToken).toBe(true);
      }
      expect(q.cards(token, { zone: "field" }).map((ref) => ref.objectId)).toEqual([opposing]);
      expect(game.state.objects[opposing]!.states.has("rested")).toBe(false);
      expect(game.state.objects[opposing]!.counters.buff ?? 0).toBe(0);
      expect(p.cards(card, { zone: materialize ? "material-deck" : "hand" })).toHaveLength(0);
      expect(game.state.stack).toHaveLength(0);
    });
}
