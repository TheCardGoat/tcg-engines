import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveSummonAction({
  card,
  cost,
  tokens,
  rested = false,
  buff = 0,
  sheen = 0,
  sacrificeAlly = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  tokens: readonly { card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>; count: number }[];
  rested?: boolean;
  buff?: number;
  sheen?: number;
  sacrificeAlly?: boolean;
}): void {
  for (const existing of [false, true])
    it(`summons the printed tokens and preserves existing objects, existing=${existing}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const definitions = tokens.map((token) => token.card);
      const game = GrandArchiveTestEngine.startFixture({
        definitions,
        playerOne: {
          champion,
          zones: {
            field: [giantTortoise, trainingSword, ...(existing ? definitions : [])],
            hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion, zones: { field: [giantTortoise, ...definitions] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const initial = new Set(p.zone("field").map((ref) => ref.objectId));
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const costSelections = sacrificeAlly ? [[p.card(giantTortoise).objectId]] : undefined;
      const before = game.state;
      expect(() =>
        p.activate(card, { reservePayment: reservePayment.slice(1), costSelections }),
      ).toThrow();
      expect(game.state).toEqual(before);
      if (sacrificeAlly) {
        for (const selection of [
          [],
          [p.card(trainingSword).objectId],
          [q.card(giantTortoise).objectId],
        ]) {
          expect(() => p.activate(card, { reservePayment, costSelections: [selection] })).toThrow();
          expect(game.state).toEqual(before);
        }
      }
      p.activate(card, { reservePayment, costSelections });
      for (const token of tokens)
        expect(p.cards(token.card, { zone: "field" })).toHaveLength(existing ? 1 : 0);
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      for (const token of tokens) {
        const refs = p.cards(token.card, { zone: "field" });
        expect(refs).toHaveLength(token.count + (existing ? 1 : 0));
        for (const ref of refs.filter((ref) => !initial.has(ref.objectId))) {
          const object = game.state.objects[ref.objectId]!;
          expect(object.isToken).toBe(true);
          expect(object.controllerId).toBe(p.id);
          expect(object.ownerId).toBe(p.id);
          expect(object.states.has("rested")).toBe(rested);
          expect(object.counters.buff ?? 0).toBe(buff);
          expect(object.counters["named:sheen"] ?? 0).toBe(sheen);
        }
        expect(q.cards(token.card, { zone: "field" })).toHaveLength(1);
      }
      expect(p.cards(giantTortoise, { zone: sacrificeAlly ? "graveyard" : "field" })).toHaveLength(
        1,
      );
      expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
    });
}
