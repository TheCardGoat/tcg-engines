import { expect, it } from "vitest";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveAdditionalSacrifice(
  card: Card,
  cost: number,
  sacrifices: readonly Card[],
  modeIds?: readonly string[],
  permanent = false,
): void {
  for (const sacrifice of sacrifices) {
    it(`requires one controlled field ${sacrifice.slug} before resolution`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [card, sacrifice, ...Array.from({ length: cost }, () => woodlandSquirrels)],
            field: [sacrifice, sacrifice, trainingSword, woodlandSquirrels],
            graveyard: [sacrifice],
          },
        },
        playerTwo: { champion, zones: { field: [sacrifice] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(card),
        donors = p.cards(sacrifice, { zone: "field" });
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const options = {
        reservePayment,
        ...(!permanent ? { targets: { "target-1": [q.card(champion).objectId] } } : {}),
        ...(modeIds ? { modeIds } : {}),
      };
      const before = game.state;
      for (const ids of [
        [],
        donors.map((c) => c.objectId),
        [donors[0]!.objectId, donors[0]!.objectId],
        [q.card(sacrifice).objectId],
        [p.card(sacrifice, { zone: "hand" }).objectId],
        [p.card(sacrifice, { zone: "graveyard" }).objectId],
        [p.card(trainingSword).objectId],
        [p.card(woodlandSquirrels, { zone: "field" }).objectId],
        [p.card(champion).objectId],
      ]) {
        expect(() => p.activate(source, { ...options, costSelections: [ids] })).toThrow();
        expect(game.state).toEqual(before);
      }
      expect(() =>
        p.activate(source, {
          ...options,
          reservePayment: reservePayment.slice(1),
          costSelections: [[donors[0]!.objectId]],
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(source, { ...options, costSelections: [[donors[0]!.objectId]] });
      expect(game.state.objects[donors[0]!.objectId]?.zone).not.toBe("field");
      expect(game.state.objects[donors[1]!.objectId]!.zone).toBe("field");
      expect(p.zone("memory")).toHaveLength(cost);
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
      expect(game.state.objects[source.objectId]!.zone).toBe(permanent ? "field" : "graveyard");
    });
  }
}
